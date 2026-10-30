import { ref } from 'vue'
import { defineStore } from 'pinia'
import { portfolioManifest } from '../generated/portfolio-manifest'
import type { Portfolio } from '../types/portfolio'
import { fetchPortfolioMarkdown, PortfolioSourceError } from '../services/portfolio-source'
import { parsePortfolioDocument, PortfolioParseError } from '../utils/portfolio-parser'
import { isPubliclyRenderable, normalizeUsername } from '../utils/portfolio-validator'

export type PortfolioLoadStatus = 'idle' | 'loading' | 'ready' | 'not-found' | 'error'

const manifestBySlug = new Map(portfolioManifest.map((entry) => [entry.slug, entry]))

export const usePortfolioStore = defineStore('portfolio', () => {
  const current = ref<Portfolio | null>(null)
  const status = ref<PortfolioLoadStatus>('idle')
  const errorMessage = ref<string | null>(null)
  const requestedSlug = ref<string | null>(null)

  const cache = new Map<string, Portfolio>()
  const inflight = new Map<string, Promise<Portfolio | null>>()
  const blocked = new Set<string>()

  function isCurrent(slug: string): boolean {
    return requestedSlug.value === slug
  }

  async function resolvePortfolio(slug: string): Promise<Portfolio | null> {
    const cached = cache.get(slug)
    if (cached) return cached
    if (blocked.has(slug)) return null

    const entry = manifestBySlug.get(slug)
    if (!entry) {
      blocked.add(slug)
      return null
    }

    const pending = inflight.get(slug)
    if (pending) return pending

    const promise = (async () => {
      const raw = await fetchPortfolioMarkdown(entry.path)
      const portfolio = await parsePortfolioDocument(raw, slug)
      if (!isPubliclyRenderable(portfolio)) {
        blocked.add(slug)
        // Private/unpublished data is never cached or exposed.
        return null
      }
      cache.set(slug, portfolio)
      return portfolio
    })()

    inflight.set(slug, promise)
    try {
      return await promise
    } finally {
      inflight.delete(slug)
    }
  }

  /** Loads a portfolio and updates the shared view state. */
  async function load(rawSlug: string): Promise<Portfolio | null> {
    const slug = normalizeUsername(rawSlug)
    requestedSlug.value = slug

    if (!slug) {
      current.value = null
      status.value = 'not-found'
      errorMessage.value = null
      return null
    }

    const cached = cache.get(slug)
    if (cached) {
      current.value = cached
      status.value = 'ready'
      errorMessage.value = null
      return cached
    }

    if (!manifestBySlug.has(slug)) {
      current.value = null
      status.value = 'not-found'
      errorMessage.value = null
      return null
    }

    status.value = 'loading'
    errorMessage.value = null

    try {
      const portfolio = await resolvePortfolio(slug)
      if (!isCurrent(slug)) return portfolio
      if (!portfolio) {
        current.value = null
        status.value = 'not-found'
        return null
      }
      current.value = portfolio
      status.value = 'ready'
      return portfolio
    } catch (error) {
      if (isCurrent(slug)) {
        current.value = null
        status.value = 'error'
        errorMessage.value = describeError(error)
      }
      return null
    }
  }

  /** Warms the cache (e.g. on card hover) without touching the visible state. */
  async function prefetch(rawSlug: string): Promise<void> {
    const slug = normalizeUsername(rawSlug)
    if (!slug) return
    try {
      await resolvePortfolio(slug)
    } catch {
      // Prefetch failures are silent; navigation will surface them.
    }
  }

  function retry(): Promise<Portfolio | null> {
    return requestedSlug.value ? load(requestedSlug.value) : Promise.resolve(null)
  }

  function reset(): void {
    current.value = null
    status.value = 'idle'
    errorMessage.value = null
    requestedSlug.value = null
  }

  return { current, status, errorMessage, requestedSlug, load, prefetch, retry, reset }
})

function describeError(error: unknown): string {
  if (error instanceof PortfolioParseError) {
    return `This portfolio could not be loaded. ${error.message}`
  }
  if (error instanceof PortfolioSourceError) {
    return `This portfolio could not be downloaded. ${error.message}`
  }
  if (error instanceof Error && error.message) {
    return `This portfolio could not be loaded. ${error.message}`
  }
  return 'This portfolio could not be loaded.'
}
