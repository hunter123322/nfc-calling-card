/**
 * Build-time portfolio manifest generator.
 *
 * Discovers every Markdown file under `public/userData/`, validates its
 * frontmatter, and writes a typed manifest to `src/generated/portfolio-manifest.ts`.
 *
 * Run with `bun run generate:manifest`. The output file must never be edited
 * by hand.
 */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { normalizeUsername, validatePortfolio } from '../src/utils/portfolio-validator.ts'
import { normalizeContactCode, validateContact } from '../src/utils/contact-validator.ts'
import { collectSkillNames } from '../src/utils/portfolio-formatter.ts'
import type { PortfolioManifestEntry } from '../src/types/portfolio-manifest.ts'
import type { ContactManifestEntry } from '../src/types/contact-manifest.ts'

const ROOT = process.cwd()
const PUBLIC_DIR = path.join(ROOT, 'public')
const USER_DATA_DIR = path.join(PUBLIC_DIR, 'userData')
const CONTACTS_DIR = path.join(USER_DATA_DIR, 'contacts')
const OUTPUT_FILE = path.join(ROOT, 'src', 'generated', 'portfolio-manifest.ts')
const CONTACT_OUTPUT_FILE = path.join(ROOT, 'src', 'generated', 'contact-manifest.ts')
const SKILL_LIMIT = 6

/** Slugs that would collide with static assets or the build output. */
const RESERVED_SLUGS = new Set(['assets', 'userdata', 'index', 'contacts'])

interface SkippedFile {
    file: string
    reason: string
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
    return files
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
    return files
}

function toPublicPath(filePath: string): string {
    return `/${path.relative(PUBLIC_DIR, filePath).split(path.sep).join('/')}`
}

async function buildManifest(): Promise<{
    entries: PortfolioManifestEntry[]
    skipped: SkippedFile[]
    excluded: string[]
}> {
    const files = (await collectMarkdownFiles(USER_DATA_DIR))
        .filter((file) => !file.startsWith(`${CONTACTS_DIR}${path.sep}`))
        .sort((a, b) => a.localeCompare(b))
    const entries: PortfolioManifestEntry[] = []
    const skipped: SkippedFile[] = []
    const excluded: string[] = []
    const seenSlugs = new Map<string, string>()

    for (const file of files) {
        const relativePath = path.relative(USER_DATA_DIR, file).split(path.sep).join('/')
        const slug = normalizeUsername(path.basename(file, path.extname(file)))

        if (!slug) {
            skipped.push({ file: relativePath, reason: 'File name does not produce a valid slug.' })
            continue
        }
        if (RESERVED_SLUGS.has(slug)) {
            skipped.push({ file: relativePath, reason: `"${slug}" is reserved for static assets.` })
            continue
        }
        if (seenSlugs.has(slug)) {
            skipped.push({
                file: relativePath,
                reason: `Duplicate slug "${slug}" (already defined by ${seenSlugs.get(slug)}).`,
            })
            continue
        }

        let source: string
        try {
            source = await readFile(file, 'utf8')
        } catch (error) {
            skipped.push({
                file: relativePath,
                reason: `Could not read file: ${error instanceof Error ? error.message : String(error)}`,
            })
            continue
        }

        let frontmatter: unknown
        try {
            frontmatter = matter(source).data
        } catch (error) {
            skipped.push({
                file: relativePath,
                reason: `Invalid YAML: ${error instanceof Error ? error.message : String(error)}`,
            })
            continue
        }

        const result = validatePortfolio(frontmatter, slug)
        if (!result.valid || !result.portfolio) {
            const firstError = result.issues.find((issue) => issue.severity === 'error')
            skipped.push({
                file: relativePath,
                reason: firstError ? `${firstError.path}: ${firstError.message}` : 'Invalid portfolio.',
            })
            continue
        }

        const portfolio = result.portfolio
        for (const issue of result.issues) {
            console.warn(`  ! ${relativePath} ${issue.path}: ${issue.message}`)
        }

        if (!portfolio.metadata.isPublished || portfolio.metadata.visibility === 'private') {
            excluded.push(relativePath)
            continue
        }

        seenSlugs.set(slug, relativePath)
        const name =
            portfolio.preferredName ?? [portfolio.firstName, portfolio.lastName].filter(Boolean).join(' ')

        entries.push({
            slug,
            path: toPublicPath(file),
            name,
            headline: portfolio.summary.headline,
            occupations: portfolio.occupation,
            profileTypes: portfolio.profileTypes ?? [],
            profileImageUrl: portfolio.profileImageUrl ?? null,
            skills: collectSkillNames(portfolio.skills, SKILL_LIMIT),
            locale: portfolio.metadata.locale,
            visibility: portfolio.metadata.visibility,
            isPublished: portfolio.metadata.isPublished,
            lastUpdated: portfolio.metadata.lastUpdated || null,
        })
    }

    entries.sort((a, b) => a.slug.localeCompare(b.slug, 'en'))
    return { entries, skipped, excluded }
}

