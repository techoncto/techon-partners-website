import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  try {
    const { clientId } = await params

    const { data: answers, error } = await supabaseAdmin
      .from('answers')
      .select(`
        answer_value,
        questions ( id, label, answer_type, display_order,
          categories ( id, name, display_order,
            parts ( id, name, display_order )
          )
        )
      `)
      .eq('client_id', clientId)

    if (error) {
      console.error('Fetch answers error:', error)
      return NextResponse.json({ error: 'Failed to fetch answers.', detail: error.message }, { status: 500 })
    }

    const answerCount = answers?.length ?? 0

    return NextResponse.json({ answers, answerCount })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
