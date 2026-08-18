import { NextRequest, NextResponse } from 'next/server'
import { signAdminToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    if (!password) {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 })
    }

    if (password !== process.env.ADMIN_PASSWORD) {
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
