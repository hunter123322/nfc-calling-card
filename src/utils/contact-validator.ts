import {
  CONTACT_SOCIAL_PLATFORMS,
  type ContactProfile,
  type ContactSocialLinks,
  type ContactSocialPlatform,
} from '../types/contact'
import { isSafeEmail, isSafePhoneNumber, toExternalHref, toMediaSrc } from './url'

export interface ContactIssue {
  path: string
  message: string
  severity: 'error' | 'warning'
}

export interface ContactValidationResult {
  valid: boolean
  issues: ContactIssue[]
  profile: ContactProfile | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

/**
 * Canonical form is an uppercase `C`, a hyphen, and five lowercase hex digits:
 * `C-00001`, `C-4b29a`. URLs are accepted case-insensitively.
 */
export function normalizeContactCode(value: string): string {
  const match = /^c-([0-9a-f]{5})$/i.exec(value.trim())
  const hex = match?.[1]
  return hex ? `C-${hex.toLowerCase()}` : ''
}

const KNOWN_SOCIAL_PLATFORMS = new Set<string>(CONTACT_SOCIAL_PLATFORMS)

/**
 * Validates and normalises a contact JSON object.
 * Only the requested fields are kept: name, age, address, email, mobile,
 * occupation, profile picture, and social profile URLs.
 */
export function validateContact(raw: unknown, expectedCode: string): ContactValidationResult {
  const issues: ContactIssue[] = []
  const fail = (path: string, message: string): void => {
    issues.push({ path, message, severity: 'error' })
  }
  const warn = (path: string, message: string): void => {
    issues.push({ path, message, severity: 'warning' })
  }

  const code = normalizeContactCode(expectedCode)
  if (!code) {
    fail('code', 'The file name must be a contact code such as C-00001.')
  }

  if (!isRecord(raw)) {
    fail('document', 'Contact data must be a JSON object.')
    return { valid: false, issues, profile: null }
  }

  const fullName = asString(raw.fullName)
  if (!fullName) fail('fullName', 'fullName is required.')

  const age = asNumber(raw.age)
  if (age === undefined || !Number.isInteger(age) || age < 0 || age > 150) {
    fail('age', 'age must be a whole number between 0 and 150.')
  }

  const address = asString(raw.address)
  if (!address) fail('address', 'address is required.')

  const email = asString(raw.email)
  if (!isSafeEmail(email)) fail('email', 'email must be a valid email address.')

  const mobile = asString(raw.mobile)
  if (!isSafePhoneNumber(mobile)) fail('mobile', 'mobile must be a valid phone number.')

  const occupation = asString(raw.occupation)
  if (!occupation) fail('occupation', 'occupation is required.')

  const profileImageUrl = toMediaSrc(asString(raw.profileImageUrl))
  if (!profileImageUrl) {
    fail('profileImageUrl', 'profileImageUrl is required and must be a safe image URL.')
  }

  const social: ContactSocialLinks = {}
  if (raw.social !== undefined && raw.social !== null) {
    if (!isRecord(raw.social)) {
      warn('social', 'social must be a mapping of platform names to URLs.')
    } else {
      for (const platform of CONTACT_SOCIAL_PLATFORMS) {
        const value = raw.social[platform]
        if (value === undefined || value === null || value === '') continue
        const url = toExternalHref(value)
        if (!url) {
          warn(`social.${platform}`, 'Ignored an unsafe social URL.')
          continue
        }
        social[platform as ContactSocialPlatform] = url
      }
      for (const key of Object.keys(raw.social)) {
        if (!KNOWN_SOCIAL_PLATFORMS.has(key)) {
          warn(`social.${key}`, 'Unknown social platform was ignored.')
        }
      }
    }
  }

  const errors = issues.some((issue) => issue.severity === 'error')
  if (
    errors ||
    !code ||
    !fullName ||
    age === undefined ||
    !address ||
    !email ||
    !mobile ||
    !occupation ||
    !profileImageUrl
  ) {
    return { valid: false, issues, profile: null }
  }

  return {
    valid: true,
    issues,
    profile: {
      code,
      fullName,
      age,
      address,
      email,
      mobile,
      occupation,
      profileImageUrl,
      social,
    },
  }
}
