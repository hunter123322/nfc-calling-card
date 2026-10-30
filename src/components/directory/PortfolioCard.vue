<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowUpRight } from 'lucide-vue-next'
import type { PortfolioCardSummary } from '@/types/portfolio-manifest'
import { FALLBACK_PROFILE_IMAGE, secondaryOccupations } from '@/utils/portfolio-formatter'
import { usePortfolioStore } from '@/stores/portfolio'

const props = defineProps<{ portfolio: PortfolioCardSummary }>()
const store = usePortfolioStore()

const imageSrc = computed(() => props.portfolio.profileImageUrl ?? FALLBACK_PROFILE_IMAGE)
const occupationLine = computed(() =>
  secondaryOccupations(props.portfolio.occupations, props.portfolio.headline).join(' · '),
)

let prefetchTimer: ReturnType<typeof setTimeout> | undefined

function onImageError(event: Event): void {
  const image = event.target as HTMLImageElement
  if (image.getAttribute('src') === FALLBACK_PROFILE_IMAGE) return
  image.src = FALLBACK_PROFILE_IMAGE
}

function prefetch(): void {
  void store.prefetch(props.portfolio.slug)
}

/** Wait for intent so sweeping the pointer across a grid does not fetch everything. */
function schedulePrefetch(): void {
  if (typeof window === 'undefined') return
  if (prefetchTimer) window.clearTimeout(prefetchTimer)
  prefetchTimer = window.setTimeout(() => {
    prefetchTimer = undefined
    prefetch()
  }, 140)
}

function cancelPrefetch(): void {
  if (!prefetchTimer) return
  clearTimeout(prefetchTimer)
  prefetchTimer = undefined
}

onBeforeUnmount(cancelPrefetch)
</script>

<template>
  <RouterLink
    :to="`/${portfolio.slug}`"
    class="surface-card lift pressable group flex h-full flex-col gap-4 p-5 sm:p-6"
    @mouseenter="schedulePrefetch"
    @mouseleave="cancelPrefetch"
    @focusin="prefetch"
  >
    <div class="flex items-start gap-4">
      <img
        :src="imageSrc"
        :alt="`Portrait of ${portfolio.name}`"
        width="56"
        height="56"
        loading="lazy"
        decoding="async"
        class="size-14 shrink-0 rounded-2xl bg-canvas-tint object-cover ring-1 ring-hairline"
        @error="onImageError"
      />
      <div class="min-w-0 flex-1">
        <p class="truncate text-[0.95rem] font-semibold tracking-[-0.015em] text-ink">
          {{ portfolio.name }}
        </p>
        <p class="mt-1 line-clamp-2 text-sm leading-snug text-ink-secondary">
          {{ portfolio.headline }}
        </p>
      </div>
      <ArrowUpRight
        class="mt-1 size-4 shrink-0 text-ink-tertiary transition-transform duration-200 ease-spring group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </div>

    <p v-if="occupationLine" class="text-xs text-ink-tertiary">
      {{ occupationLine }}
    </p>

    <div v-if="portfolio.skills.length > 0" class="mt-auto flex flex-wrap gap-1.5">
      <span v-for="skill in portfolio.skills" :key="skill" class="chip">{{ skill }}</span>
    </div>
  </RouterLink>
</template>
