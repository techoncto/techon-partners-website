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

  // Already-logged-in clients: skip invite/login and go to the onboard home
  if (pathname === '/onboard/login' || pathname === '/onboard') {
    const valid = await isValidClient(req)
    if (valid) {
      return NextResponse.redirect(new URL('/onboard/home', req.url))
    }
    return NextResponse.next()
  }

  if (pathname === '/onboard/form' || pathname.startsWith('/onboard/form/')) {
    const dest = pathname.replace(/^\/onboard\/form/, '/onboard/questionnaire')
    return NextResponse.redirect(new URL(dest + req.nextUrl.search, req.url))
  }

  // Protect onboarding pages and client API routes
  if (
    pathname === '/onboard/home' ||
    pathname === '/onboard/profile' ||
    pathname === '/onboard/questionnaire' ||
    pathname.startsWith('/onboard/questionnaire/') ||
    pathname === '/onboard/budget-audit' ||
    pathname === '/onboard/team' ||
    pathname === '/api/onboard/me' ||
    pathname === '/api/onboard/questions' ||
    pathname === '/api/onboard/answers' ||
    pathname === '/api/onboard/save' ||
    pathname === '/api/onboard/submit' ||
    pathname === '/api/onboard/budget-audit' ||
    pathname.startsWith('/api/onboard/team')
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
    '/onboard',
    '/onboard/login',
    '/onboard/home',
    '/onboard/profile',
    '/onboard/form',
    '/onboard/form/:path*',
    '/onboard/questionnaire',
    '/onboard/questionnaire/:path*',
    '/onboard/budget-audit',
    '/onboard/team',
    '/api/onboard/me',
    '/api/onboard/questions',
    '/api/onboard/answers',
    '/api/onboard/save',
    '/api/onboard/submit',
    '/api/onboard/budget-audit',
    '/api/onboard/team',
    '/api/onboard/team/:path*',
  ],
}
