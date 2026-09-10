import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: clients, error } = await supabaseAdmin
      .from('clients')
      .select(`
        id, first_name, last_name, email, phone, company_name, address, address2, city, state, zip, country, completed, created_at,
        invite_tokens!invite_token_id ( id, code, created_at, client_name ),
        answers ( question_id )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Submissions fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch submissions.', detail: error.message }, { status: 500 })
    }

    return NextResponse.json({ clients })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
