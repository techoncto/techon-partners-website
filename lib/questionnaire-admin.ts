import { supabaseAdmin } from '@/lib/supabase'
import { ANSWER_TYPES, CHOICE_ANSWER_TYPES, type AnswerType } from '@/lib/types'

export type QuestionnaireOption = {
  id: number
  label: string
  display_order: number
  follow_up_prompt: string | null
}

export type QuestionnaireQuestion = {
  id: number
  label: string
  answer_type: AnswerType
  help_text: string | null
  required: boolean
  display_order: number
  answer_count: number
  options: QuestionnaireOption[]
}

export type QuestionnaireCategory = {
  id: number
  name: string
  display_order: number
  questions: QuestionnaireQuestion[]
}

export type QuestionnairePart = {
  id: number
  name: string
  display_order: number
  categories: QuestionnaireCategory[]
}

export type SaveOption = {
  id?: number | null
  label?: string | null
  follow_up_prompt?: string | null
}

export type SaveQuestion = {
  id?: number | null
  label?: string | null
  answer_type?: string | null
  help_text?: string | null
  required?: boolean
  options?: SaveOption[]
}

export type SaveCategory = {
  id?: number | null
  name?: string | null
  questions?: SaveQuestion[]
}

export type SavePart = {
  id?: number | null
  name?: string | null
  categories?: SaveCategory[]
}

function bad(message: string) {
  return Object.assign(new Error(message), { status: 400 })
}

export function httpStatus(error: unknown): number {
  if (error && typeof error === 'object' && 'status' in error && typeof error.status === 'number') {
    return error.status
  }
  return 500
}

function cleanText(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

function isAnswerType(value: unknown): value is AnswerType {
  return typeof value === 'string' && (ANSWER_TYPES as string[]).includes(value)
}

function byOrder<T extends { display_order: number; id: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.display_order - b.display_order || a.id - b.id)
}

export async function loadQuestionnaire(): Promise<QuestionnairePart[]> {
  const [{ data, error }, { data: answerRows, error: answerError }] = await Promise.all([
    supabaseAdmin
      .from('parts')
      .select(`
        id, name, display_order, deleted_at,
        categories (
          id, name, display_order, deleted_at,
          questions (
            id, label, answer_type, help_text, required, display_order, deleted_at,
            question_options ( id, label, display_order, follow_up_prompt, deleted_at )
          )
        )
      `)
      .is('deleted_at', null),
    supabaseAdmin.from('answers').select('question_id'),
  ])

  if (error) throw new Error(error.message)
  if (answerError) throw new Error(answerError.message)

  const answerCounts = new Map<number, number>()
  for (const row of answerRows ?? []) {
    const id = row.question_id as number
    answerCounts.set(id, (answerCounts.get(id) ?? 0) + 1)
  }

  type RawOption = QuestionnaireOption & { deleted_at: string | null }
  type RawQuestion = Omit<QuestionnaireQuestion, 'answer_count' | 'options'> & {
    deleted_at: string | null
    question_options: RawOption[] | null
  }
  type RawCategory = Omit<QuestionnaireCategory, 'questions'> & {
    deleted_at: string | null
    questions: RawQuestion[] | null
  }
  type RawPart = Omit<QuestionnairePart, 'categories'> & {
    deleted_at: string | null
    categories: RawCategory[] | null
  }

  return byOrder((data ?? []) as RawPart[]).map(part => ({
    id: part.id,
    name: part.name,
    display_order: part.display_order,
    categories: byOrder((part.categories ?? []).filter(category => category.deleted_at == null)).map(category => ({
      id: category.id,
      name: category.name,
      display_order: category.display_order,
      questions: byOrder((category.questions ?? []).filter(question => question.deleted_at == null)).map(question => ({
        id: question.id,
        label: question.label,
        answer_type: question.answer_type,
        help_text: question.help_text,
        required: question.required,
        display_order: question.display_order,
        answer_count: answerCounts.get(question.id) ?? 0,
        options: byOrder((question.question_options ?? []).filter(option => option.deleted_at == null)).map(option => ({
          id: option.id,
          label: option.label,
          display_order: option.display_order,
          follow_up_prompt: option.follow_up_prompt,
        })),
      })),
    })),
  }))
}

async function activeIds(table: 'parts' | 'categories' | 'questions' | 'question_options'): Promise<Set<number>> {
  const { data, error } = await supabaseAdmin.from(table).select('id').is('deleted_at', null)
  if (error) throw new Error(error.message)
  return new Set((data ?? []).map(row => row.id as number))
}

function takeId(value: unknown, label: string, active: Set<number>, seen: Set<number>): number | null {
  if (value == null) return null
  const id = Number(value)
  if (!Number.isInteger(id) || id <= 0) throw bad(`Invalid ${label}.`)
  if (!active.has(id)) throw bad(`That ${label} is no longer on the form. Reload and try again.`)
  if (seen.has(id)) throw bad(`The same ${label} was included twice.`)
  seen.add(id)
  return id
}

async function softDelete(table: 'parts' | 'categories' | 'questions' | 'question_options', ids: number[], now: string) {
  if (ids.length === 0) return
  const { error } = await supabaseAdmin
    .from(table)
    .update({ deleted_at: now })
    .in('id', ids)
    .is('deleted_at', null)
  if (error) throw new Error(error.message)
}

