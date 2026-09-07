import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getClientSession } from '@/lib/auth'
import { ALL_SKILLS } from '@/lib/skill-catalog'

const VALID_SKILL_IDS = new Set(ALL_SKILLS.map(s => s.id))

function clampScore(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isInteger(n) || n < 0 || n > 2) return 0
  return n
}

export async function POST(req: NextRequest) {
  try {
    const session = await getClientSession(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json() as {
      memberId?: unknown
      ratings?: { skill_id: string; proficiency: unknown; interest: unknown }[]
    }

    const memberId = typeof body.memberId === 'number' ? body.memberId : Number(body.memberId)
    if (!Number.isInteger(memberId) || memberId <= 0) {
      return NextResponse.json({ error: 'Invalid team member.' }, { status: 400 })
    }

    const { data: member } = await supabaseAdmin
      .from('team_members')
      .select('id')
      .eq('id', memberId)
      .eq('client_id', session.clientId)
      .is('deleted_at', null)
      .maybeSingle()

    if (!member) return NextResponse.json({ error: 'Team member not found.' }, { status: 404 })

    const ratings = (body.ratings ?? [])
      .filter(r => VALID_SKILL_IDS.has(r.skill_id))
      .map(r => ({
        team_member_id: memberId,
        skill_id: r.skill_id,
        proficiency: clampScore(r.proficiency),
        interest: clampScore(r.interest),
      }))

    if (ratings.length > 0) {
      const { error } = await supabaseAdmin
        .from('team_skill_ratings')
        .upsert(ratings, { onConflict: 'team_member_id,skill_id' })

      if (error) {
        console.error('Skill ratings save error:', error)
        return NextResponse.json({ error: 'Failed to save skills.' }, { status: 500 })
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
