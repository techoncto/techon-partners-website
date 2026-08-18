import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const adminSecret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!)
const clientSecret = new TextEncoder().encode(process.env.CLIENT_JWT_SECRET!)

async function isValidAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('admin_session')?.value
  if (!token) return false
  try {
    await jwtVerify(token, adminSecret)
    return true
  } catch {
    return false
  }
}

async function isValidClient(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('client_session')?.value
  if (!token) return false
  try {
    await jwtVerify(token, clientSecret)
    return true
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect admin API routes only — the /admin page handles its own auth client-side
  if (pathname.startsWith('/api/admin')) {
    // Allow the login and logout APIs through
    if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') return NextResponse.next()

    const valid = await isValidAdmin(req)
    if (!valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Protect the onboarding form page and client API routes
  if (
    pathname === '/onboard/form' ||
    pathname === '/api/onboard/questions' ||
    pathname === '/api/onboard/save' ||
    pathname === '/api/onboard/submit'
  ) {
    const valid = await isValidClient(req)
    if (!valid) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/onboard/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/admin/:path*',
    '/onboard/form',
    '/api/onboard/questions',
    '/api/onboard/save',
    '/api/onboard/submit',
  ],
}
