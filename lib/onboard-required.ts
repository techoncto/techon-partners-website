import type { Question } from '@/lib/types'

export const HIDDEN_QUESTION_IDS = new Set([51, 52])

export type MissingRequired = {
  questionId: number
  categoryIndex: number
  categoryName: string
  label: string
  kind: 'answer' | 'followup'
}

function isFilledText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function selectedValues(question: Question, value: unknown): string[] {
  if (question.answer_type === 'checkbox') {
    if (Array.isArray(value)) return value.map(String)
    if (value && typeof value === 'object' && Array.isArray((value as { selected?: unknown }).selected)) {
      return (value as { selected: unknown[] }).selected.map(String)
    }
    return []
  }

  if (typeof value === 'string') return value.trim() ? [value] : []
  if (value && typeof value === 'object' && typeof (value as { selected?: unknown }).selected === 'string') {
    const selected = (value as { selected: string }).selected
    return selected.trim() ? [selected] : []
  }
  return []
}

function followUpText(
  question: Question,
  optionLabel: string,
  value: unknown,
  followUpData: Record<string, string>,
): string {
  const byOption = followUpData[`${question.id}__followup__${optionLabel}`]
  const byOther = followUpData[`${question.id}__followup__Other`]
  if (isFilledText(byOption)) return byOption
  if (isFilledText(byOther)) return byOther

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const composite = value as { followUp?: string; followUps?: Record<string, string> }
    const fromMap = composite.followUps?.[optionLabel]
    if (isFilledText(fromMap)) return fromMap
    if (isFilledText(composite.followUp)) return composite.followUp
  }

  return ''
}

export function questionGap(
  question: Question,
  value: unknown,
  followUpData: Record<string, string> = {},
): 'answer' | 'followup' | null {
  const selected = selectedValues(question, value)
  const hasAnswer = selected.length > 0 || (
    question.answer_type !== 'checkbox' &&
    question.answer_type !== 'dropdown' &&
    question.answer_type !== 'radio' &&
    isFilledText(value)
  )

  if (question.required && !hasAnswer) return 'answer'

  if (!hasAnswer) return null

  const prompted = (question.options ?? []).filter(opt => opt.follow_up_prompt)
  for (const opt of prompted) {
    if (selected.includes(opt.label) && !isFilledText(followUpText(question, opt.label, value, followUpData))) {
      return 'followup'
    }
  }

  return null
}

export function findMissingRequired(
  categories: { name: string; questions: Question[] }[],
  formData: Record<string | number, unknown>,
  followUpData: Record<string, string> = {},
): MissingRequired[] {
  const missing: MissingRequired[] = []

  categories.forEach((category, categoryIndex) => {
    for (const question of category.questions) {
      if (HIDDEN_QUESTION_IDS.has(question.id)) continue
      const value = formData[question.id] ?? formData[String(question.id)]
      const gap = questionGap(question, value, followUpData)
      if (!gap) continue
      missing.push({
        questionId: question.id,
        categoryIndex,
        categoryName: category.name,
        label: question.label,
        kind: gap,
      })
    }
  })

  return missing
}

export function missingRequiredMessage(missing: MissingRequired[]): string {
  const sections = [...new Set(missing.map(item => item.categoryName))]
  const followUpOnly = missing.every(item => item.kind === 'followup')
  const prefix = followUpOnly
    ? 'Please complete the follow-up details in: '
    : 'Please complete the required questions in: '
  return `${prefix}${sections.join(', ')}.`
}
