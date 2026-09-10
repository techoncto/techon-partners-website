import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { signAdminToken } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  // 5 attempts per IP per 15 minutes
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!checkRateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })
  }

  try {
    const { password } = await req.json()

    if (typeof password !== 'string' || !password) {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 })
    }

    // Fail closed: a missing or trivial env secret must never compare equal to "".
    const expected = process.env.ADMIN_PASSWORD
    if (!expected || expected.length < 12) {
      console.error('ADMIN_PASSWORD is missing or shorter than 12 characters')
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 })
    }

    const submitted = Buffer.from(password)
    const secret = Buffer.from(expected)
    const passwordsMatch =
      submitted.length === secret.length && timingSafeEqual(submitted, secret)

    if (!passwordsMatch) {
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 })
    }

    const jwt = await signAdminToken()

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_session', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 12, // 12 hours
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
