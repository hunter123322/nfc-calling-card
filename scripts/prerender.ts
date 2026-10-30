/**
 * Static pre-rendering for portfolio routes.
 *
 * Runs after the client build and the SSR build. It writes:
 *   dist/index.html
 *   dist/<slug>/index.html   (real content + metadata, not an empty shell)
 */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { portfolioManifest } from '../src/generated/portfolio-manifest.ts'
import { parsePortfolioDocument } from '../src/utils/portfolio-parser.ts'
import { parseContactDocument } from '../src/utils/contact-parser.ts'
import { normalizeContactCode } from '../src/utils/contact-validator.ts'
import { normalizeUsername } from '../src/utils/portfolio-validator.ts'
import {
    buildContactSeo,
    buildDirectorySeo,
    buildPortfolioSeo,
    renderSeoHead,
} from '../src/utils/portfolio-seo.ts'

const ROOT = process.cwd()
const PUBLIC_DIR = path.join(ROOT, 'public')
const USER_DATA_DIR = path.join(PUBLIC_DIR, 'userData')
const CONTACTS_DIR = path.join(USER_DATA_DIR, 'contacts')
const DIST_DIR = path.join(ROOT, 'dist')
const SSR_ENTRY = path.join(ROOT, 'dist-ssr', 'entry-server.js')
const SITE_URL = process.env.PORTFOLIO_SITE_URL?.trim() || undefined

interface ServerMarkdownScope {
    __PORTFOLIO_MARKDOWN__?: Record<string, string>
}

interface RenderModule {
    render: (url: string) => Promise<{ html: string }>
}

async function collectMarkdownFiles(directory: string): Promise<string[]> {
    let entries
    try {
        entries = await readdir(directory, { withFileTypes: true })
    } catch {
        return []
    }
    const files: string[] = []
    for (const entry of entries) {
        if (entry.name.startsWith('.')) continue
        const fullPath = path.join(directory, entry.name)
        if (entry.isDirectory()) {
            files.push(...(await collectMarkdownFiles(fullPath)))
            continue
        }
        if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) files.push(fullPath)
    }
    return files.sort((a, b) => a.localeCompare(b))
}

async function loadMarkdownFiles(): Promise<Record<string, string>> {
    const result: Record<string, string> = {}
    for (const file of await collectMarkdownFiles(USER_DATA_DIR)) {
        const publicPath = `/${path.relative(PUBLIC_DIR, file).split(path.sep).join('/')}`
        result[publicPath] = await readFile(file, 'utf8')
    }
    return result
}

async function collectJsonFiles(directory: string): Promise<string[]> {
    let entries
    try {
        entries = await readdir(directory, { withFileTypes: true })
    } catch {
        return []
    }
    const files: string[] = []
    for (const entry of entries) {
        if (entry.name.startsWith('.')) continue
        const fullPath = path.join(directory, entry.name)
        if (entry.isDirectory()) {
            files.push(...(await collectJsonFiles(fullPath)))
            continue
        }
        if (entry.isFile() && entry.name.toLowerCase().endsWith('.json')) files.push(fullPath)
    }
    return files.sort((a, b) => a.localeCompare(b))
}

async function loadContactFiles(): Promise<Record<string, string>> {
    const result: Record<string, string> = {}
    for (const file of await collectJsonFiles(CONTACTS_DIR)) {
        const publicPath = `/${path.relative(PUBLIC_DIR, file).split(path.sep).join('/')}`
        result[publicPath] = await readFile(file, 'utf8')
    }
    return result
}

function injectDocument(
    template: string,
    appHtml: string,
    headHtml: string,
    lang: string,
    route: string,
): string {
    if (!template.includes('<!--app-head-->') || !template.includes('<div id="app"></div>')) {
        throw new Error('dist/index.html is missing the prerender placeholders.')
    }
    const safeLang = lang.replace(/[^A-Za-z0-9-]/g, '') || 'en'
    return template
        .replace(/<html lang="[^"]*">/, `<html lang="${safeLang}">`)
        .replace(/<title>[\s\S]*?<\/title>\s*/, '')
        .replace(/<meta name="description"[^>]*>\s*/, '')
        .replace('<!--app-head-->', headHtml)
        .replace(
            '<div id="app"></div>',
            `<div id="app" data-prerendered-route="${route}">${appHtml}</div>`,
        )
}

