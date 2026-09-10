import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'
import { getClientSession } from '@/lib/auth'
import { HIDDEN_QUESTION_IDS, findMissingRequired, missingRequiredMessage } from '@/lib/onboard-required'
import {
  buildClientSubmittedEmail,
  buildInternalSubmittedEmail,
  formatAnswerValue,
  type SubmittedAnswerSection,
} from '@/lib/onboard-emails'

import type { Question } from '@/lib/types'
import { getSiteUrl } from '@/lib/site-url'
import { getEmailLogoAttachment } from '@/lib/email-logo'

const resend = new Resend(process.env.RESEND_API_KEY)

type QuestionRow = {
  id: number
  label: string
  display_order: number
  category_id: number
  categories: {
    id: number
    name: string
    display_order: number
    parts: { id: number; name: string; display_order: number } | { id: number; name: string; display_order: number }[] | null
  } | {
    id: number
    name: string
    display_order: number
    parts: { id: number; name: string; display_order: number } | { id: number; name: string; display_order: number }[] | null
  }[] | null
}

async function loadAnswerSections(clientId: string): Promise<SubmittedAnswerSection[]> {
  const [{ data: answers }, { data: questions }] = await Promise.all([
    supabaseAdmin
      .from('answers')
      .select('question_id, answer_value')
      .eq('client_id', clientId),
    supabaseAdmin
      .from('questions')
      .select(`
        id, label, display_order, category_id,
        categories ( id, name, display_order, parts ( id, name, display_order ) )
      `),
  ])

  const answerByQuestion = new Map(
    (answers ?? []).map(row => [row.question_id as number, row.answer_value])
  )

  const grouped = new Map<number, {
    partName: string
    categoryName: string
    partOrder: number
    catOrder: number
    items: { label: string; value: string; order: number }[]
  }>()

  for (const question of (questions ?? []) as QuestionRow[]) {
    if (HIDDEN_QUESTION_IDS.has(question.id)) continue
    const rawCategory = question.categories
    const category = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory
    if (!category) continue
    const rawPart = category.parts
    const part = Array.isArray(rawPart) ? rawPart[0] : rawPart

    let section = grouped.get(category.id)
    if (!section) {
      section = {
        partName: part?.name ?? 'Questionnaire',
        categoryName: category.name,
        items: [],
        partOrder: part?.display_order ?? 0,
        catOrder: category.display_order,
      }
      grouped.set(category.id, section)
    }

    section.items.push({
      label: question.label,
      value: formatAnswerValue(answerByQuestion.get(question.id)),
      order: question.display_order,
    })
  }

  return [...grouped.values()]
    .sort((a, b) => a.partOrder - b.partOrder || a.catOrder - b.catOrder)
    .map(({ partName, categoryName, items }) => ({
      partName,
      categoryName,
      items: items
        .sort((a, b) => a.order - b.order)
        .map(({ label, value }) => ({ label, value })),
    }))
}

export async function POST(req: NextRequest) {
  try {
    const session = await getClientSession(req)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { answers } = await req.json()

    if (Array.isArray(answers) && answers.length > 0) {
      const rows = answers.map(({ questionId, value }: { questionId: string | number; value: unknown }) => ({
        client_id: session.clientId,
        question_id: questionId,
        answer_value: value,
      }))

      const { error: saveError } = await supabaseAdmin
        .from('answers')
        .upsert(rows, { onConflict: 'client_id,question_id' })

      if (saveError) {
        return NextResponse.json({ error: 'Failed to save answers.' }, { status: 500 })
      }
    }

    const [{ data: savedAnswers }, { data: questionRows }] = await Promise.all([
      supabaseAdmin
        .from('answers')
        .select('question_id, answer_value')
        .eq('client_id', session.clientId),
      supabaseAdmin
        .from('questions')
        .select(`
          id, label, required, answer_type, category_id, display_order,
          categories ( id, name, display_order ),
          question_options ( id, label, display_order, follow_up_prompt )
        `),
    ])

    const answersByQuestion: Record<number, unknown> = {}
    for (const row of savedAnswers ?? []) {
      answersByQuestion[row.question_id as number] = row.answer_value
    }

    type CatGroup = { name: string; display_order: number; questions: Question[] }

    const grouped = new Map<number, CatGroup>()
    for (const row of questionRows ?? []) {
      if (HIDDEN_QUESTION_IDS.has(row.id)) continue
      const rawCategory = row.categories as { id: number; name: string; display_order: number } | { id: number; name: string; display_order: number }[] | null
      const category = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory
      if (!category) continue
      let group = grouped.get(category.id)
      if (!group) {
        group = { name: category.name, display_order: category.display_order, questions: [] }
        grouped.set(category.id, group)
      }
      const options = (row.question_options ?? []) as NonNullable<Question['options']>
      group.questions.push({
        id: row.id,
        category_id: row.category_id,
        label: row.label,
        answer_type: row.answer_type as Question['answer_type'],
        help_text: null,
        required: row.required,
        display_order: row.display_order,
        options,
      })
    }

    const orderedCategories = [...grouped.values()]
      .sort((a, b) => a.display_order - b.display_order)
      .map(cat => ({
        ...cat,
        questions: [...cat.questions].sort((a, b) => a.display_order - b.display_order),
      }))

    const missing = findMissingRequired(orderedCategories, answersByQuestion)
    if (missing.length > 0) {
      return NextResponse.json({
        error: missingRequiredMessage(missing),
        missing,
      }, { status: 400 })
    }

    const { data: submittedClient, error } = await supabaseAdmin
      .from('clients')
      .update({ completed: true })
      .eq('id', session.clientId)
      .eq('completed', false)
      .select('id, first_name, last_name, email, company_name')
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: 'Failed to submit.' }, { status: 500 })
    }

    if (!submittedClient) {
      return NextResponse.json({ error: 'Questionnaire already submitted.', alreadySubmitted: true }, { status: 409 })
    }

    const siteUrl = getSiteUrl(req)
    const sections = await loadAnswerSections(session.clientId)
    const logoAttachment = await getEmailLogoAttachment()

    const { error: emailError } = await resend.emails.send({
      from: 'Techon Partners <onboarding@techonpartners.com>',
      replyTo: 'onboarding@techonpartners.com',
      to: submittedClient.email,
      subject: 'We received your Techon Partners onboarding questionnaire',
      html: buildClientSubmittedEmail({
        firstName: submittedClient.first_name,
        siteUrl,
      }),
      ...(logoAttachment ? { attachments: [logoAttachment] } : {}),
    })

    if (emailError) {
      console.error('Client submission email failed:', emailError)
    }

    const { error: internalEmailError } = await resend.emails.send({
      from: 'Techon Partners <onboarding@techonpartners.com>',
      replyTo: submittedClient.email,
      to: 'onboarding@techonpartners.com',
      subject: `Onboarding submitted: ${submittedClient.first_name} ${submittedClient.last_name}${submittedClient.company_name ? ` (${submittedClient.company_name})` : ''}`,
      html: buildInternalSubmittedEmail({
        firstName: submittedClient.first_name,
        lastName: submittedClient.last_name,
        email: submittedClient.email,
        companyName: submittedClient.company_name,
        siteUrl,
        sections,
      }),
    })

    if (internalEmailError) {
      console.error('Internal submission email failed:', internalEmailError)
    }

    return NextResponse.json({
      success: true,
      emailWarning: emailError || internalEmailError ? 'Submitted, but one of the notification emails failed to send.' : undefined,
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
