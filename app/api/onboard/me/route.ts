import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getClientSession } from '@/lib/auth'
import { HIDDEN_QUESTION_IDS } from '@/lib/onboard-required'

const PROFILE_SELECT =
  'first_name, last_name, email, phone, company_name, address, address2, city, state, zip, country, completed'

const PHONE_RE = /^[\d\s\-()+.]{7,20}$/

export async function GET() {
  try {
    const session = await getClientSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [clientResult, answersResult, budgetResult, teamResult, questionsResult] = await Promise.all([
      supabaseAdmin
        .from('clients')
        .select(PROFILE_SELECT)
        .eq('id', session.clientId)
        .single(),
      supabaseAdmin
        .from('answers')
        .select('question_id')
        .eq('client_id', session.clientId),
      supabaseAdmin
        .from('budget_audit_items')
        .select('id', { count: 'exact', head: true })
        .eq('client_id', session.clientId)
        .is('deleted_at', null),
      supabaseAdmin
        .from('team_members')
        .select('id', { count: 'exact', head: true })
        .eq('client_id', session.clientId)
        .is('deleted_at', null),
      supabaseAdmin
        .from('questions')
        .select('id'),
    ])

    if (clientResult.error || !clientResult.data) {
      return NextResponse.json({ error: 'Failed to load profile.' }, { status: 500 })
    }

    const questionsCount = (questionsResult.data ?? []).filter(q => !HIDDEN_QUESTION_IDS.has(q.id)).length

    return NextResponse.json({
      profile: clientResult.data,
      stats: {
        answersCount: answersResult.data?.length ?? 0,
        questionsCount,
        budgetCount: budgetResult.count ?? 0,
        teamCount: teamResult.count ?? 0,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getClientSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const firstName = String(body.firstName ?? '').trim()
    const lastName = String(body.lastName ?? '').trim()
    const phone = String(body.phone ?? '').trim()
    const companyName = String(body.companyName ?? '').trim()
    const address = String(body.address ?? '').trim()
    const address2 = String(body.address2 ?? '').trim()
    const city = String(body.city ?? '').trim()
    const state = String(body.state ?? '').trim()
    const zip = String(body.zip ?? '').trim()
    const country = String(body.country ?? '').trim() || 'US'

    if (!firstName || !lastName || !companyName || !phone || !address || !city || !zip) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }
    if ((country === 'US' || country === 'CA') && !state) {
      return NextResponse.json({ error: 'Please select a state or province.' }, { status: 400 })
    }
    if (!PHONE_RE.test(phone)) {
      return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('clients')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone,
        company_name: companyName,
        address,
        address2: address2 || null,
        city,
        state,
        zip,
        country,
      })
      .eq('id', session.clientId)
      .select(PROFILE_SELECT)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 })
    }

    return NextResponse.json({ profile: data })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
