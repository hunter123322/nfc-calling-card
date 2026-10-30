import type { Portfolio } from '../types/portfolio'
import type { ContactProfile } from '../types/contact'
import { getDisplayName, plainText, truncate } from './portfolio-formatter'
import { toAbsoluteUrl, toMediaSrc } from './url'

export interface SeoMetadata {
  title: string
  description: string
  canonicalUrl?: string
  ogTitle: string
  ogDescription: string
  ogImage?: string
  ogType: 'website' | 'profile'
  ogSiteName: string
  locale: string
  robots: string
  keywords?: string[]
}

const SITE_NAME = 'Portfolios'
const DESCRIPTION_LIMIT = 160

function currentOrigin(): string | undefined {
  const location = (globalThis as { location?: { origin?: string } }).location
  return location?.origin
}

export function toOgLocale(locale: string): string {
  return locale.replace('-', '_')
}

function uniqueKeywords(values: (string | undefined)[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const value of values) {
    const keyword = value?.trim()
    if (!keyword) continue
    const key = keyword.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(keyword)
  }
  return result
}

export function buildPortfolioSeo(portfolio: Portfolio, baseUrl?: string): SeoMetadata {
  const name = getDisplayName(portfolio)
  const headline = portfolio.summary.headline
  const origin =
    baseUrl ??
    (portfolio.metadata.canonicalUrl
      ? new URL(portfolio.metadata.canonicalUrl).origin
      : currentOrigin())

  return {
    title: `${name} — ${headline}`,
    description: truncate(portfolio.summary.introduction, DESCRIPTION_LIMIT),
    canonicalUrl: portfolio.metadata.canonicalUrl,
    ogTitle: `${name} — ${headline}`,
    ogDescription: truncate(portfolio.summary.introduction, DESCRIPTION_LIMIT),
    ogImage:
      toAbsoluteUrl(portfolio.profileImageUrl, origin) ??
      toMediaSrc(portfolio.profileImageUrl) ??
      undefined,
    ogType: 'profile',
    ogSiteName: SITE_NAME,
    locale: portfolio.metadata.locale,
    robots: portfolio.metadata.visibility === 'public' ? 'index,follow' : 'noindex,follow',
    keywords: uniqueKeywords([
      ...(portfolio.metadata.keywords ?? []),
      ...portfolio.occupation,
      headline,
    ]),
  }
}

export function buildDirectorySeo(portfolioCount: number): SeoMetadata {
  const description =
    portfolioCount > 0
      ? `Browse ${portfolioCount} published ${portfolioCount === 1 ? 'portfolio' : 'portfolios'
      }. Each one is a single Markdown file rendered as a focused, fast page.`
      : 'Browse published portfolios. Each one is a single Markdown file rendered as a focused, fast page.'

  return {
    title: `${SITE_NAME} — Work from people who care about the details`,
    description,
    ogTitle: SITE_NAME,
    ogDescription: description,
    ogType: 'website',
    ogSiteName: SITE_NAME,
    locale: 'en',
    robots: 'index,follow',
  }
}

export function buildContactSeo(contact: ContactProfile): SeoMetadata {
  const title = `${contact.fullName} — ${contact.occupation}`
  const description = `Contact card for ${contact.fullName} (${contact.occupation}).`

  return {
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: 'profile',
    ogSiteName: SITE_NAME,
    locale: 'en',
    // Personal contact details stay out of search indexes.
    robots: 'noindex,nofollow',
  }
}

export function buildContactNotFoundSeo(): SeoMetadata {
  return {
    title: 'Contact not found',
    description: 'This contact code does not exist.',
    ogTitle: 'Contact not found',
    ogDescription: 'This contact code does not exist.',
    ogType: 'website',
    ogSiteName: SITE_NAME,
    locale: 'en',
    robots: 'noindex,nofollow',
  }
}

export function buildNotFoundSeo(): SeoMetadata {
  return {
    title: 'Portfolio not found',
    description: 'This portfolio does not exist or is not published.',
    ogTitle: 'Portfolio not found',
    ogDescription: 'This portfolio does not exist or is not published.',
    ogType: 'website',
    ogSiteName: SITE_NAME,
    locale: 'en',
    robots: 'noindex,nofollow',
  }
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Serialises metadata into `<head>` markup. Used by the prerenderer. */
export function renderSeoHead(meta: SeoMetadata): string {
  const tags: string[] = [
    `    <title>${escapeText(meta.title)}</title>`,
    `    <meta name="description" content="${escapeAttribute(meta.description)}" />`,
    `    <meta name="robots" content="${escapeAttribute(meta.robots)}" />`,
    `    <meta property="og:title" content="${escapeAttribute(meta.ogTitle)}" />`,
    `    <meta property="og:description" content="${escapeAttribute(meta.ogDescription)}" />`,
    `    <meta property="og:type" content="${escapeAttribute(meta.ogType)}" />`,
    `    <meta property="og:site_name" content="${escapeAttribute(meta.ogSiteName)}" />`,
    `    <meta property="og:locale" content="${escapeAttribute(toOgLocale(meta.locale))}" />`,
    `    <meta name="twitter:card" content="${meta.ogImage ? 'summary_large_image' : 'summary'}" />`,
    `    <meta name="twitter:title" content="${escapeAttribute(meta.ogTitle)}" />`,
    `    <meta name="twitter:description" content="${escapeAttribute(meta.ogDescription)}" />`,
  ]

  if (meta.canonicalUrl) {
    tags.push(`    <link rel="canonical" href="${escapeAttribute(meta.canonicalUrl)}" />`)
    tags.push(`    <meta property="og:url" content="${escapeAttribute(meta.canonicalUrl)}" />`)
  }
  if (meta.ogImage) {
    tags.push(`    <meta property="og:image" content="${escapeAttribute(meta.ogImage)}" />`)
    tags.push(`    <meta name="twitter:image" content="${escapeAttribute(meta.ogImage)}" />`)
  }
  if (meta.keywords && meta.keywords.length > 0) {
    tags.push(`    <meta name="keywords" content="${escapeAttribute(meta.keywords.join(', '))}" />`)
  }
  tags.push(`    <meta name="generator" content="Vue + Vite" />`)

  return tags.join('\n')
}

/** Plain-text description of a portfolio for meta previews and tests. */
export function portfolioSummaryText(portfolio: Portfolio): string {
  return truncate(plainText(portfolio.summary.introduction), DESCRIPTION_LIMIT)
}
