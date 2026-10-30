import { toOgLocale, type SeoMetadata } from './portfolio-seo'

function upsertMeta(
  attribute: 'name' | 'property',
  key: string,
  content: string | undefined,
): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!content) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

/**
 * Applies SEO metadata to the live document for client-side navigation.
 * Server rendering builds its `<head>` with the pure helpers in
 * `portfolio-seo.ts` instead.
 */
export function applySeoMetadata(meta: SeoMetadata): void {
  if (typeof document === 'undefined') return

  document.title = meta.title
  document.documentElement.lang = meta.locale

  upsertMeta('name', 'description', meta.description)
  upsertMeta('name', 'robots', meta.robots)
  upsertMeta('name', 'keywords', meta.keywords?.length ? meta.keywords.join(', ') : undefined)
  upsertMeta('property', 'og:title', meta.ogTitle)
  upsertMeta('property', 'og:description', meta.ogDescription)
  upsertMeta('property', 'og:type', meta.ogType)
  upsertMeta('property', 'og:site_name', meta.ogSiteName)
  upsertMeta('property', 'og:locale', toOgLocale(meta.locale))
  upsertMeta('property', 'og:url', meta.canonicalUrl)
  upsertMeta('property', 'og:image', meta.ogImage)
  upsertMeta('name', 'twitter:card', meta.ogImage ? 'summary_large_image' : 'summary')
  upsertMeta('name', 'twitter:title', meta.ogTitle)
  upsertMeta('name', 'twitter:description', meta.ogDescription)
  upsertMeta('name', 'twitter:image', meta.ogImage)

  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (meta.canonicalUrl) {
    const link = existing ?? document.createElement('link')
    link.rel = 'canonical'
    link.href = meta.canonicalUrl
    if (!existing) document.head.appendChild(link)
  } else {
    existing?.remove()
  }
}
