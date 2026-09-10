const CANONICAL_SITE_URL = 'https://techonpartners.com'

function trimSlash(url: string) {
  return url.trim().replace(/\/$/, '')
}

/** Branch deploys and deploy previews: `main--site.netlify.app` */
function isEphemeralNetlifyUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url)
    return hostname.endsWith('.netlify.app') && hostname.includes('--')
  } catch {
    return false
  }
}

function usablePublicUrl(value: string | undefined | null): string | null {
  if (!value?.trim()) return null
  const trimmed = trimSlash(value)
  if (isEphemeralNetlifyUrl(trimmed)) return null
  try {
    new URL(trimmed)
    return trimmed
  } catch {
    return null
  }
}

/**
 * Canonical public origin for emails and invite/reset links.
 * Ignores Netlify branch URLs so production never sends `main--*.netlify.app`.
 */
export function getSiteUrl(req?: { url: string; headers: Headers }): string {
  // Local: always use this request's origin (localhost), never the production domain.
  if (process.env.NODE_ENV !== 'production' && req) {
    const fromReq = usablePublicUrl(new URL(req.url).origin)
    if (fromReq) return fromReq
  }

  const fromEnv =
    usablePublicUrl(process.env.SITE_URL) ??
    usablePublicUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    usablePublicUrl(process.env.URL)

  if (fromEnv) return fromEnv

  if (req) {
    const forwardedHost = req.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
    const proto = req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() ?? 'https'
    if (forwardedHost) {
      const fromForwarded = usablePublicUrl(`${proto}://${forwardedHost}`)
      if (fromForwarded) return fromForwarded
    }

    const fromReq = usablePublicUrl(new URL(req.url).origin)
    if (fromReq) return fromReq
  }

  return CANONICAL_SITE_URL
}
