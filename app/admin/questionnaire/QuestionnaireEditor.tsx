'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { HIDDEN_QUESTION_IDS } from '@/lib/onboard-required'
import { ANSWER_TYPES, CHOICE_ANSWER_TYPES, type AnswerType } from '@/lib/types'

type OptionDraft = {
  key: string
  id: number | null
  label: string
  followUp: string
}

type QuestionDraft = {
  key: string
  id: number | null
  label: string
  answerType: AnswerType
  helpText: string
  required: boolean
  answerCount: number
  options: OptionDraft[]
}

type SectionDraft = {
  key: string
  id: number | null
  name: string
  questions: QuestionDraft[]
}

type PartDraft = {
  key: string
  id: number | null
  name: string
  sections: SectionDraft[]
}

type ApiOption = {
  id: number
  label: string
  follow_up_prompt: string | null
}

type ApiQuestion = {
  id: number
  label: string
  answer_type: AnswerType
  help_text: string | null
  required: boolean
  answer_count: number
  options: ApiOption[]
}

type ApiSection = {
  id: number
  name: string
  questions: ApiQuestion[]
}

type ApiPart = {
  id: number
  name: string
  categories: ApiSection[]
}

const inputClass =
  'w-full px-3 py-2 border border-slate-200 rounded-lg text-navy-900 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'

const ANSWER_LABELS: Record<AnswerType, string> = {
  textarea: 'Long text',
  text: 'Short text',
  number: 'Number',
  dropdown: 'Dropdown',
  radio: 'Radio',
  checkbox: 'Checkboxes',
}

function snapshot(parts: PartDraft[]) {
  return JSON.stringify(parts.map(part => ({
    id: part.id,
    name: part.name,
    sections: part.sections.map(section => ({
      id: section.id,
      name: section.name,
      questions: section.questions.map(question => ({
        id: question.id,
        label: question.label,
        answerType: question.answerType,
        helpText: question.helpText,
        required: question.required,
        options: question.options.map(option => ({
          id: option.id,
          label: option.label,
          followUp: option.followUp,
        })),
      })),
    })),
  })))
}

function fromApi(parts: ApiPart[]): PartDraft[] {
  return parts.map(part => ({
    key: `part-${part.id}`,
    id: part.id,
    name: part.name,
    sections: part.categories.map(section => ({
      key: `section-${section.id}`,
      id: section.id,
      name: section.name,
      questions: section.questions.map(question => ({
        key: `question-${question.id}`,
        id: question.id,
        label: question.label,
        answerType: question.answer_type,
        helpText: question.help_text ?? '',
        required: question.required,
        answerCount: question.answer_count,
        options: question.options.map(option => ({
          key: `option-${option.id}`,
          id: option.id,
          label: option.label,
          followUp: option.follow_up_prompt ?? '',
        })),
      })),
    })),
  }))
}

function toPayload(parts: PartDraft[]) {
  return parts.map(part => ({
    id: part.id,
    name: part.name,
    categories: part.sections.map(section => ({
      id: section.id,
      name: section.name,
      questions: section.questions.map(question => ({
        id: question.id,
        label: question.label,
        answer_type: question.answerType,
        help_text: question.helpText,
        required: question.required,
        options: question.options.map(option => ({
          id: option.id,
          label: option.label,
          follow_up_prompt: option.followUp,
        })),
      })),
    })),
  }))
}

function cloneQuestion(question: QuestionDraft): QuestionDraft {
  return { ...question, options: question.options.map(option => ({ ...option })) }
}

