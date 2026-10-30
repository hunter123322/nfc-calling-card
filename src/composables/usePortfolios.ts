import { computed, ref } from 'vue'
import { portfolioManifest } from '../generated/portfolio-manifest'
import type { PortfolioCardSummary } from '../types/portfolio-manifest'
import type { ProfileType } from '../types/portfolio'

export type ProfileFilter = ProfileType | 'all'

export const ALL = 'all' as const

function uniqueSorted(values: Iterable<string>): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'en'))
}

/**
 * Directory data. Cards come from the build-time manifest, so the home page
 * never downloads a single portfolio document.
 */
export function usePortfolios() {
  const query = ref('')
  const profileType = ref<ProfileFilter>(ALL)
  const occupation = ref<string>(ALL)

  const items = computed<PortfolioCardSummary[]>(() =>
    portfolioManifest
      .filter((entry) => entry.isPublished && entry.visibility === 'public')
      .map((entry) => ({
        slug: entry.slug,
        name: entry.name,
        headline: entry.headline,
        occupations: entry.occupations,
        profileTypes: entry.profileTypes,
        profileImageUrl: entry.profileImageUrl,
        skills: entry.skills,
      })),
  )

  const profileTypes = computed<ProfileType[]>(
    () => uniqueSorted(items.value.flatMap((item) => item.profileTypes)) as ProfileType[],
  )

  const occupations = computed<string[]>(() =>
    uniqueSorted(items.value.flatMap((item) => item.occupations)),
  )

  const normalizedQuery = computed(() => query.value.trim().toLowerCase())

  const results = computed<PortfolioCardSummary[]>(() => {
    const search = normalizedQuery.value
    return items.value.filter((item) => {
      if (profileType.value !== ALL && !item.profileTypes.includes(profileType.value)) {
        return false
      }
      if (occupation.value !== ALL && !item.occupations.includes(occupation.value)) {
        return false
      }
      if (!search) return true
      const haystack = [item.name, item.headline, ...item.occupations].join(' ').toLowerCase()
      return haystack.includes(search)
    })
  })

  const hasPortfolios = computed(() => items.value.length > 0)
  const isFiltering = computed(
    () => normalizedQuery.value !== '' || profileType.value !== ALL || occupation.value !== ALL,
  )

  function reset(): void {
    query.value = ''
    profileType.value = ALL
    occupation.value = ALL
  }

  return {
    query,
    profileType,
    occupation,
    items,
    results,
    profileTypes,
    occupations,
    hasPortfolios,
    isFiltering,
    reset,
  }
}
