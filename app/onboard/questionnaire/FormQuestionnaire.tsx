'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import type { CategoryWithQuestions, Question, Answer, Part } from '@/lib/types'
import { LAST_SECTION_KEY, REVIEW_SLUG, categorySlugs, sectionHref } from '@/lib/onboard-section'
import { findMissingRequired, missingRequiredMessage } from '@/lib/onboard-required'

interface FormData {
  [questionId: string]: string | string[]
}

// Follow-up answers keyed as `{questionId}__followup__{optionLabel}`
interface FollowUpData {
  [key: string]: string
}

function FieldRenderer({
  question,
  value,
  onChange,
  followUpData = {},
  onFollowUpChange,
}: {
  question: Question
  value: string | string[] | undefined
  onChange: (val: string | string[]) => void
  followUpData?: Record<string, string>
  onFollowUpChange?: (key: string, val: string) => void
}) {
  const inputClass =
    'w-full px-4 py-2.5 border border-slate-200 rounded-lg text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'

  switch (question.answer_type) {
    case 'textarea':
      return (
        <textarea
          value={(value as string) ?? ''}
          onChange={e => onChange(e.target.value)}
          rows={5}
          className={`${inputClass} resize-y`}
        />
      )

    case 'text':
    case 'number':
      return (
        <input
          type={question.answer_type}
          value={(value as string) ?? ''}
          onChange={e => onChange(e.target.value)}
          className={inputClass}
        />
      )

    case 'dropdown': {
      const selectedOpt = question.options?.find(o => o.label === (value as string))
      const followUpKey = `${question.id}__followup__Other`
      return (
        <div className="space-y-2">
          <select
            value={(value as string) ?? ''}
            onChange={e => {
              onChange(e.target.value)
              if (e.target.value !== 'Other') {
                onFollowUpChange?.(followUpKey, '')
              }
            }}
            className={inputClass}
          >
            <option value="">Select an option…</option>
            {question.options?.map(opt => (
              <option key={opt.id} value={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>
          {selectedOpt?.follow_up_prompt && (
            <div className="mt-1">
              <label className="block text-xs font-medium text-slate-500 mb-1.5 italic">
                {selectedOpt.follow_up_prompt}
              </label>
              <input
                type="text"
                value={followUpData[followUpKey] ?? ''}
                onChange={e => onFollowUpChange?.(followUpKey, e.target.value)}
                className={inputClass}
              />
            </div>
          )}
        </div>
      )
    }

    case 'radio':
      return (
        <div className="space-y-2.5 mt-1">
          {question.options?.map(opt => (
            <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name={String(question.id)}
                value={opt.label}
                checked={(value as string) === opt.label}
                onChange={() => onChange(opt.label)}
                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              <span className="text-sm text-navy-800 group-hover:text-navy-900">{opt.label}</span>
            </label>
          ))}
        </div>
      )

    case 'checkbox': {
      const checked = (value as string[]) ?? []
      return (
        <div className="space-y-3 mt-1">
          {question.options?.map(opt => {
            const isChecked = checked.includes(opt.label)
            const followUpKey = `${question.id}__followup__${opt.label}`
            return (
              <div key={opt.id}>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    value={opt.label}
                    checked={isChecked}
                    onChange={e => {
                      if (e.target.checked) {
                        onChange([...checked, opt.label])
                      } else {
                        onChange(checked.filter(v => v !== opt.label))
                        if (opt.follow_up_prompt) {
                          onFollowUpChange?.(followUpKey, '')
                        }
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 shrink-0"
                  />
                  <span className="text-sm text-navy-800 group-hover:text-navy-900">{opt.label}</span>
                </label>
                {isChecked && opt.follow_up_prompt && (
                  <div className="mt-2 ml-7">
                    <label className="block text-xs font-medium text-slate-500 mb-1.5 italic">
                      {opt.follow_up_prompt}
                    </label>
                    <textarea
                      value={followUpData[followUpKey] ?? ''}
                      onChange={e => onFollowUpChange?.(followUpKey, e.target.value)}
                      rows={3}
                      className={`${inputClass} resize-y`}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )
    }

    default:
      return null
  }
}

type NavPart = {
  part: Part
  categories: { index: number; name: string }[]
}

function SectionNav({
  parts,
  currentSection,
  reviewIndex,
  isReview,
  saving,
  onJump,
}: {
  parts: NavPart[]
  currentSection: number
  reviewIndex: number
  isReview: boolean
  saving: boolean
  onJump: (index: number) => void
}) {
  return (
    <aside className="hidden lg:block w-64 shrink-0 min-h-0 self-stretch">
      <nav className="h-full bg-white rounded-2xl shadow-sm border border-slate-200 p-4 overflow-y-auto">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide px-2 mb-3">
          Questionnaire
        </p>
        <div className="space-y-4">
          {parts.map(group => (
            <div key={group.part.id}>
              <p className="px-2 mb-1.5 text-[11px] font-semibold text-blue-600 uppercase tracking-wide">
                {group.part.name}
              </p>
              <ul className="space-y-0.5">
                {group.categories.map(cat => {
                  const active = !isReview && currentSection === cat.index
                  return (
                    <li key={cat.index}>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => onJump(cat.index)}
                        className={`w-full text-left px-2 py-1.5 rounded-md text-sm leading-snug transition-colors disabled:opacity-50 ${
                          active
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
                        }`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            disabled={saving}
            onClick={() => onJump(reviewIndex)}
            className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors disabled:opacity-50 ${
              isReview
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
            }`}
          >
            Review &amp; Submit
          </button>
        </div>
      </nav>
    </aside>
  )
}

export default function FormQuestionnaire() {
  const router = useRouter()
  const pathname = usePathname()
  const sectionSlug = pathname.startsWith('/onboard/questionnaire/')
    ? decodeURIComponent(pathname.slice('/onboard/questionnaire/'.length).split('/')[0] ?? '')
    : ''

  const [categories, setCategories] = useState<CategoryWithQuestions[]>([])
  const [formData, setFormData] = useState<FormData>({})
  const [followUpData, setFollowUpData] = useState<FollowUpData>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [incompleteIds, setIncompleteIds] = useState<number[]>([])
  const [budgetStarted, setBudgetStarted] = useState(false)
  const [teamStarted, setTeamStarted] = useState(false)
  const questionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      try {
        const [categoriesRes, answersRes] = await Promise.all([
          fetch('/api/onboard/questions'),
          fetch('/api/onboard/answers'),
        ])
        const { categories: cats } = await categoriesRes.json()
        const { answers, completed } = await answersRes.json()

        setCategories(cats ?? [])
        if (completed) {
          setSubmitted(true)
        }

        // Pre-fill saved answers
        const saved: FormData = {}
        const savedFollowUps: FollowUpData = {}
        for (const answer of (answers ?? []) as Answer[]) {
          const val = answer.answer_value
          if (val && typeof val === 'object' && !Array.isArray(val)) {
            if ('selected' in val && Array.isArray((val as { selected: unknown }).selected)) {
              // Checkbox composite: { selected: string[], followUps: Record<string,string> }
              const composite = val as { selected: string[]; followUps: Record<string, string> }
              saved[answer.question_id] = composite.selected
              for (const [optLabel, text] of Object.entries(composite.followUps ?? {})) {
                savedFollowUps[`${answer.question_id}__followup__${optLabel}`] = text
              }
            } else if ('selected' in val && typeof (val as { selected: unknown }).selected === 'string') {
              // Dropdown composite: { selected: string, followUp: string }
              const composite = val as { selected: string; followUp: string }
              saved[answer.question_id] = composite.selected
              if (composite.followUp) {
                savedFollowUps[`${answer.question_id}__followup__Other`] = composite.followUp
              }
            }
          } else {
            saved[answer.question_id] = val as string | string[]
          }
        }
        setFormData(saved)
        setFollowUpData(savedFollowUps)
      } catch {
        setError('Failed to load the questionnaire. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!submitted) return

    function hasText(value: unknown): boolean {
      return String(value ?? '').trim().length > 0
    }

    async function loadProgress() {
      try {
        const [budgetRes, teamRes] = await Promise.all([
          fetch('/api/onboard/budget-audit'),
          fetch('/api/onboard/team'),
        ])
        const budgetData = await budgetRes.json()
        const teamData = await teamRes.json()

        const items = (budgetData.items ?? []) as Record<string, unknown>[]
        setBudgetStarted(items.some(item =>
          hasText(item.expense) ||
          hasText(item.purpose) ||
          hasText(item.action) ||
          hasText(item.billing_frequency) ||
          hasText(item.billing_date) ||
          hasText(item.notes) ||
          item.cost != null
        ))

        const members = (teamData.members ?? []) as Record<string, unknown>[]
        const memberStarted = members.some(m =>
          hasText(m.team) ||
          hasText(m.department) ||
          hasText(m.role) ||
          hasText(m.resource) ||
          hasText(m.responsibilities) ||
          hasText(m.software_used) ||
          hasText(m.reports_to) ||
          m.hours_per_week != null
        )
        const ratings = (teamData.ratings ?? []) as { proficiency?: number; interest?: number }[]
        const skillsStarted = ratings.some(r => (r.proficiency ?? 0) > 0 || (r.interest ?? 0) > 0)
        setTeamStarted(memberStarted || Boolean(teamData.orgChart) || skillsStarted)
      } catch {
        // Keep Start labels if progress can't be loaded
      }
    }

    void loadProgress()
  }, [submitted])

  const slugs = useMemo(() => categorySlugs(categories), [categories])

  const currentSection = useMemo(() => {
    if (!categories.length) return 0
    if (sectionSlug === REVIEW_SLUG) return categories.length
    return slugs.indexOf(sectionSlug)
  }, [categories.length, sectionSlug, slugs])

  const sectionReady = currentSection >= 0
  const isReview = sectionReady && sectionSlug === REVIEW_SLUG
  const currentCategory = currentSection >= 0 ? categories[currentSection] : undefined
  const totalSections = categories.length + 1

  useEffect(() => {
    if (loading || submitted || !categories.length) return
    const valid = sectionSlug === REVIEW_SLUG || slugs.includes(sectionSlug)
    if (valid) {
      sessionStorage.setItem(LAST_SECTION_KEY, sectionSlug)
      return
    }
    const stored = sessionStorage.getItem(LAST_SECTION_KEY)
    const fallback =
      stored && (stored === REVIEW_SLUG || slugs.includes(stored)) ? stored : slugs[0]
    router.replace(sectionHref(fallback), { scroll: false })
  }, [loading, submitted, categories.length, sectionSlug, slugs, router])

  useEffect(() => {
    const firstOnPage = currentCategory?.questions.find(q => incompleteIds.includes(q.id))
    if (firstOnPage) {
      const frame = requestAnimationFrame(() => {
        document.getElementById(`question-${firstOnPage.id}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      })
      return () => cancelAnimationFrame(frame)
    }
    questionsRef.current?.scrollTo(0, 0)
  }, [sectionSlug, currentCategory, incompleteIds])

  useEffect(() => {
    if (!slugs.length) return
    for (const slug of slugs) {
      router.prefetch(sectionHref(slug))
    }
    router.prefetch(sectionHref(REVIEW_SLUG))
  }, [router, slugs])

  const navParts = useMemo<NavPart[]>(() => {
    const grouped = new Map<number, NavPart>()
    categories.forEach((cat, index) => {
      const rawPart = cat.parts as Part | Part[] | undefined
      const part = Array.isArray(rawPart)
        ? rawPart[0]
        : rawPart ?? { id: cat.part_id, name: 'Questionnaire', display_order: 0 }
      let group = grouped.get(part.id)
      if (!group) {
        group = { part, categories: [] }
        grouped.set(part.id, group)
      }
      group.categories.push({ index, name: cat.name })
    })
    return [...grouped.values()]
  }, [categories])

  function handleChange(questionId: string, value: string | string[]) {
    setFormData(prev => ({ ...prev, [questionId]: value }))
    setIncompleteIds(prev => prev.filter(id => String(id) !== questionId))
  }

  function handleFollowUpChange(key: string, val: string) {
    setFollowUpData(prev => ({ ...prev, [key]: val }))
    const questionId = Number(key.split('__followup__')[0])
    if (Number.isFinite(questionId)) {
      setIncompleteIds(prev => prev.filter(id => id !== questionId))
    }
  }

  const buildAnswersForCategory = useCallback((cat: CategoryWithQuestions) => {
    return cat.questions.map(q => {
      const raw = formData[q.id] ?? null
      if (q.answer_type === 'checkbox' && q.options?.some(o => o.follow_up_prompt)) {
        const selected = (raw as string[]) ?? []
        const followUps: Record<string, string> = {}
        for (const opt of q.options ?? []) {
          if (opt.follow_up_prompt) {
            const text = followUpData[`${q.id}__followup__${opt.label}`] ?? ''
            if (text) followUps[opt.label] = text
          }
        }
        return {
          questionId: q.id,
          value: { selected, followUps },
        }
      }
      if (q.answer_type === 'dropdown' && q.options?.some(o => o.follow_up_prompt)) {
        const selected = (raw as string) ?? ''
        const followUpText = followUpData[`${q.id}__followup__Other`] ?? ''
        if (followUpText) {
          return { questionId: q.id, value: { selected, followUp: followUpText } }
        }
      }
      return { questionId: q.id, value: raw }
    })
  }, [formData, followUpData])

  const saveSection = useCallback(async (sectionIndex: number) => {
    const cat = categories[sectionIndex]
    if (!cat) return

    const answers = buildAnswersForCategory(cat)

    setSaving(true)
    try {
      await fetch('/api/onboard/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
    } finally {
      setSaving(false)
    }
  }, [categories, buildAnswersForCategory])

  async function goToSection(index: number) {
    const targetSlug = index >= categories.length ? REVIEW_SLUG : slugs[index]
    if (!targetSlug || targetSlug === sectionSlug) return
    setError('')
    if (!isReview && currentSection >= 0) {
      await saveSection(currentSection)
    }
    router.push(sectionHref(targetSlug), { scroll: false })
  }

  async function handleNext() {
    setError('')
    await saveSection(currentSection)
    const nextIndex = currentSection + 1
    const targetSlug = nextIndex >= categories.length ? REVIEW_SLUG : slugs[nextIndex]
    router.push(sectionHref(targetSlug), { scroll: false })
  }

  async function handleBack() {
    if (currentSection <= 0) return
    setError('')
    if (!isReview) {
      await saveSection(currentSection)
    }
    router.push(sectionHref(slugs[currentSection - 1]), { scroll: false })
  }

  async function handleJump(index: number) {
    await goToSection(index)
  }

  async function handleSubmit() {
    setError('')
    const missing = findMissingRequired(categories, formData, followUpData)
    if (missing.length > 0) {
      setIncompleteIds(missing.map(item => item.questionId))
      setError(missingRequiredMessage(missing))
      const first = missing[0]
      const targetSlug = slugs[first.categoryIndex]
      if (targetSlug && targetSlug !== sectionSlug) {
        router.push(sectionHref(targetSlug), { scroll: false })
      }
      return
    }

    setIncompleteIds([])
    setSaving(true)
    try {
      const answers = categories.flatMap(cat => buildAnswersForCategory(cat))
      const res = await fetch('/api/onboard/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      if (!res.ok) {
        const data = await res.json()
        if (res.status === 409 || data.alreadySubmitted) {
          setSubmitted(true)
          window.scrollTo({ top: 0, behavior: 'smooth' })
          return
        }
        if (Array.isArray(data.missing) && data.missing.length > 0) {
          const serverMissing = data.missing as { questionId: number; categoryIndex?: number }[]
          setIncompleteIds(serverMissing.map(item => item.questionId))
          const firstIndex = serverMissing[0]?.categoryIndex
          if (typeof firstIndex === 'number' && slugs[firstIndex] && slugs[firstIndex] !== sectionSlug) {
            router.push(sectionHref(slugs[firstIndex]), { scroll: false })
          }
        }
        setError(data.error ?? 'Submission failed. Please try again.')
        return
      }
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSaving(false)
    }
  }

  if (loading || (!submitted && categories.length > 0 && !sectionReady)) {
    return (
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="text-slate-400 text-sm">Loading your questionnaire…</div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="w-full max-w-lg space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-navy-900 mb-2">Questionnaire Submitted!</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Thank you for completing the onboarding questionnaire. Your answers have been saved and our team has been notified. The questionnaire can no longer be edited.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-navy-900 text-sm mb-1">
              {budgetStarted ? 'Continue: Budget Audit' : 'Next step: Budget Audit'}
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-3">
              List all your recurring software, SaaS, and vendor expenses so we can identify opportunities to reduce your tech spend.
            </p>
            <a
              href="/onboard/budget-audit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {budgetStarted ? 'Continue Budget Audit →' : 'Start Budget Audit →'}
            </a>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5m6-16a4 4 0 110 8 4 4 0 010-8z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-navy-900 text-sm mb-1">
              {teamStarted ? 'Continue: Team Resources' : 'Next step: Team Resources'}
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-3">
              Add each team member, upload an org chart if you have one, and complete the skills matrix.
            </p>
            <a
              href="/onboard/team"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {teamStarted ? 'Continue Team Resources →' : 'Start Team Resources →'}
            </a>
          </div>
        </div>
      </div>
    )
  }

  const progressPercent = Math.round(((currentSection) / totalSections) * 100)

  return (
    <div className="w-full max-w-7xl flex-1 min-h-0 flex items-stretch gap-5">
      <SectionNav
        parts={navParts}
        currentSection={currentSection}
        reviewIndex={categories.length}
        isReview={isReview}
        saving={saving}
        onJump={handleJump}
      />

      <div className="flex-1 min-w-0 h-full flex flex-col min-h-0">
        <div className="lg:hidden mb-3 shrink-0">
          <label className="block text-xs font-medium text-slate-500 mb-1.5">Jump to section</label>
          <select
            value={isReview ? categories.length : currentSection}
            disabled={saving}
            onChange={e => handleJump(Number(e.target.value))}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-navy-900 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {navParts.map(group => (
              <optgroup key={group.part.id} label={group.part.name}>
                {group.categories.map(cat => (
                  <option key={cat.index} value={cat.index}>
                    {cat.name}
                  </option>
                ))}
              </optgroup>
            ))}
            <option value={categories.length}>Review &amp; Submit</option>
          </select>
        </div>

        <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="px-6 lg:px-8 pt-5 pb-4 shrink-0 border-b border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-navy-800">
                {isReview ? 'Review & Submit' : `${currentCategory?.parts?.name} — ${currentCategory?.name}`}
              </span>
              <span className="text-xs text-slate-400">
                {isReview ? 'Final step' : `Section ${currentSection + 1} of ${categories.length}`}
              </span>
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {error && (
            <div className="mx-6 lg:mx-8 mt-4 shrink-0 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div ref={questionsRef} className="flex-1 min-h-0 overflow-y-auto px-6 lg:px-8 py-6">
            {!isReview && currentCategory && (
              <div>
                <div className="mb-8">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                    {currentCategory.parts?.name}
                  </p>
                  <h2 className="text-xl font-bold text-navy-900">{currentCategory.name}</h2>
                </div>

                <div className="space-y-8">
                  {currentCategory.questions.map((question, idx) => (
                    <div
                      key={question.id}
                      id={`question-${question.id}`}
                      className={incompleteIds.includes(question.id) ? 'rounded-xl ring-2 ring-red-300 ring-offset-2 p-3 -mx-3' : undefined}
                    >
                      <label className="block text-sm font-medium text-navy-800 mb-2 leading-snug">
                        <span className="text-slate-400 mr-2">{idx + 1}.</span>
                        {question.label}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {incompleteIds.includes(question.id) && (
                        <p className="text-xs text-red-600 mb-2">This question needs a response before you can submit.</p>
                      )}
                      {question.help_text && (
                        <p className="text-xs text-slate-400 mb-2 italic">{question.help_text}</p>
                      )}
                      <FieldRenderer
                        question={question}
                        value={formData[question.id]}
                        onChange={val => handleChange(String(question.id), val)}
                        followUpData={followUpData}
                        onFollowUpChange={handleFollowUpChange}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isReview && (
              <div>
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-navy-900 mb-1">Review Your Answers</h2>
                  <p className="text-slate-500 text-sm">
                    Please review your responses below. You can go back to any section to make changes before submitting.
                  </p>
                </div>

                <div className="space-y-8">
                  {categories.map((cat, catIdx) => (
                    <div key={cat.id}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{cat.parts?.name}</p>
                          <h3 className="font-semibold text-navy-900">{cat.name}</h3>
                        </div>
                        <button
                          onClick={() => handleJump(catIdx)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="space-y-4">
                        {cat.questions.map(q => {
                          const val = formData[q.id]
                          let displayLines: string[] = []
                          if (Array.isArray(val) && val.length > 0) {
                            for (const optLabel of val) {
                              const followUpKey = `${q.id}__followup__${optLabel}`
                              const followUpText = followUpData[followUpKey]
                              displayLines.push(followUpText ? `${optLabel}: ${followUpText}` : optLabel)
                            }
                          } else if (val) {
                            const followUpText = followUpData[`${q.id}__followup__Other`]
                            displayLines = [followUpText ? `${val}: ${followUpText}` : (val as string)]
                          }
                          const display = displayLines.length > 0 ? displayLines.join('\n') : '—'
                          return (
                            <div key={q.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                              <p className="text-xs text-slate-500 mb-1">{q.label}</p>
                              <p className="text-sm text-navy-800 whitespace-pre-wrap">{display}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-6 lg:px-8 py-4 border-t border-slate-100 shrink-0">
            <button
              onClick={handleBack}
              disabled={currentSection === 0}
              className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-navy-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Back
            </button>

            {isReview ? (
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {saving ? 'Submitting…' : 'Submit Questionnaire'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={saving}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {saving ? 'Saving…' : 'Save & Continue →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

