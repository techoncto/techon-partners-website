import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getClientSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getClientSession(req.cookies)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: client } = await supabaseAdmin
      .from('clients')
      .select('completed')
      .eq('id', session.clientId)
      .single()

    if (client?.completed) {
      return NextResponse.json({ error: 'Questionnaire already submitted.', alreadySubmitted: true }, { status: 409 })
    }

    const { answers } = await req.json()
    // answers: Array<{ questionId: string; value: string | string[] | null }>

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: 'No answers provided.' }, { status: 400 })
    }

    const rows = answers.map(({ questionId, value }: { questionId: string; value: string | string[] | null }) => ({
      client_id: session.clientId,
      question_id: questionId,
      answer_value: value,
    }))

    const { error } = await supabaseAdmin
      .from('answers')
      .upsert(rows, { onConflict: 'client_id,question_id' })

    if (error) {
      return NextResponse.json({ error: 'Failed to save answers.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
