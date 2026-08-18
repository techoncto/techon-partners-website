import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getClientSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getClientSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: answers, error } = await supabaseAdmin
      .from('answers')
      .select('question_id, answer_value')
      .eq('client_id', session.clientId)

    if (error) {
      return NextResponse.json({ error: 'Failed to load answers.' }, { status: 500 })
    }

    return NextResponse.json({ answers: answers ?? [] })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
