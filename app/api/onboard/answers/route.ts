import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getClientSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getClientSession(req.cookies)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [{ data: answers, error }, { data: client }] = await Promise.all([
      supabaseAdmin
        .from('answers')
        .select('question_id, answer_value')
        .eq('client_id', session.clientId),
      supabaseAdmin
        .from('clients')
        .select('completed')
        .eq('id', session.clientId)
        .single(),
    ])

    if (error) {
      return NextResponse.json({ error: 'Failed to load answers.' }, { status: 500 })
    }

    return NextResponse.json({
      answers: answers ?? [],
      completed: client?.completed ?? false,
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
