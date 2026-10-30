import type { Address, DateRange, Measurement, Portfolio, Skills } from '../types/portfolio'

export const FALLBACK_PROFILE_IMAGE = '/assets/fallback/profile.svg'
export const FALLBACK_WORK_IMAGE = '/assets/fallback/work.svg'

const formatterCache = new Map<string, Intl.DateTimeFormat>()

function getDateFormatter(locale: string): Intl.DateTimeFormat {
  const cached = formatterCache.get(locale)
  if (cached) return cached
  let formatter: Intl.DateTimeFormat
  try {
    formatter = new Intl.DateTimeFormat(locale, {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
  } catch {
    formatter = new Intl.DateTimeFormat('en', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }
  formatterCache.set(locale, formatter)
  return formatter
}

export function formatDate(value: string | null | undefined, locale = 'en'): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return getDateFormatter(locale).format(date)
}

export function formatDateRange(range: DateRange | undefined, locale = 'en'): string {
  if (!range) return ''
  const start = formatDate(range.start, locale)
  if (range.kind === 'ongoing') return `${start} — Present`
  return `${start} — ${formatDate(range.end, locale)}`
}

export function getDisplayName(portfolio: Portfolio): string {
  const preferred = portfolio.preferredName?.trim()
  if (preferred) return preferred
  return [portfolio.firstName, portfolio.lastName].filter(Boolean).join(' ').trim()
}

export function getInitials(value: string): string {
  const parts = value
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return `${first}${last}`.toUpperCase() || 'P'
}

export function formatAddress(address: Address | undefined): string {
  if (!address) return ''
  const parts = [address.city, address.region, address.country].filter((part): part is string =>
    Boolean(part && part.trim()),
  )
  const location = parts.join(', ')
  if (address.isRemote && location) return `${location} · Remote`
  if (address.isRemote) return 'Remote'
  return location
}

export function formatMeasurement(measurement: Measurement | undefined): string {
  if (!measurement) return ''
  const value = Number.isInteger(measurement.value)
    ? String(measurement.value)
    : measurement.value.toFixed(2)
  switch (measurement.scale) {
    case 'percent':
      return `${value}%`
    case 'gpa-4':
    case 'gpa-5':
      return `${value} GPA`
    case 'grade':
      return measurement.label ? `${measurement.label} ${value}` : `Grade ${value}`
    default:
      return measurement.label ? `${measurement.label} ${value}` : value
  }
}

/** `in-progress` → `In progress`. */
export function humanize(value: string): string {
  if (!value) return ''
  const spaced = value.replace(/[-_]+/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

/** Collapses whitespace and removes common inline Markdown syntax. */
export function plainText(value: string | undefined | null): string {
  if (!value) return ''
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function truncate(value: string, maxLength: number): string {
  const text = plainText(value)
  if (text.length <= maxLength) return text
  const cut = text.slice(0, maxLength - 1)
  const lastSpace = cut.lastIndexOf(' ')
  const base = lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut
  return `${base.trimEnd()}…`
}

const SKILL_GROUP_ORDER = ['technical', 'tools', 'creative', 'domain', 'languages', 'soft'] as const

/** Flattens a skills section into a deterministic list of names. */
export function collectSkillNames(skills: Skills | undefined, limit?: number): string[] {
  if (!skills) return []
  const names: string[] = []
  const seen = new Set<string>()
  for (const group of SKILL_GROUP_ORDER) {
    for (const skill of skills[group] ?? []) {
      const name = skill.name.trim()
      if (!name || seen.has(name.toLowerCase())) continue
      seen.add(name.toLowerCase())
      names.push(name)
      if (limit !== undefined && names.length >= limit) return names
    }
  }
  return names
}

export function joinNonEmpty(values: (string | undefined | null)[], separator = ' · '): string {
  return values.filter((value): value is string => Boolean(value && value.trim())).join(separator)
}

/** Occupations that add information beyond the headline (avoids repeating it). */
export function secondaryOccupations(
  occupations: readonly string[] | undefined,
  headline: string,
): string[] {
  if (!occupations) return []
  const key = headline.trim().toLowerCase()
  return occupations.filter((occupation) => occupation.trim().toLowerCase() !== key)
}

export function hasEntries(values: readonly unknown[] | undefined | null): boolean {
  return Array.isArray(values) && values.length > 0
}
