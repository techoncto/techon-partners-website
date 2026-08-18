import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getClientSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getClientSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Save any final answers passed along with submit
    const { answers } = await req.json()

    if (Array.isArray(answers) && answers.length > 0) {
      const rows = answers.map(({ questionId, value }: { questionId: string; value: string | string[] | null }) => ({
        client_id: session.clientId,
        question_id: questionId,
        answer_value: value,
      }))

      await supabaseAdmin
        .from('answers')
        .upsert(rows, { onConflict: 'client_id,question_id' })
    }

    const { error } = await supabaseAdmin
      .from('clients')
      .update({ completed: true })
      .eq('id', session.clientId)

    if (error) {
      return NextResponse.json({ error: 'Failed to submit.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
