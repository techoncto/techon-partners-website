import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getClientSession } from '@/lib/auth'

interface MemberInput {
  id?: number
  team: string
  department: string
  role: string
  resource: string
  hours_per_week: number | null
  responsibilities: string
  software_used: string
  reports_to: string
  display_order: number
}

function toIntId(value: unknown): number | null {
  const n = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN
  return Number.isInteger(n) && n > 0 ? n : null
}

const MEMBER_SELECT =
  'id, team, department, role, resource, hours_per_week, responsibilities, software_used, reports_to, display_order'

export async function GET() {
  try {
    const session = await getClientSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [membersResult, orgResult, ratingsResult] = await Promise.all([
      supabaseAdmin
        .from('team_members')
        .select(MEMBER_SELECT)
        .eq('client_id', session.clientId)
        .is('deleted_at', null)
        .order('display_order', { ascending: true }),
      supabaseAdmin
        .from('client_org_charts')
        .select('id, file_name, mime_type, created_at')
        .eq('client_id', session.clientId)
        .maybeSingle(),
      supabaseAdmin
        .from('team_members')
        .select('id, team_skill_ratings ( skill_id, proficiency, interest )')
        .eq('client_id', session.clientId)
        .is('deleted_at', null),
    ])

    if (membersResult.error) {
      console.error('Team members load error:', membersResult.error)
      return NextResponse.json({ error: 'Failed to load team.' }, { status: 500 })
    }

    const ratings = (ratingsResult.data ?? []).flatMap(m =>
      ((m.team_skill_ratings as { skill_id: string; proficiency: number; interest: number }[] | null) ?? []).map(r => ({
        team_member_id: m.id as number,
        skill_id: r.skill_id,
        proficiency: r.proficiency,
        interest: r.interest,
      }))
    )

    return NextResponse.json({
      members: membersResult.data ?? [],
      orgChart: orgResult.data ?? null,
      ratings,
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getClientSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json() as { items: MemberInput[]; deletedIds?: unknown[] }
    const items = body.items ?? []
    const deletedIds = (body.deletedIds ?? []).map(toIntId).filter((id): id is number => id !== null)

    if (deletedIds.length > 0) {
      const { error: softDeleteError } = await supabaseAdmin
        .from('team_members')
        .update({ deleted_at: new Date().toISOString() })
        .eq('client_id', session.clientId)
        .in('id', deletedIds)
        .is('deleted_at', null)

      if (softDeleteError) {
        console.error('Team members soft-delete error:', softDeleteError)
        return NextResponse.json({ error: 'Failed to save.' }, { status: 500 })
      }
    }

    const toUpdate = items.filter(item => toIntId(item.id) !== null)
    const toInsert = items.filter(item => toIntId(item.id) === null)

    for (const [idx, item] of toUpdate.entries()) {
      const id = toIntId(item.id)!
      const { error: updateError } = await supabaseAdmin
        .from('team_members')
        .update({
          team: item.team ?? '',
          department: item.department ?? '',
          role: item.role ?? '',
          resource: item.resource ?? '',
          hours_per_week: item.hours_per_week ?? null,
          responsibilities: item.responsibilities ?? '',
          software_used: item.software_used ?? '',
          reports_to: item.reports_to ?? '',
          display_order: item.display_order ?? idx,
        })
        .eq('id', id)
        .eq('client_id', session.clientId)
        .is('deleted_at', null)

      if (updateError) {
        console.error('Team members update error:', updateError)
        return NextResponse.json({ error: 'Failed to save.' }, { status: 500 })
      }
    }

    if (toInsert.length > 0) {
      const rows = toInsert.map((item, idx) => ({
        client_id: session.clientId,
        team: item.team ?? '',
        department: item.department ?? '',
        role: item.role ?? '',
        resource: item.resource ?? '',
        hours_per_week: item.hours_per_week ?? null,
        responsibilities: item.responsibilities ?? '',
        software_used: item.software_used ?? '',
        reports_to: item.reports_to ?? '',
        display_order: item.display_order ?? toUpdate.length + idx,
      }))

      const { error: insertError } = await supabaseAdmin
        .from('team_members')
        .insert(rows)

      if (insertError) {
        console.error('Team members insert error:', insertError)
        return NextResponse.json({ error: 'Failed to save.' }, { status: 500 })
      }
    }

    const { data: saved } = await supabaseAdmin
      .from('team_members')
      .select(MEMBER_SELECT)
      .eq('client_id', session.clientId)
      .is('deleted_at', null)
      .order('display_order', { ascending: true })

    return NextResponse.json({ ok: true, members: saved ?? [] })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