async function writePage(
    route: string,
    html: string,
    headHtml: string,
    template: string,
    lang: string,
): Promise<string> {
    const output = injectDocument(template, html, headHtml, lang, route)
    const target =
        route === '/'
            ? path.join(DIST_DIR, 'index.html')
            : path.join(DIST_DIR, route.replace(/^\//, ''), 'index.html')
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, output, 'utf8')
    return path.relative(ROOT, target)
}

async function main(): Promise<void> {
    const sourceFiles = {
        ...(await loadMarkdownFiles()),
        ...(await loadContactFiles()),
    }
    const scope = globalThis as ServerMarkdownScope
    scope.__PORTFOLIO_MARKDOWN__ = sourceFiles

    // Discover contacts from the files themselves so a new JSON file is
    // prerendered without waiting for the manifest to be regenerated.
    const contactEntries = Object.keys(sourceFiles)
        .filter(
            (publicPath) =>
                publicPath.startsWith('/userData/contacts/') && publicPath.endsWith('.json'),
        )
        .map((publicPath) => ({
            path: publicPath,
            code: normalizeContactCode(path.basename(publicPath, '.json')),
        }))
        .filter((entry) => entry.code !== '')
        .sort((a, b) => a.code.localeCompare(b.code))

    const template = await readFile(path.join(DIST_DIR, 'index.html'), 'utf8')
    const renderModule = (await import(pathToFileURL(SSR_ENTRY).href)) as RenderModule

    const publicEntries = portfolioManifest.filter((entry) => entry.visibility === 'public')
    const rendered: string[] = []

    const home = await renderModule.render('/')
    if (!home.html.includes('id="main"')) {
        throw new Error('The home page rendered without app content.')
    }
    rendered.push(
        await writePage(
            '/',
            home.html,
            renderSeoHead(buildDirectorySeo(publicEntries.length)),
            template,
            'en',
        ),
    )

    for (const entry of portfolioManifest) {
        const markdownPath = entry.path
        const source = sourceFiles[markdownPath]
        const slug = normalizeUsername(entry.slug)
        if (!source) {
            console.warn(`! ${entry.slug}: ${markdownPath} was not found; skipped.`)
            continue
        }

        let portfolio
        try {
            portfolio = await parsePortfolioDocument(source, slug)
        } catch (error) {
            console.warn(
                `! ${entry.slug}: ${error instanceof Error ? error.message : String(error)}; skipped.`,
            )
            continue
        }

        const result = await renderModule.render(`/${slug}`)
        if (!result.html.includes('id="main"')) {
            throw new Error(`${slug}: rendered an empty page.`)
        }
        rendered.push(
            await writePage(
                `/${slug}`,
                result.html,
                renderSeoHead(buildPortfolioSeo(portfolio, SITE_URL)),
                template,
                portfolio.metadata.locale,
            ),
        )
    }

    // Fail loudly if a file is missing rather than shipping a broken route.
    const manifestFiles = portfolioManifest.map((entry) => entry.path)
    for (const publicPath of manifestFiles) {
        if (!sourceFiles[publicPath]) {
            console.warn(`! Manifest entry ${publicPath} has no matching file.`)
        }
    }
    for (const entry of contactEntries) {
        const source = sourceFiles[entry.path]
        if (!source) continue

        let contact
        try {
            contact = await parseContactDocument(source, entry.code)
        } catch (error) {
            console.warn(
                `! ${entry.code}: ${error instanceof Error ? error.message : String(error)}; skipped.`,
            )
            continue
        }

        const route = `/contacts/${entry.code}`
        const result = await renderModule.render(route)
        if (!result.html.includes('id="main"')) {
            throw new Error(`${entry.code}: rendered an empty contact page.`)
        }
        rendered.push(
            await writePage(
                route,
                result.html,
                renderSeoHead(buildContactSeo(contact)),
                template,
                'en',
            ),
        )
    }

    console.log(`\n✔ Prerendered ${rendered.length} page${rendered.length === 1 ? '' : 's'}:`)
    for (const file of rendered) console.log(`  ${file}`)
    if (SITE_URL) console.log(`  Site URL: ${SITE_URL}`)
    console.log('')
}

main().catch((error: unknown) => {
    console.error('\nPrerender failed:')
    console.error(error)
    process.exitCode = 1
})
