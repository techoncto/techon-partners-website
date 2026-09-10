import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { CLIENT_ID_HEADER, CLIENT_SV_HEADER } from '@/lib/client-session-headers'

const adminSecret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!)
const clientSecret = new TextEncoder().encode(process.env.CLIENT_JWT_SECRET!)

function toSessionVersion(value: unknown): number {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : 1
}

// ── Admin session ──────────────────────────────────────────────────────────────

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('12h')
    .sign(adminSecret)
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, adminSecret)
    return true
  } catch {
    return false
  }
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_session')?.value
  if (!token) return false
  return verifyAdminToken(token)
}

// ── Client session ─────────────────────────────────────────────────────────────

export async function signClientToken(clientId: string, sessionVersion: number): Promise<string> {
  return new SignJWT({ clientId, sv: toSessionVersion(sessionVersion) })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(clientSecret)
}

export async function verifyClientToken(token: string): Promise<{ clientId: string; sv: number } | null> {
  try {
    const { payload } = await jwtVerify(token, clientSecret)
    const sv = toSessionVersion(payload.sv)
    return { clientId: payload.clientId as string, sv }
  } catch {
    return null
  }
}

function tokenFromRequest(req: NextRequest): string | undefined {
  const fromCookies = req.cookies.get('client_session')?.value
  if (fromCookies) return fromCookies

  const raw = req.headers.get('cookie')
  if (!raw) return undefined
  const part = raw.split(';').map(s => s.trim()).find(s => s.startsWith('client_session='))
  if (!part) return undefined
  return decodeURIComponent(part.slice('client_session='.length))
}

async function sessionMatchesDb(clientId: string, tokenSv: number): Promise<boolean> {
  const { data: client } = await supabaseAdmin
    .from('clients')
    .select('session_version')
    .eq('id', clientId)
    .single()

  return !!client && tokenSv === toSessionVersion(client.session_version)
}

// Verifies the JWT signature then checks the session version against the DB.
// Tokens issued before a password reset will have a stale sv and be rejected.
export async function getClientSession(
  req?: NextRequest,
): Promise<{ clientId: string } | null> {
  const token = req
    ? tokenFromRequest(req)
    : (await cookies()).get('client_session')?.value

  if (token) {
    const payload = await verifyClientToken(token)
    if (payload && await sessionMatchesDb(payload.clientId, payload.sv)) {
      return { clientId: payload.clientId }
    }
  }

  const headerId = req?.headers.get(CLIENT_ID_HEADER)
  if (req && headerId) {
    const headerSv = toSessionVersion(req.headers.get(CLIENT_SV_HEADER))
    if (await sessionMatchesDb(headerId, headerSv)) {
      return { clientId: headerId }
    }
  }

  return null
}
