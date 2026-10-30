import type { Portfolio } from '../types/portfolio'
import { MarkdownParseError, parseMarkdownFrontmatter } from './markdown'
import { validatePortfolio, type PortfolioIssue } from './portfolio-validator'

export class PortfolioParseError extends Error {
  readonly issues: PortfolioIssue[]

  constructor(message: string, issues: PortfolioIssue[] = []) {
    super(message)
    this.name = 'PortfolioParseError'
    this.issues = issues
  }
}

/**
 * Parses one Markdown document into a validated portfolio.
 * YAML frontmatter is the single source of truth; the Markdown body is kept
 * but never injected as raw HTML.
 */
export async function parsePortfolioDocument(
  raw: string,
  expectedSlug: string,
): Promise<Portfolio> {
  let parsed: { data: unknown; content: string }
  try {
    parsed = await parseMarkdownFrontmatter(raw)
  } catch (error) {
    throw new PortfolioParseError(
      error instanceof MarkdownParseError ? error.message : 'The portfolio could not be read.',
    )
  }

  const result = validatePortfolio(parsed.data, expectedSlug)
  if (!result.valid || !result.portfolio) {
    const firstError = result.issues.find((issue) => issue.severity === 'error')
    throw new PortfolioParseError(
      firstError ? `${firstError.path}: ${firstError.message}` : 'The portfolio is invalid.',
      result.issues,
    )
  }

  return { ...result.portfolio, body: parsed.content.trim() || undefined }
}