export function QuestionnaireEditor() {
  const keys = useRef(0)
  const [parts, setParts] = useState<PartDraft[]>([])
  const [baseline, setBaseline] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [revertQuestion, setRevertQuestion] = useState<QuestionDraft | null>(null)
  const [revertSectionKey, setRevertSectionKey] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [addingPart, setAddingPart] = useState(false)
  const [partName, setPartName] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [renaming, setRenaming] = useState<{ kind: 'part' | 'section'; key: string; name: string } | null>(null)
  const dirty = !loading && snapshot(parts) !== baseline

  function nextKey(prefix: string) {
    keys.current += 1
    return `${prefix}-new-${keys.current}`
  }

  const applyLoaded = useCallback((loaded: ApiPart[]) => {
    const draft = fromApi(loaded)
    setParts(draft)
    setBaseline(snapshot(draft))
    setSelectedKey(current => {
      if (current && draft.some(part => part.sections.some(section => section.key === current))) return current
      return draft.flatMap(part => part.sections)[0]?.key ?? null
    })
  }, [])

  useEffect(() => {
    fetch('/api/admin/questionnaire')
      .then(async res => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Failed to load.')
        applyLoaded(data.parts ?? [])
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load.'))
      .finally(() => setLoading(false))
  }, [applyLoaded])

  useEffect(() => {
    if (!dirty) return
    function onLeave(event: BeforeUnloadEvent) {
      event.preventDefault()
    }
    window.addEventListener('beforeunload', onLeave)
    return () => window.removeEventListener('beforeunload', onLeave)
  }, [dirty])

  const selected = useMemo(() => {
    for (const part of parts) {
      const section = part.sections.find(item => item.key === selectedKey)
      if (section) return { part, section }
    }
    return null
  }, [parts, selectedKey])

  const sectionChoices = useMemo(
    () => parts.flatMap(part => part.sections.map(section => ({
      key: section.key,
      label: `${part.name || 'Untitled part'} — ${section.name || 'Untitled category'}`,
    }))),
    [parts],
  )

  const questions = useMemo(() => {
    const rows = selected?.section.questions ?? []
    const needle = query.trim().toLowerCase()
    if (!needle) return rows
    return rows.filter(question => question.label.toLowerCase().includes(needle))
  }, [selected, query])

  function updatePart(partKey: string, patch: Partial<PartDraft>) {
    setParts(current => current.map(part => part.key === partKey ? { ...part, ...patch } : part))
  }

  function updateSection(sectionKey: string, patch: Partial<SectionDraft>) {
    setParts(current => current.map(part => ({
      ...part,
      sections: part.sections.map(section => section.key === sectionKey ? { ...section, ...patch } : section),
    })))
  }

  function updateQuestion(questionKey: string, patch: Partial<QuestionDraft>) {
    setParts(current => current.map(part => ({
      ...part,
      sections: part.sections.map(section => ({
        ...section,
        questions: section.questions.map(question => question.key === questionKey ? { ...question, ...patch } : question),
      })),
    })))
  }

  function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= items.length) return items
    const next = [...items]
    const current = next[index]
    next[index] = next[target]
    next[target] = current
    return next
  }

  function moveSectionToPart(sectionKey: string, partKey: string) {
    setParts(current => {
      const owner = current.find(part => part.sections.some(section => section.key === sectionKey))
      if (!owner || owner.key === partKey) return current
      let moving: SectionDraft | null = null
      const stripped = current.map(part => ({
        ...part,
        sections: part.sections.filter(section => {
          if (section.key !== sectionKey) return true
          moving = section
          return false
        }),
      }))
      if (!moving) return current
      return stripped.map(part => part.key === partKey ? { ...part, sections: [...part.sections, moving as SectionDraft] } : part)
    })
  }

  function moveQuestionToSection(questionKey: string, sectionKey: string) {
    setParts(current => {
      const owner = current.flatMap(part => part.sections).find(section => section.questions.some(question => question.key === questionKey))
      if (!owner || owner.key === sectionKey) return current
      let moving: QuestionDraft | null = null
      const stripped = current.map(part => ({
        ...part,
        sections: part.sections.map(section => ({
          ...section,
          questions: section.questions.filter(question => {
            if (question.key !== questionKey) return true
            moving = question
            return false
          }),
        })),
      }))
      if (!moving) return current
      return stripped.map(part => ({
        ...part,
        sections: part.sections.map(section => section.key === sectionKey
          ? { ...section, questions: [...section.questions, moving as QuestionDraft] }
          : section),
      }))
    })
    setSelectedKey(sectionKey)
  }

  function addPart(event: React.FormEvent) {
    event.preventDefault()
    const name = partName.trim()
    if (!name) return
    const key = nextKey('part')
    setParts(current => [...current, { key, id: null, name, sections: [] }])
    setPartName('')
    setAddingPart(false)
  }

  function addSection(partKey: string, name: string) {
    const key = nextKey('section')
    setParts(current => current.map(part => part.key === partKey
      ? { ...part, sections: [...part.sections, { key, id: null, name, questions: [] }] }
      : part))
    setSelectedKey(key)
    setOpenKey(null)
  }

  function addCategory(event: React.FormEvent) {
    event.preventDefault()
    if (!selected) return
    const name = categoryName.trim()
    if (!name) return
    addSection(selected.part.key, name)
    setCategoryName('')
    setAddingCategory(false)
  }

  function saveRename(event: React.FormEvent) {
    event.preventDefault()
    if (!renaming) return
    const name = renaming.name.trim()
    if (!name) return
    if (renaming.kind === 'part') updatePart(renaming.key, { name })
    else updateSection(renaming.key, { name })
    setRenaming(null)
  }

  function addQuestion() {
    if (!selected) return
    const key = nextKey('question')
    const question: QuestionDraft = {
      key,
      id: null,
      label: '',
      answerType: 'textarea',
      helpText: '',
      required: false,
      answerCount: 0,
      options: [],
    }
    setParts(current => current.map(part => ({
      ...part,
      sections: part.sections.map(section => section.key === selected.section.key
        ? { ...section, questions: [question, ...section.questions] }
        : section),
    })))
    setRevertQuestion(null)
    setRevertSectionKey(selected.section.key)
    setQuery('')
    setOpenKey(key)
  }

  function openQuestion(question: QuestionDraft) {
    setRevertQuestion(cloneQuestion(question))
    setRevertSectionKey(selected?.section.key ?? null)
    setOpenKey(question.key)
  }

  function closeQuestion(questionKey: string) {
    if (!revertQuestion) {
      removeQuestion(questionKey)
      return
    }
    updateQuestion(revertQuestion.key, revertQuestion)
    if (revertSectionKey) moveQuestionToSection(questionKey, revertSectionKey)
    setOpenKey(null)
    setRevertQuestion(null)
    setRevertSectionKey(null)
  }

  function selectSection(sectionKey: string) {
    if (openKey && !revertQuestion) removeQuestion(openKey)
    setOpenKey(null)
    setRevertQuestion(null)
    setRevertSectionKey(null)
    setSelectedKey(sectionKey)
    setAddingCategory(false)
  }

  function removePart(partKey: string) {
    setParts(current => current.filter(part => part.key !== partKey))
    setRenaming(current => current?.key === partKey ? null : current)
  }

  function removeSection(sectionKey: string) {
    setParts(current => current.map(part => ({
      ...part,
      sections: part.sections.filter(section => section.key !== sectionKey),
    })))
    if (selectedKey === sectionKey) setSelectedKey(null)
    setRenaming(current => current?.key === sectionKey ? null : current)
  }

  function removeQuestion(questionKey: string) {
    setParts(current => current.map(part => ({
      ...part,
      sections: part.sections.map(section => ({
        ...section,
        questions: section.questions.filter(question => question.key !== questionKey),
      })),
    })))
    if (openKey === questionKey) {
      setOpenKey(null)
      setRevertQuestion(null)
    }
  }

  async function save() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/questionnaire', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parts: toPayload(parts) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to save.')
      applyLoaded(data.parts ?? [])
      setOpenKey(null)
      setRevertQuestion(null)
      setRevertSectionKey(null)
      setRenaming(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  function discard() {
    if (!dirty) return
    if (!window.confirm('Discard unsaved changes?')) return
    fetch('/api/admin/questionnaire')
      .then(async res => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Failed to reload.')
        applyLoaded(data.parts ?? [])
        setOpenKey(null)
        setRevertQuestion(null)
        setRevertSectionKey(null)
        setRenaming(null)
        setError(null)
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to reload.'))
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-4 pb-8">
      <div className="sticky top-0 z-20 -mx-6 px-6 py-3 mb-6 bg-slate-100/95 backdrop-blur border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            {dirty ? 'Unsaved changes' : 'All changes saved'}
            {' · '}
            Removing a part, category, or question hides it from the form. Saved answers stay on file.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={discard}
            disabled={!dirty || saving}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 disabled:opacity-40"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || saving}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-semibold"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center justify-between gap-4">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 px-6 py-10 text-center text-slate-400 text-sm">Loading…</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
          <aside className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-navy-900">Parts</h2>
              <button
                type="button"
                disabled={saving}
                onClick={() => { setAddingPart(true); setPartName('') }}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                Add part
              </button>
            </div>
            {addingPart && (
              <form onSubmit={addPart} className="px-4 py-3 border-b border-slate-100 flex gap-2">
                <input
                  autoFocus
                  value={partName}
                  onChange={event => setPartName(event.target.value)}
                  placeholder="Part name"
                  className={inputClass}
                />
                <button type="submit" className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold">Add</button>
              </form>
            )}
            <div className="p-3 space-y-4 max-h-[70vh] overflow-y-auto">
              {parts.length === 0 && <p className="px-2 text-sm text-slate-400">No parts yet.</p>}
              {parts.map((part, partIndex) => (
                <div key={part.key}>
                  <div className="flex items-start gap-1 px-1">
                    {renaming?.kind === 'part' && renaming.key === part.key ? (
                      <form onSubmit={saveRename} className="flex-1 flex gap-1">
                        <input value={renaming.name} onChange={event => setRenaming({ ...renaming, name: event.target.value })} className={inputClass} />
                        <button type="submit" className="text-xs font-semibold text-blue-600 px-1">Save</button>
                      </form>
                    ) : (
                      <p className="flex-1 text-[11px] font-semibold text-blue-600 uppercase tracking-wide pt-1">{part.name}</p>
                    )}
                    <OrderButtons
                      disabled={saving}
                      upDisabled={partIndex === 0}
                      downDisabled={partIndex === parts.length - 1}
                      onUp={() => setParts(current => moveItem(current, partIndex, -1))}
                      onDown={() => setParts(current => moveItem(current, partIndex, 1))}
                    />
                    <button type="button" disabled={saving} onClick={() => setRenaming({ kind: 'part', key: part.key, name: part.name })} className="text-[11px] text-slate-400 hover:text-slate-700 px-1">Rename</button>
                    <button type="button" disabled={saving} onClick={() => removePart(part.key)} className="text-[11px] text-red-400 hover:text-red-600 px-1">Delete</button>
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {part.sections.map((section, sectionIndex) => {
                      const active = section.key === selected?.section.key
                      return (
                        <li key={section.key} className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => selectSection(section.key)}
                            className={`flex-1 text-left px-2 py-1.5 rounded-md text-sm leading-snug ${active ? 'bg-blue-50 text-navy-900 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                          >
                            {section.name || 'Untitled category'}
                            <span className="ml-1 text-[11px] text-slate-400">{section.questions.length}</span>
                          </button>
                          <OrderButtons
                            disabled={saving}
                            upDisabled={sectionIndex === 0}
                            downDisabled={sectionIndex === part.sections.length - 1}
                            onUp={() => updatePart(part.key, { sections: moveItem(part.sections, sectionIndex, -1) })}
                            onDown={() => updatePart(part.key, { sections: moveItem(part.sections, sectionIndex, 1) })}
                          />
                        </li>
                      )
                    })}
                  </ul>
                  {part.sections.length === 0 && (
                    <button type="button" onClick={() => addSection(part.key, 'New category')} className="mt-1 px-2 text-xs font-medium text-blue-600">Add category</button>
                  )}
                </div>
              ))}
            </div>
          </aside>

          <section className="bg-white rounded-xl border border-slate-200 min-w-0">
            {!selected ? (
              <div className="px-6 py-10 text-center text-slate-400 text-sm">Add a part and a category to start adding questions.</div>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      {renaming?.kind === 'section' && renaming.key === selected.section.key ? (
                        <form onSubmit={saveRename} className="flex gap-2">
                          <input value={renaming.name} onChange={event => setRenaming({ ...renaming, name: event.target.value })} className={inputClass} />
                          <button type="submit" className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold">Save</button>
                        </form>
                      ) : (
                        <>
                          <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide">{selected.part.name}</p>
                          <h2 className="font-semibold text-navy-900">{selected.section.name}</h2>
                        </>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button type="button" disabled={saving} onClick={() => setRenaming({ kind: 'section', key: selected.section.key, name: selected.section.name })} className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50">Rename</button>
                      <button type="button" disabled={saving} onClick={() => removeSection(selected.section.key)} className="px-2.5 py-1.5 rounded-md border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50">Delete category</button>
                      <button type="button" disabled={saving} onClick={addQuestion} className="px-2.5 py-1.5 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">Add question</button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 items-end">
                    <label className="text-xs text-slate-500">
                      Part
                      <select
                        value={selected.part.key}
                        disabled={saving}
                        onChange={event => moveSectionToPart(selected.section.key, event.target.value)}
                        className={`${inputClass} mt-1`}
                      >
                        {parts.map(part => <option key={part.key} value={part.key}>{part.name}</option>)}
                      </select>
                    </label>
                    <label className="text-xs text-slate-500 flex-1 min-w-[180px]">
                      Filter questions
                      <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search this category" className={`${inputClass} mt-1`} />
                    </label>
                    <button type="button" disabled={saving} onClick={() => { setAddingCategory(value => !value); setCategoryName('') }} className="text-xs font-medium text-blue-600 hover:text-blue-700 pb-2">
                      Add category in this part
                    </button>
                  </div>
                  {addingCategory && (
                    <form onSubmit={addCategory} className="flex gap-2">
                      <input autoFocus value={categoryName} onChange={event => setCategoryName(event.target.value)} placeholder="Category name" className={inputClass} />
                      <button type="submit" className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold">Add</button>
                    </form>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  {questions.length === 0 && (
                    <p className="px-2 py-6 text-center text-sm text-slate-400">No questions in this category.</p>
                  )}
                  {questions.map((question, index) => (
                    openKey === question.key ? (
                      <QuestionForm
                        key={question.key}
                        question={question}
                        sectionKey={selected.section.key}
                        sectionChoices={sectionChoices}
                        saving={saving}
                        onChange={patch => updateQuestion(question.key, patch)}
                        onMove={sectionKey => moveQuestionToSection(question.key, sectionKey)}
                        onDone={() => { setOpenKey(null); setRevertQuestion(null); setRevertSectionKey(null) }}
                        onCancel={() => closeQuestion(question.key)}
                        onAddOption={() => updateQuestion(question.key, {
                          options: [...question.options, { key: nextKey('option'), id: null, label: '', followUp: '' }],
                        })}
                        onMoveOption={(optionIndex, direction) => updateQuestion(question.key, {
                          options: moveItem(question.options, optionIndex, direction),
                        })}
                      />
                    ) : (
                      <article key={question.key} className="border border-slate-200 rounded-lg px-4 py-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              {question.id != null && <span className="text-[11px] font-medium text-slate-400">#{question.id}</span>}
                              <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{ANSWER_LABELS[question.answerType]}</span>
                              {question.required && <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">Required</span>}
                              {question.id != null && HIDDEN_QUESTION_IDS.has(question.id) && <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">Hidden from clients</span>}
                              {question.answerCount > 0 && <span className="text-[11px] text-slate-400">{question.answerCount} answer{question.answerCount === 1 ? '' : 's'}</span>}
                            </div>
                            <p className="text-sm text-navy-900 whitespace-pre-wrap">{question.label || 'New question'}</p>
                            {question.helpText && <p className="text-xs text-slate-500 mt-1 line-clamp-2 whitespace-pre-wrap">{question.helpText}</p>}
                            {CHOICE_ANSWER_TYPES.has(question.answerType) && question.options.length > 0 && (
                              <p className="text-xs text-slate-400 mt-1">{question.options.map(option => option.label).filter(Boolean).join(' · ')}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <OrderButtons
                              disabled={saving || query.trim().length > 0}
                              upDisabled={index === 0}
                              downDisabled={index === questions.length - 1}
                              onUp={() => {
                                const fullIndex = selected.section.questions.findIndex(item => item.key === question.key)
                                updateSection(selected.section.key, { questions: moveItem(selected.section.questions, fullIndex, -1) })
                              }}
                              onDown={() => {
                                const fullIndex = selected.section.questions.findIndex(item => item.key === question.key)
                                updateSection(selected.section.key, { questions: moveItem(selected.section.questions, fullIndex, 1) })
                              }}
                            />
                            <button type="button" disabled={saving} onClick={() => openQuestion(question)} className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50">Edit</button>
                            <button type="button" disabled={saving} onClick={() => removeQuestion(question.key)} className="px-2.5 py-1.5 rounded-md border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50">Delete</button>
                          </div>
                        </div>
                      </article>
                    )
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

function QuestionForm({
  question,
  sectionKey,
  sectionChoices,
  saving,
  onChange,
  onMove,
  onDone,
  onCancel,
  onAddOption,
  onMoveOption,
}: {
  question: QuestionDraft
  sectionKey: string
  sectionChoices: { key: string; label: string }[]
  saving: boolean
  onChange: (patch: Partial<QuestionDraft>) => void
  onMove: (sectionKey: string) => void
  onDone: () => void
  onCancel: () => void
  onAddOption: () => void
  onMoveOption: (index: number, direction: -1 | 1) => void
}) {
  const choice = CHOICE_ANSWER_TYPES.has(question.answerType)

  return (
    <form
      onSubmit={event => { event.preventDefault(); onDone() }}
      className="border border-blue-200 bg-blue-50/40 rounded-lg p-4 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-xs text-slate-500 sm:col-span-2">
          Question
          <textarea
            required
            rows={3}
            value={question.label}
            onChange={event => onChange({ label: event.target.value })}
            className={`${inputClass} mt-1`}
          />
        </label>
        <label className="text-xs text-slate-500">
          Answer type
          <select
            value={question.answerType}
            onChange={event => onChange({ answerType: event.target.value as AnswerType })}
            className={`${inputClass} mt-1`}
          >
            {ANSWER_TYPES.map(type => <option key={type} value={type}>{ANSWER_LABELS[type]}</option>)}
          </select>
        </label>
        <label className="text-xs text-slate-500">
          Category
          <select
            value={sectionKey}
            onChange={event => onMove(event.target.value)}
            className={`${inputClass} mt-1`}
          >
            {sectionChoices.map(choiceItem => (
              <option key={choiceItem.key} value={choiceItem.key}>{choiceItem.label}</option>
            ))}
          </select>
        </label>
        <label className="text-xs text-slate-500 sm:col-span-2">
          Help text
          <textarea
            rows={3}
            value={question.helpText}
            onChange={event => onChange({ helpText: event.target.value })}
            placeholder="Shown under the question. A line break turns it into a ? popover."
            className={`${inputClass} mt-1`}
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-navy-800 sm:col-span-2">
          <input
            type="checkbox"
            checked={question.required}
            onChange={event => onChange({ required: event.target.checked })}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded"
          />
          Required before the client can submit
        </label>
      </div>

      {choice && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Options</p>
            <button type="button" onClick={onAddOption} className="text-xs font-medium text-blue-600">Add option</button>
          </div>
          <p className="text-xs text-slate-500">
            Saved answers store the option label. Renaming an option does not rewrite answers already submitted.
          </p>
          {question.options.map((option, index) => (
            <div key={option.key} className="grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr_auto] gap-2 items-start bg-white border border-slate-200 rounded-lg p-2">
              <OrderButtons
                disabled={false}
                upDisabled={index === 0}
                downDisabled={index === question.options.length - 1}
                onUp={() => onMoveOption(index, -1)}
                onDown={() => onMoveOption(index, 1)}
              />
              <input
                value={option.label}
                onChange={event => onChange({
                  options: question.options.map(item => item.key === option.key ? { ...item, label: event.target.value } : item),
                })}
                placeholder="Option label"
                className={inputClass}
              />
              <input
                value={option.followUp}
                onChange={event => onChange({
                  options: question.options.map(item => item.key === option.key ? { ...item, followUp: event.target.value } : item),
                })}
                placeholder="Follow-up prompt (optional)"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => onChange({ options: question.options.filter(item => item.key !== option.key) })}
                className="text-xs text-red-500 px-2 py-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600">Cancel</button>
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold">
          Done
        </button>
      </div>
    </form>
  )
}

function OrderButtons({
  disabled,
  upDisabled,
  downDisabled,
  onUp,
  onDown,
}: {
  disabled: boolean
  upDisabled: boolean
  downDisabled: boolean
  onUp: () => void
  onDown: () => void
}) {
  return (
    <span className="inline-flex flex-col leading-none shrink-0">
      <button type="button" aria-label="Move up" disabled={disabled || upDisabled} onClick={onUp} className="text-slate-400 hover:text-slate-700 disabled:opacity-30 text-xs px-0.5">↑</button>
      <button type="button" aria-label="Move down" disabled={disabled || downDisabled} onClick={onDown} className="text-slate-400 hover:text-slate-700 disabled:opacity-30 text-xs px-0.5">↓</button>
    </span>
  )
}