function renderManifest(entries: PortfolioManifestEntry[]): string {
    return `// This file is generated by scripts/generate-portfolio-manifest.ts.
// Do not edit it by hand. Add Markdown files to public/userData/ and run
// \`bun run generate:manifest\` (or \`bun run dev\` / \`bun run build\`).

import type { PortfolioManifest } from '../types/portfolio-manifest'

export const portfolioManifest: PortfolioManifest = ${JSON.stringify(entries, null, 2)}
`
}

async function buildContactsManifest(): Promise<{
    entries: ContactManifestEntry[]
    skipped: SkippedFile[]
}> {
    const files = (await collectJsonFiles(CONTACTS_DIR)).sort((a, b) => a.localeCompare(b))
    const entries: ContactManifestEntry[] = []
    const skipped: SkippedFile[] = []
    const seenCodes = new Map<string, string>()

    for (const file of files) {
        const relativePath = path.relative(CONTACTS_DIR, file).split(path.sep).join('/')
        const code = normalizeContactCode(path.basename(file, path.extname(file)))

        // Files that are not named with a contact code are intentionally ignored.
        if (!code) continue
        if (seenCodes.has(code)) {
            skipped.push({
                file: relativePath,
                reason: `Duplicate contact code "${code}" (already defined by ${seenCodes.get(code)}).`,
            })
            continue
        }

        let source: string
        try {
            source = await readFile(file, 'utf8')
        } catch (error) {
            skipped.push({
                file: relativePath,
                reason: `Could not read file: ${error instanceof Error ? error.message : String(error)}`,
            })
            continue
        }

        let data: unknown
        try {
            data = JSON.parse(source) as unknown
        } catch (error) {
            skipped.push({
                file: relativePath,
                reason: `Invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
            })
            continue
        }

        const result = validateContact(data, code)
        if (!result.valid || !result.profile) {
            const firstError = result.issues.find((issue) => issue.severity === 'error')
            skipped.push({
                file: relativePath,
                reason: firstError ? `${firstError.path}: ${firstError.message}` : 'Invalid contact.',
            })
            continue
        }

        for (const issue of result.issues) {
            console.warn(`  ! contacts/${relativePath} ${issue.path}: ${issue.message}`)
        }

        seenCodes.set(code, relativePath)
        entries.push({ code, path: toPublicPath(file) })
    }

    entries.sort((a, b) => a.code.localeCompare(b.code, 'en'))
    return { entries, skipped }
}

function renderContactManifest(entries: ContactManifestEntry[]): string {
    return `// This file is generated by scripts/generate-portfolio-manifest.ts.
// Do not edit it by hand. Add code-named JSON files to public/userData/contacts/
// (for example C-00001.json) and run \`bun run generate:manifest\`.

import type { ContactManifest } from '../types/contact-manifest'

export const contactManifest: ContactManifest = ${JSON.stringify(entries, null, 2)}
`
}

async function main(): Promise<void> {
    const userDataExists = await readdir(USER_DATA_DIR).then(
        () => true,
        () => false,
    )
    if (!userDataExists) {
        console.warn(`! ${USER_DATA_DIR} does not exist. Writing an empty manifest.`)
    }

    const { entries, skipped, excluded } = await buildManifest()
    const contacts = await buildContactsManifest()

    await mkdir(path.dirname(OUTPUT_FILE), { recursive: true })
    await writeFile(OUTPUT_FILE, renderManifest(entries), 'utf8')
    await mkdir(path.dirname(CONTACT_OUTPUT_FILE), { recursive: true })
    await writeFile(CONTACT_OUTPUT_FILE, renderContactManifest(contacts.entries), 'utf8')

    const relativeOutput = path.relative(ROOT, OUTPUT_FILE)
    const relativeContactOutput = path.relative(ROOT, CONTACT_OUTPUT_FILE)
    console.log(`\n✔ Generated ${relativeOutput}`)
    console.log(`  ${entries.length} portfolio${entries.length === 1 ? '' : 's'} in the manifest`)
    if (entries.length > 0) {
        console.log(`  ${entries.map((entry) => entry.slug).join(', ')}`)
    }
    if (excluded.length > 0) {
        console.log(`  Excluded (unpublished or private): ${excluded.join(', ')}`)
    }
    if (skipped.length > 0) {
        console.warn(`\n  ${skipped.length} portfolio file${skipped.length === 1 ? '' : 's'} skipped:`)
        for (const item of skipped) console.warn(`  - ${item.file}: ${item.reason}`)
    }

    console.log(`\n✔ Generated ${relativeContactOutput}`)
    console.log(
        `  ${contacts.entries.length} contact${contacts.entries.length === 1 ? '' : 's'} in the manifest`,
    )
    if (contacts.entries.length > 0) {
        console.log(`  ${contacts.entries.map((entry) => entry.code).join(', ')}`)
    }
    if (contacts.skipped.length > 0) {
        console.warn(
            `\n  ${contacts.skipped.length} contact file${contacts.skipped.length === 1 ? '' : 's'} skipped:`,
        )
        for (const item of contacts.skipped) console.warn(`  - contacts/${item.file}: ${item.reason}`)
    }
    console.log('')
}

main().catch((error: unknown) => {
    console.error('\nManifest generation failed:')
    console.error(error)
    process.exitCode = 1
})
