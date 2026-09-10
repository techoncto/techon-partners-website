import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  // 10 attempts per IP per 15 minutes
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!checkRateLimit(`validate:${ip}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })
  }

  try {
    const { code, email } = await req.json()

    if (!code || !email) {
      return NextResponse.json({ error: 'Invitation code and email are required.' }, { status: 400 })
    }

    const genericInvalid = NextResponse.json(
      { error: 'Invalid invitation code or email address. If you already have an account, please log in.' },
      { status: 400 },
    )

    const { data: token, error } = await supabaseAdmin
      .from('invite_tokens')
      .select('id, code, client_email, used, revoked, initiated_at')
      .eq('code', code.trim().toUpperCase())
      .single()

    // Same response for missing code, wrong email, used, or revoked so this
    // endpoint cannot confirm whether a known code is tied to a given email.
    if (
      error ||
      !token ||
      token.client_email.toLowerCase() !== email.trim().toLowerCase() ||
      token.revoked ||
      token.used
    ) {
      return genericInvalid
    }

    if (!token.initiated_at) {
      await supabaseAdmin
        .from('invite_tokens')
        .update({ initiated_at: new Date().toISOString() })
        .eq('id', token.id)
    }

    // Return the opaque code string — never expose the sequential integer ID.
    return NextResponse.json({ valid: true, code: token.code })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
