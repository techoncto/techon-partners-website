import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { code, email } = await req.json()

    if (!code || !email) {
      return NextResponse.json({ error: 'Invitation code and email are required.' }, { status: 400 })
    }

    const { data: token, error } = await supabaseAdmin
      .from('invite_tokens')
      .select('id, code, client_email, used, initiated_at')
      .eq('code', code.trim().toUpperCase())
      .single()

    if (error || !token) {
      return NextResponse.json({ error: 'Invalid invitation code.' }, { status: 404 })
    }

    if (token.client_email.toLowerCase() !== email.trim().toLowerCase()) {
      return NextResponse.json({ error: 'This invitation code does not match the email address provided.' }, { status: 403 })
    }

    if (token.used) {
      return NextResponse.json({ error: 'This invitation has already been used. Please log in instead.' }, { status: 409 })
    }

    // Record first time the client validates their code (don't overwrite if already set)
    if (!token.initiated_at) {
      await supabaseAdmin
        .from('invite_tokens')
        .update({ initiated_at: new Date().toISOString() })
        .eq('id', token.id)
    }

    return NextResponse.json({ valid: true, inviteTokenId: token.id })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
