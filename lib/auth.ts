import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

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

type CookieReader = { get: (name: string) => { value: string } | undefined }

// Verifies the JWT signature then checks the session version against the DB.
// Tokens issued before a password reset will have a stale sv and be rejected.
export async function getClientSession(
  cookieStore?: CookieReader,
): Promise<{ clientId: string } | null> {
  const store = cookieStore ?? await cookies()
  const token = store.get('client_session')?.value
  if (!token) return null

  const payload = await verifyClientToken(token)
  if (!payload) return null

  const { data: client } = await supabaseAdmin
    .from('clients')
    .select('session_version')
    .eq('id', payload.clientId)
    .single()

  if (!client) return null

  if (payload.sv !== toSessionVersion(client.session_version)) return null

  return { clientId: payload.clientId }
}
