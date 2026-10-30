/**
 * Browser-safe Markdown frontmatter loader.
 *
 * gray-matter is loaded lazily so pages that only need the directory manifest
 * do not download the YAML parser. The Browserify Buffer polyfill is imported
 * into the same lazy chunk because gray-matter expects a global Buffer.
 */

export class MarkdownParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MarkdownParseError'
  }
}

interface MatterDocument {
  data: unknown
  content: string
}

interface ParsedMarkdown {
  data: unknown
  content: string
}

type MatterFn = (input: string) => MatterDocument

let matterLoader: Promise<MatterFn> | null = null

async function loadMatter(): Promise<MatterFn> {
  if (!matterLoader) {
    matterLoader = (async () => {
      const bufferModule = (await import('buffer')) as { Buffer?: unknown }
      const globalScope = globalThis as { Buffer?: unknown }
      if (!globalScope.Buffer && bufferModule.Buffer) globalScope.Buffer = bufferModule.Buffer

      const imported = (await import('gray-matter')) as unknown as { default?: MatterFn } & MatterFn
      return imported.default ?? imported
    })()
  }
  return matterLoader
}

export async function parseMarkdownFrontmatter(raw: string): Promise<ParsedMarkdown> {
  let matter: MatterFn
  try {
    matter = await loadMatter()
  } catch {
    throw new MarkdownParseError('The Markdown parser could not be loaded.')
  }

  try {
    const parsed = matter(raw)
    return { data: parsed.data, content: parsed.content }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown YAML error'
    throw new MarkdownParseError(`Invalid YAML frontmatter: ${message}`)
  }
}
