import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { signClientToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { inviteTokenId, firstName, lastName, email, phone, companyName, address, address2, city, state, zip, country, password } = await req.json()

    if (!inviteTokenId || !firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    // Re-verify the token still belongs to this email and is unused
    const { data: token, error: tokenError } = await supabaseAdmin
      .from('invite_tokens')
      .select('id, client_email, used')
      .eq('id', inviteTokenId)
      .single()

    if (tokenError || !token) {
      return NextResponse.json({ error: 'Invalid invitation.' }, { status: 404 })
    }

    if (token.client_email.toLowerCase() !== email.trim().toLowerCase()) {
      return NextResponse.json({ error: 'Email does not match invitation.' }, { status: 403 })
    }

    if (token.used) {
      return NextResponse.json({ error: 'This invitation has already been used.' }, { status: 409 })
    }

    // Check if client already registered
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
        invite_token_id: inviteTokenId,
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

    // Mark the invite token as used
    await supabaseAdmin
      .from('invite_tokens')
      .update({ used: true })
      .eq('id', inviteTokenId)

    const jwt = await signClientToken(client.id)

    const response = NextResponse.json({ success: true })
    response.cookies.set('client_session', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
