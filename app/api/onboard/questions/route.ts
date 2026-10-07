import { NextResponse } from 'next/server'
import { HIDDEN_QUESTION_IDS } from '@/lib/onboard-required'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: categories, error } = await supabaseAdmin
      .from('categories')
      .select(`
        id, part_id, name, display_order, deleted_at,
        parts ( id, name, display_order, deleted_at ),
        questions (
          id, label, answer_type, help_text, required, display_order, deleted_at,
          question_options ( id, label, display_order, follow_up_prompt, deleted_at )
        )
      `)
      .is('deleted_at', null)
      .order('display_order', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Failed to load questions.' }, { status: 500 })
    }

    const sorted = (categories ?? [])
      .filter(cat => {
        const part = Array.isArray(cat.parts) ? cat.parts[0] : cat.parts
        return cat.deleted_at == null && part?.deleted_at == null
      })
      .map(cat => ({
      ...cat,
      questions: [...(cat.questions ?? [])]
        .filter(q => !HIDDEN_QUESTION_IDS.has(q.id) && q.deleted_at == null)
        .sort((a, b) => a.display_order - b.display_order).map(q => ({
        ...q,
        options: [...(q.question_options ?? [])]
          .filter(option => option.deleted_at == null)
          .sort((a, b) => a.display_order - b.display_order),
      })),
    }))

    return NextResponse.json({ categories: sorted })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
