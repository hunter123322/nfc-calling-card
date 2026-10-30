/**
 * Raw source loader for portfolio Markdown and contact JSON.
 *
 * - Browser: fetches the static file from `public/`.
 * - Server (prerender): reads from an in-memory map injected by the build.
 *
 * Raw text and in-flight requests are cached so navigating back to a portfolio
 * or contact never downloads the same file twice.
 */

export class PortfolioSourceError extends Error {
  constructor(
    message: string,
    readonly publicPath: string,
    readonly status?: number,
  ) {
    super(message)
    this.name = 'PortfolioSourceError'
  }
}

interface ServerMarkdownScope {
  __PORTFOLIO_MARKDOWN__?: Record<string, string>
}

const rawCache = new Map<string, string>()
const pendingRequests = new Map<string, Promise<string>>()

function getServerFiles(): Record<string, string> | undefined {
  return (globalThis as ServerMarkdownScope).__PORTFOLIO_MARKDOWN__
}

export function fetchPortfolioMarkdown(publicPath: string): Promise<string> {
  const serverFiles = getServerFiles()
  const serverContent = serverFiles?.[publicPath]
  if (typeof serverContent === 'string') return Promise.resolve(serverContent)

  const cached = rawCache.get(publicPath)
  if (cached !== undefined) return Promise.resolve(cached)

  const pending = pendingRequests.get(publicPath)
  if (pending) return pending

  const request = fetch(publicPath, {
    cache: import.meta.env.DEV ? 'no-store' : 'default',
    headers: { Accept: 'text/markdown, application/json, text/plain' },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new PortfolioSourceError(
          `Could not load ${publicPath} (HTTP ${response.status}).`,
          publicPath,
          response.status,
        )
      }
      const text = await response.text()
      rawCache.set(publicPath, text)
      return text
    })
    .catch((error: unknown) => {
      if (error instanceof PortfolioSourceError) throw error
      throw new PortfolioSourceError(
        error instanceof Error ? error.message : `Could not load ${publicPath}.`,
        publicPath,
      )
    })
    .finally(() => {
      pendingRequests.delete(publicPath)
    })

  pendingRequests.set(publicPath, request)
  return request
}
