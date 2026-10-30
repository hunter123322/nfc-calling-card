import type { ProfileType, ProfileVisibility } from './portfolio'

/**
 * One entry of the build-time generated manifest.
 *
 * The card fields are extracted from frontmatter while the manifest is
 * generated, so the directory page never needs to download a full portfolio
 * document just to render a card.
 */
export interface PortfolioManifestEntry {
  slug: string
  /** Public URL of the Markdown document, e.g. `/userData/aldrin.md`. */
  path: string
  name: string
  headline: string
  occupations: string[]
  profileTypes: ProfileType[]
  profileImageUrl: string | null
  skills: string[]
  locale: string
  visibility: ProfileVisibility
  isPublished: boolean
  lastUpdated: string | null
}

export type PortfolioManifest = readonly PortfolioManifestEntry[]

/** Lightweight shape consumed by directory components. */
export interface PortfolioCardSummary {
  slug: string
  name: string
  headline: string
  occupations: string[]
  profileTypes: ProfileType[]
  profileImageUrl: string | null
  skills: string[]
}
