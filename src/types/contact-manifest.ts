/** Entry in `src/generated/contact-manifest.ts`. */
export interface ContactManifestEntry {
    /** Canonical contact code, e.g. `C-00001`. */
    code: string
    /** Public URL of the JSON document, e.g. `/userData/contacts/C-00001.json`. */
    path: string
}

export type ContactManifest = readonly ContactManifestEntry[]
