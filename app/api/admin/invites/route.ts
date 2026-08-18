import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: tokens, error } = await supabaseAdmin
      .from('invite_tokens')
      .select(`
        id, code, client_name, client_email, created_at, used, email_sent_at, email_status, initiated_at,
        clients ( id, first_name, last_name, completed )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Invites fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch invites.', detail: error.message }, { status: 500 })
    }

    return NextResponse.json({ tokens })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
