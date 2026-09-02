import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  try {
    const { clientId } = await params

    const [answersResult, budgetResult, teamResult, orgResult] = await Promise.all([
      supabaseAdmin
        .from('answers')
        .select(`
          answer_value,
          questions ( id, label, answer_type, display_order,
            categories ( id, name, display_order,
              parts ( id, name, display_order )
            )
          )
        `)
        .eq('client_id', clientId),

      supabaseAdmin
        .from('budget_audit_items')
        .select('id, expense, cost, purpose, action, billing_frequency, billing_date, notes, display_order')
        .eq('client_id', clientId)
        .is('deleted_at', null)
        .order('display_order', { ascending: true }),

      supabaseAdmin
        .from('team_members')
        .select('id, team, department, role, resource, hours_per_week, responsibilities, software_used, reports_to, display_order, team_skill_ratings ( skill_id, proficiency, interest )')
        .eq('client_id', clientId)
        .is('deleted_at', null)
        .order('display_order', { ascending: true }),

      supabaseAdmin
        .from('client_org_charts')
        .select('id, file_name, mime_type, created_at')
        .eq('client_id', clientId)
        .maybeSingle(),
    ])

    if (answersResult.error) {
      console.error('Fetch answers error:', answersResult.error)
      return NextResponse.json({ error: 'Failed to fetch answers.', detail: answersResult.error.message }, { status: 500 })
    }

    return NextResponse.json({
      answers: answersResult.data ?? [],
      answerCount: (answersResult.data ?? []).length,
      budgetItems: budgetResult.data ?? [],
      teamMembers: teamResult.data ?? [],
      orgChart: orgResult.data ?? null,
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  try {
    const { clientId } = await params
    const { completed } = await req.json()

    if (completed !== false) {
      return NextResponse.json({ error: 'Only reopening a completed questionnaire is supported.' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('clients')
      .update({ completed: false })
      .eq('id', clientId)
      .select('id, completed')
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: 'Failed to update questionnaire status.' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Client not found.' }, { status: 404 })
    }

    return NextResponse.json({ success: true, completed: false })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
