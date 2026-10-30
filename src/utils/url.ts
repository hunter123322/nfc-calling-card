/**
 * URL and contact-value guards.
 *
 * Portfolio documents are public, untrusted input. Every link rendered from
 * them passes through these helpers so only safe protocols reach the DOM.
 */

const HTTP_PROTOCOLS = new Set(['http:', 'https:'])
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[+()0-9\s.\-x]{5,}$/i

/** Absolute http(s) URL, e.g. a website or repository link. */
export function isSafeHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.trim() === '') return false
  try {
    const url = new URL(value)
    return HTTP_PROTOCOLS.has(url.protocol) && url.hostname.length > 0
  } catch {
    return false
  }
}

/**
 * Media source URL: either a public asset path (`/assets/...`) or http(s).
 * Protocol-relative URLs (`//evil.example`) and `javascript:` are rejected.
 */
export function isSafeMediaUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.trim() === '') return false
  const trimmed = value.trim()
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true
  return isSafeHttpUrl(trimmed)
}

export function isSafeEmail(value: unknown): value is string {
  return typeof value === 'string' && EMAIL_PATTERN.test(value.trim())
}

export function isSafePhoneNumber(value: unknown): value is string {
  return typeof value === 'string' && PHONE_PATTERN.test(value.trim())
}

/** Returns the URL when it is safe, otherwise `undefined`. */
export function toExternalHref(value: unknown): string | undefined {
  return isSafeHttpUrl(value) ? value.trim() : undefined
}

export function toMediaSrc(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  // Accept the common `public/...` mistake and turn it into a public URL path.
  const normalized = value.trim().replace(/^\.?\/?public\//i, '/')
  return isSafeMediaUrl(normalized) ? normalized : undefined
}

export function toMailtoHref(email: string): string | undefined {
  return isSafeEmail(email) ? `mailto:${email.trim()}` : undefined
}

export function toTelHref(phone: string): string | undefined {
  if (!isSafePhoneNumber(phone)) return undefined
  const normalized = phone.replace(/[^\d+]/g, '')
  return normalized.length > 0 ? `tel:${normalized}` : undefined
}

/** Joins a path against an origin, leaving absolute URLs untouched. */
export function toAbsoluteUrl(
  value: string | undefined,
  origin: string | undefined,
): string | undefined {
  if (!value) return undefined
  if (isSafeHttpUrl(value)) return value
  if (!origin || !isSafeMediaUrl(value)) return undefined
  return new URL(value, origin).toString()
}
