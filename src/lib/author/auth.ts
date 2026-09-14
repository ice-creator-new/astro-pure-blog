import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

/** SHA-256 of the author password (not the password itself). */
export const AUTHOR_PASSWORD_HASH =
  'ba723435a66e490530c3efdfeac868e06fde6e35dcc43fa8528fb1b2c9411ef5'

export const SESSION_COOKIE = 'ice_author_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 12 // 12h

function sha256(text: string) {
  return createHash('sha256').update(text, 'utf8').digest('hex')
}

function sessionSecret() {
  return (
    process.env.AUTHOR_SESSION_SECRET ||
    process.env.AUTHOR_PASSWORD ||
    AUTHOR_PASSWORD_HASH
  )
}

export function verifyPassword(password: string): boolean {
  const envPw = process.env.AUTHOR_PASSWORD
  if (envPw) {
    const a = Buffer.from(password)
    const b = Buffer.from(envPw)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  }
  const digest = sha256(password)
  const a = Buffer.from(digest)
  const b = Buffer.from(AUTHOR_PASSWORD_HASH)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function createSessionToken(): string {
  const exp = Date.now() + SESSION_TTL_MS
  const payload = `ok.${exp}`
  const sig = createHmac('sha256', sessionSecret()).update(payload).digest('hex')
  return `${payload}.${sig}`
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [ok, expStr, sig] = parts
  if (ok !== 'ok') return false
  const exp = Number(expStr)
  if (!Number.isFinite(exp) || Date.now() > exp) return false
  const payload = `${ok}.${expStr}`
  const expected = createHmac('sha256', sessionSecret()).update(payload).digest('hex')
  try {
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    return a.length === b.length && timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export function requireAuthor(request: Request, cookieHeader?: string | null): boolean {
  // Prefer Cookie header parsing for API routes
  const raw =
    cookieHeader ??
    request.headers.get('cookie') ??
    ''
  const match = raw.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`))
  const token = match ? decodeURIComponent(match[1]) : null
  return verifySessionToken(token)
}
