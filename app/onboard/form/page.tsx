'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CategoryWithQuestions, Question, Answer } from '@/lib/types'

interface FormData {
  [questionId: string]: string | string[]
}

function FieldRenderer({
  question,
  value,
  onChange,
}: {
  question: Question
  value: string | string[] | undefined
  onChange: (val: string | string[]) => void
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

    case 'dropdown':
      return (
        <select
          value={(value as string) ?? ''}
          onChange={e => onChange(e.target.value)}
          className={inputClass}
        >
          <option value="">Select an option…</option>
          {question.options?.map(opt => (
            <option key={opt.id} value={opt.label}>
              {opt.label}
            </option>
          ))}
        </select>
      )

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
        <div className="space-y-2.5 mt-1">
          {question.options?.map(opt => (
            <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                value={opt.label}
                checked={checked.includes(opt.label)}
                onChange={e => {
                  if (e.target.checked) {
                    onChange([...checked, opt.label])
                  } else {
                    onChange(checked.filter(v => v !== opt.label))
                  }
                }}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-navy-800 group-hover:text-navy-900">{opt.label}</span>
            </label>
          ))}
        </div>
      )
    }

    default:
      return null
  }
}

export default function FormPage() {
  const [categories, setCategories] = useState<CategoryWithQuestions[]>([])
  const [formData, setFormData] = useState<FormData>({})
  const [currentSection, setCurrentSection] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [categoriesRes, answersRes] = await Promise.all([
          fetch('/api/onboard/questions'),
          fetch('/api/onboard/answers'),
        ])
        const { categories: cats } = await categoriesRes.json()
        const { answers } = await answersRes.json()

        setCategories(cats ?? [])

        // Pre-fill saved answers
        const saved: FormData = {}
        for (const answer of (answers ?? []) as Answer[]) {
          saved[answer.question_id] = answer.answer_value as string | string[]
        }
        setFormData(saved)
      } catch {
        setError('Failed to load the questionnaire. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalSections = categories.length + 1 // +1 for review step
  const isReview = currentSection === categories.length

  const currentCategory = categories[currentSection]

  function handleChange(questionId: string, value: string | string[]) {
    setFormData(prev => ({ ...prev, [questionId]: value }))
  }

  const saveSection = useCallback(async (sectionIndex: number) => {
    const cat = categories[sectionIndex]
    if (!cat) return

    const answers = cat.questions.map(q => ({
      questionId: q.id,
      value: formData[q.id] ?? null,
    }))

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
  }, [categories, formData])

  async function handleNext() {
    setError('')
    await saveSection(currentSection)
    setCurrentSection(prev => prev + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleBack() {
    setCurrentSection(prev => prev - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit() {
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/onboard/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: [] }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Submission failed. Please try again.')
        return
      }
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
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
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-navy-900 mb-2">Questionnaire Submitted!</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Thank you for completing the onboarding questionnaire. Our team will review your responses and be in touch soon.
          </p>
        </div>
      </div>
    )
  }

  const progressPercent = Math.round(((currentSection) / totalSections) * 100)

  return (
    <div className="w-full max-w-2xl">
      {/* Progress bar */}
      <div className="mb-6">
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Section questions */}
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
                <div key={question.id}>
                  <label className="block text-sm font-medium text-navy-800 mb-2 leading-snug">
                    <span className="text-slate-400 mr-2">{idx + 1}.</span>
                    {question.label}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {question.help_text && (
                    <p className="text-xs text-slate-400 mb-2 italic">{question.help_text}</p>
                  )}
                  <FieldRenderer
                    question={question}
                    value={formData[question.id]}
                    onChange={val => handleChange(String(question.id), val)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review step */}
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
                      onClick={() => setCurrentSection(catIdx)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="space-y-4 pl-0">
                    {cat.questions.map(q => {
                      const val = formData[q.id]
                      const display = Array.isArray(val)
                        ? val.length > 0 ? val.join(', ') : '—'
                        : val || '—'
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

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100">
          <button
            onClick={handleBack}
            disabled={currentSection === 0}
            className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-navy-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>

          <div className="flex items-center gap-3">
            {saving && (
              <span className="text-xs text-slate-400">Saving…</span>
            )}
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
