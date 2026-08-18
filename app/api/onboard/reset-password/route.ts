import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { signClientToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and new password are required.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    // Look up the reset token
    const { data: reset } = await supabaseAdmin
      .from('password_resets')
      .select('id, client_id, expires_at, used_at')
      .eq('token', token)
      .single()

    if (!reset) {
      return NextResponse.json({ error: 'Invalid or expired reset link.' }, { status: 400 })
    }

    if (reset.used_at) {
      return NextResponse.json({ error: 'This reset link has already been used.' }, { status: 400 })
    }

    if (new Date(reset.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This reset link has expired. Please request a new one.' }, { status: 400 })
    }

    const password_hash = await bcrypt.hash(password, 12)

    // Fetch the current session_version so we can increment it
    const { data: currentClient } = await supabaseAdmin
      .from('clients')
      .select('session_version')
      .eq('id', reset.client_id)
      .single()

    const nextVersion = (currentClient?.session_version ?? 1) + 1

    // Update password and increment session_version to invalidate all existing JWTs
    const { error: updateError } = await supabaseAdmin
      .from('clients')
      .update({ password_hash, session_version: nextVersion })
      .eq('id', reset.client_id)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update password. Please try again.' }, { status: 500 })
    }

    // Mark token as used
    await supabaseAdmin
      .from('password_resets')
      .update({ used_at: new Date().toISOString() })
      .eq('id', reset.id)

    // Issue a fresh session cookie with the new version so the user stays logged in
    const jwt = await signClientToken(reset.client_id, nextVersion)
    const response = NextResponse.json({ success: true })
    response.cookies.set('client_session', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return response
  } catch (err) {
    console.error('Reset password error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
