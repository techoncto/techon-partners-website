import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { CLIENT_ID_HEADER, CLIENT_SV_HEADER } from '@/lib/client-session-headers'

const adminSecret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!)
const clientSecret = new TextEncoder().encode(process.env.CLIENT_JWT_SECRET!)

function toSessionVersion(value: unknown): number {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : 1
}

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

async function getClientPayload(req: NextRequest): Promise<{ clientId: string; sv: number } | null> {
  const token = req.cookies.get('client_session')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, clientSecret)
    const clientId = payload.clientId as string
    if (!clientId) return null
    return { clientId, sv: toSessionVersion(payload.sv) }
  } catch {
    return null
  }
}

function nextWithClientSession(req: NextRequest, session: { clientId: string; sv: number }) {
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set(CLIENT_ID_HEADER, session.clientId)
  requestHeaders.set(CLIENT_SV_HEADER, String(session.sv))
  const res = NextResponse.next({ request: { headers: requestHeaders } })
  res.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate')
  return res
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
    const session = await getClientPayload(req)
    if (session) {
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
    const session = await getClientPayload(req)
    if (!session) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/onboard/login', req.url))
    }
    return nextWithClientSession(req, session)
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
