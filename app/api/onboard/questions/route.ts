import { NextResponse } from 'next/server'
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
          question_options ( id, label, display_order )
        )
      `)
      .order('display_order', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Failed to load questions.' }, { status: 500 })
    }

    // Sort questions and options by display_order
    const sorted = (categories ?? []).map(cat => ({
      ...cat,
      questions: [...(cat.questions ?? [])].sort((a, b) => a.display_order - b.display_order).map(q => ({
        ...q,
        options: [...(q.question_options ?? [])].sort((a, b) => a.display_order - b.display_order),
      })),
    }))

    return NextResponse.json({ categories: sorted })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
