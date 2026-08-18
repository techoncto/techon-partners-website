import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { signClientToken } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rateLimit'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  // 10 attempts per IP per 15 minutes
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!checkRateLimit(`register:${ip}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })
  }

  try {
    const { code, firstName, lastName, email, phone, companyName, address, address2, city, state, zip, country, password } = await req.json()

    if (!code || !firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    // Look up by the opaque code string, not the sequential integer ID.
    // Collapse all token/email mismatch errors into one response so the endpoint
    // cannot be used to enumerate valid invite codes.
    const { data: token, error: tokenError } = await supabaseAdmin
      .from('invite_tokens')
      .select('id, code, client_email, used')
      .eq('code', code.trim().toUpperCase())
      .single()

    if (tokenError || !token || token.client_email.toLowerCase() !== email.trim().toLowerCase()) {
      return NextResponse.json({ error: 'Invalid invitation.' }, { status: 400 })
    }

    if (token.used) {
      return NextResponse.json({ error: 'This invitation has already been used.' }, { status: 400 })
    }

    const { data: existing } = await supabaseAdmin
      .from('clients')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists. Please log in.' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .insert({
        invite_token_id: token.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() ?? null,
        company_name: companyName?.trim() ?? null,
        address: address?.trim() ?? null,
        address2: address2?.trim() ?? null,
        city: city?.trim() ?? null,
        state: state?.trim() ?? null,
        zip: zip?.trim() ?? null,
        country: country?.trim() || 'US',
        password_hash: passwordHash,
        completed: false,
      })
      .select('id')
      .single()

    if (clientError || !client) {
      return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 500 })
    }

    await supabaseAdmin
      .from('invite_tokens')
      .update({ used: true })
      .eq('id', token.id)

    const jwt = await signClientToken(client.id, 1)

    const response = NextResponse.json({ success: true })
    response.cookies.set('client_session', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
