/**
 * Contact-card schema. One JSON file per contact.
 *
 * Files live in `public/userData/contacts/` and are named with a contact code,
 * for example `C-00001.json`. The first code is `C-00001`.
 */

export const CONTACT_SOCIAL_PLATFORMS = [
    'facebook',
    'instagram',
    'x',
    'threads',
    'linkedin',
    'youtube',
    'tiktok',
] as const

export type ContactSocialPlatform = (typeof CONTACT_SOCIAL_PLATFORMS)[number]

export type ContactSocialLinks = Partial<Record<ContactSocialPlatform, string>>

export const CONTACT_SOCIAL_LABELS: Record<ContactSocialPlatform, string> = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    x: 'X',
    threads: 'Threads',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    tiktok: 'TikTok',
}

export interface ContactProfile {
    /** Canonical contact code derived from the file name, e.g. `C-00001`. */
    code: string
    fullName: string
    age: number
    address: string
    email: string
    mobile: string
    occupation: string
    profileImageUrl: string
    social: ContactSocialLinks
}
