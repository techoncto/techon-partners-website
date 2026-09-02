import { NextResponse } from 'next/server'
import { HIDDEN_QUESTION_IDS } from '@/lib/onboard-required'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: categories, error } = await supabaseAdmin
      .from('categories')
      .select(`
        id, part_id, name, display_order,
        parts ( id, name, display_order ),
        questions (
          id, label, answer_type, help_text, required, display_order,
          question_options ( id, label, display_order, follow_up_prompt )
        )
      `)
      .order('display_order', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Failed to load questions.' }, { status: 500 })
    }

    const sorted = (categories ?? []).map(cat => ({
      ...cat,
      questions: [...(cat.questions ?? [])]
        .filter(q => !HIDDEN_QUESTION_IDS.has(q.id))
        .sort((a, b) => a.display_order - b.display_order).map(q => ({
        ...q,
        options: [...(q.question_options ?? [])].sort((a, b) => a.display_order - b.display_order),
      })),
    }))

    return NextResponse.json({ categories: sorted })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
