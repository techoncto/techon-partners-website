import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const adminSecret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!)
const clientSecret = new TextEncoder().encode(process.env.CLIENT_JWT_SECRET!)

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

export async function signClientToken(clientId: string): Promise<string> {
  return new SignJWT({ clientId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(clientSecret)
}

export async function verifyClientToken(token: string): Promise<{ clientId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, clientSecret)
    return { clientId: payload.clientId as string }
  } catch {
    return null
  }
}

export async function getClientSession(): Promise<{ clientId: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('client_session')?.value
  if (!token) return null
  return verifyClientToken(token)
}
