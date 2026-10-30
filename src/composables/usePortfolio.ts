import { computed, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { usePortfolioStore, type PortfolioLoadStatus } from '../stores/portfolio'
import { normalizeUsername } from '../utils/portfolio-validator'

/** Loads one portfolio through the shared Pinia cache. */
export function usePortfolio(slug: MaybeRefOrGetter<string>) {
  const store = usePortfolioStore()
  const key = computed(() => normalizeUsername(toValue(slug)))

  const portfolio = computed(() =>
    store.current && store.current.username === key.value ? store.current : null,
  )

  const status = computed<PortfolioLoadStatus>(() => {
    if (store.requestedSlug === key.value) return store.status
    // Keep showing the previous portfolio while a guarded navigation resolves.
    if (portfolio.value) return 'ready'
    return 'idle'
  })

  const isLoading = computed(() => status.value === 'idle' || status.value === 'loading')
  const notFound = computed(() => status.value === 'not-found')
  const hasError = computed(() => status.value === 'error')
  const errorMessage = computed(() => store.errorMessage)

  watch(
    key,
    (value) => {
      if (value) void store.load(value)
    },
    { immediate: true },
  )

  function retry(): void {
    void store.retry()
  }

  return { portfolio, status, isLoading, notFound, hasError, errorMessage, retry }
}
