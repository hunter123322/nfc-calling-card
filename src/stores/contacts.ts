import { ref } from 'vue'
import { defineStore } from 'pinia'
import { contactManifest } from '../generated/contact-manifest'
import type { ContactProfile } from '../types/contact'
import { fetchPortfolioMarkdown, PortfolioSourceError } from '../services/portfolio-source'
import { ContactParseError, parseContactDocument } from '../utils/contact-parser'
import { normalizeContactCode } from '../utils/contact-validator'

export type ContactLoadStatus = 'idle' | 'loading' | 'ready' | 'not-found' | 'error'

const manifestByCode = new Map(contactManifest.map((entry) => [entry.code, entry]))

/**
 * Loads a single contact by code and keeps it in memory. There is deliberately
 * no "load all" path: contact cards are addressed directly by
 * `/contacts/<code>`, so the app never downloads the whole contact set.
 */
export const useContactsStore = defineStore('contacts', () => {
    const current = ref<ContactProfile | null>(null)
    const status = ref<ContactLoadStatus>('idle')
    const errorMessage = ref<string | null>(null)
    const requestedCode = ref<string | null>(null)

    const cache = new Map<string, ContactProfile>()
    const inflight = new Map<string, Promise<ContactProfile | null>>()

    function isCurrent(code: string): boolean {
        return requestedCode.value === code
    }

    async function resolveContact(code: string): Promise<ContactProfile | null> {
        const cached = cache.get(code)
        if (cached) return cached

        // Prefer the generated path, but fall back to the documented JSON
        // location so a newly added file works without regenerating the manifest.
        const path = manifestByCode.get(code)?.path ?? `/userData/contacts/${code}.json`

        const pending = inflight.get(code)
        if (pending) return pending

        const promise = (async () => {
            const raw = await fetchPortfolioMarkdown(path)
            const profile = await parseContactDocument(raw, code)
            cache.set(code, profile)
            return profile
        })()

        inflight.set(code, promise)
        try {
            return await promise
        } finally {
            inflight.delete(code)
        }
    }

    /** Loads one contact by code. Codes are compared case-insensitively. */
    async function load(rawCode: string): Promise<ContactProfile | null> {
        const code = normalizeContactCode(rawCode)
        requestedCode.value = code

        if (!code) {
            current.value = null
            status.value = 'not-found'
            errorMessage.value = null
            return null
        }

        const cached = cache.get(code)
        if (cached) {
            current.value = cached
            status.value = 'ready'
            errorMessage.value = null
            return cached
        }

        status.value = 'loading'
        errorMessage.value = null

        try {
            const profile = await resolveContact(code)
            if (!isCurrent(code)) return profile
            if (!profile) {
                current.value = null
                status.value = 'not-found'
                return null
            }
            current.value = profile
            status.value = 'ready'
            return profile
        } catch (error) {
            if (isCurrent(code)) {
                current.value = null
                if (error instanceof PortfolioSourceError && error.status === 404) {
                    status.value = 'not-found'
                    errorMessage.value = null
                } else {
                    status.value = 'error'
                    errorMessage.value = describeError(error)
                }
            }
            return null
        }
    }

    function retry(): Promise<ContactProfile | null> {
        return requestedCode.value ? load(requestedCode.value) : Promise.resolve(null)
    }

    function reset(): void {
        current.value = null
        status.value = 'idle'
        errorMessage.value = null
        requestedCode.value = null
    }

    return { current, status, errorMessage, requestedCode, load, retry, reset }
})

function describeError(error: unknown): string {
    if (error instanceof ContactParseError) {
        return `This contact could not be loaded. ${error.message}`
    }
    if (error instanceof PortfolioSourceError) {
        return `This contact could not be downloaded. ${error.message}`
    }
    if (error instanceof Error && error.message) {
        return `This contact could not be loaded. ${error.message}`
    }
    return 'This contact could not be loaded.'
}