export async function saveQuestionnaire(partsInput: SavePart[]): Promise<QuestionnairePart[]> {
  if (!Array.isArray(partsInput) || partsInput.length === 0) {
    throw bad('Keep at least one part.')
  }

  const [activeParts, activeCategories, activeQuestions, activeOptions] = await Promise.all([
    activeIds('parts'),
    activeIds('categories'),
    activeIds('questions'),
    activeIds('question_options'),
  ])

  const seenParts = new Set<number>()
  const seenCategories = new Set<number>()
  const seenQuestions = new Set<number>()
  const seenOptions = new Set<number>()

  for (let partIndex = 0; partIndex < partsInput.length; partIndex++) {
    const part = partsInput[partIndex] ?? {}
    const partName = cleanText(part.name)
    if (!partName) throw bad('Every part needs a name.')
    let partId = takeId(part.id, 'part', activeParts, seenParts)

    if (partId) {
      const { error } = await supabaseAdmin
        .from('parts')
        .update({ name: partName, display_order: partIndex + 1 })
        .eq('id', partId)
        .is('deleted_at', null)
      if (error) throw new Error(error.message)
    } else {
      const { data, error } = await supabaseAdmin
        .from('parts')
        .insert({ name: partName, display_order: partIndex + 1 })
        .select('id')
        .single()
      if (error || !data) throw new Error(error?.message ?? 'Failed to add part.')
      partId = data.id
    }
    const categories = Array.isArray(part.categories) ? part.categories : []
    for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
      const category = categories[categoryIndex] ?? {}
      const categoryName = cleanText(category.name)
      if (!categoryName) throw bad(`A section in ${partName} needs a name.`)
      let categoryId = takeId(category.id, 'section', activeCategories, seenCategories)

      if (categoryId) {
        const { error } = await supabaseAdmin
          .from('categories')
          .update({ name: categoryName, part_id: partId, display_order: categoryIndex + 1 })
          .eq('id', categoryId)
          .is('deleted_at', null)
        if (error) throw new Error(error.message)
      } else {
        const { data, error } = await supabaseAdmin
          .from('categories')
          .insert({ name: categoryName, part_id: partId, display_order: categoryIndex + 1 })
          .select('id')
          .single()
        if (error || !data) throw new Error(error?.message ?? 'Failed to add section.')
        categoryId = data.id
      }
      const questions = Array.isArray(category.questions) ? category.questions : []
      for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
        const question = questions[questionIndex] ?? {}
        const label = cleanText(question.label)
        if (!label) throw bad(`A question in ${categoryName} is empty.`)
        if (!isAnswerType(question.answer_type)) throw bad(`Invalid answer type for “${label}”.`)
        const required = question.required === true
        const helpText = cleanText(question.help_text)
        let questionId = takeId(question.id, 'question', activeQuestions, seenQuestions)
        const fields = {
          category_id: categoryId,
          label,
          answer_type: question.answer_type,
          help_text: helpText,
          required,
          display_order: questionIndex + 1,
        }

        if (questionId) {
          const { error } = await supabaseAdmin.from('questions').update(fields).eq('id', questionId).is('deleted_at', null)
          if (error) throw new Error(error.message)
        } else {
          const { data, error } = await supabaseAdmin.from('questions').insert(fields).select('id').single()
          if (error || !data) throw new Error(error?.message ?? 'Failed to add question.')
          questionId = data.id
        }
        const options = (Array.isArray(question.options) ? question.options : [])
          .map(option => ({
            id: option.id,
            label: cleanText(option.label),
            follow_up_prompt: cleanText(option.follow_up_prompt),
          }))
          .filter(option => option.label)

        if (CHOICE_ANSWER_TYPES.has(question.answer_type) && options.length === 0) {
          throw bad(`Add at least one option for “${label}”.`)
        }

        for (let optionIndex = 0; optionIndex < options.length; optionIndex++) {
          const option = options[optionIndex]
          let optionId = takeId(option.id, 'option', activeOptions, seenOptions)
          const optionFields = {
            question_id: questionId,
            label: option.label as string,
            follow_up_prompt: option.follow_up_prompt,
            display_order: optionIndex + 1,
          }
          if (optionId) {
            const { error } = await supabaseAdmin
              .from('question_options')
              .update(optionFields)
              .eq('id', optionId)
              .is('deleted_at', null)
            if (error) throw new Error(error.message)
          } else {
            const { data, error } = await supabaseAdmin.from('question_options').insert(optionFields).select('id').single()
            if (error || !data) throw new Error(error?.message ?? 'Failed to add option.')
            optionId = data.id
          }
        }
      }
    }
  }

  const now = new Date().toISOString()
  const removedQuestions = [...activeQuestions].filter(id => !seenQuestions.has(id))
  const removedOptions = [...activeOptions].filter(id => !seenOptions.has(id))

  if (removedQuestions.length > 0) {
    const { error } = await supabaseAdmin
      .from('question_options')
      .update({ deleted_at: now })
      .in('question_id', removedQuestions)
      .is('deleted_at', null)
    if (error) throw new Error(error.message)
  }

  await softDelete('question_options', removedOptions, now)
  await softDelete('questions', removedQuestions, now)
  await softDelete('categories', [...activeCategories].filter(id => !seenCategories.has(id)), now)
  await softDelete('parts', [...activeParts].filter(id => !seenParts.has(id)), now)

  return loadQuestionnaire()
}
