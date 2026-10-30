<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, Quote } from 'lucide-vue-next'
import type { Portfolio, Testimonial } from '@/types/portfolio'
import PortfolioSection from './PortfolioSection.vue'
import { formatDate, getInitials, joinNonEmpty } from '@/utils/portfolio-formatter'
import { toExternalHref, toMediaSrc } from '@/utils/url'

const props = defineProps<{ portfolio: Portfolio }>()

const items = computed(() => props.portfolio.testimonials ?? [])
const locale = computed(() => props.portfolio.metadata.locale)

function avatarUrl(item: Testimonial): string | undefined {
  return toMediaSrc(item.authorAvatarUrl)
}

function hideAvatar(event: Event): void {
  const image = event.target as HTMLImageElement
  image.style.display = 'none'
}
</script>

<template>
  <PortfolioSection
    v-if="items.length > 0"
    id="testimonials"
    title="Testimonials"
    :count="items.length"
  >
    <div class="grid gap-4 sm:grid-cols-2">
      <figure
        v-for="item in items"
        :key="item.id ?? item.authorName"
        class="surface-card flex flex-col p-5 sm:p-6"
      >
        <Quote class="size-5 text-ink-tertiary" aria-hidden="true" />
        <blockquote class="mt-3 flex-1 text-sm leading-relaxed text-ink">
          {{ item.quote }}
        </blockquote>
        <figcaption class="mt-5 flex items-center gap-3">
          <span
            class="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-chip text-xs font-semibold text-ink-secondary"
            aria-hidden="true"
          >
            {{ getInitials(item.authorName) }}
            <img
              v-if="avatarUrl(item)"
              :src="avatarUrl(item)"
              alt=""
              loading="lazy"
              decoding="async"
              class="absolute inset-0 size-full object-cover"
              @error="hideAvatar"
            />
          </span>
          <div class="min-w-0">
            <p class="truncate text-sm font-medium text-ink">{{ item.authorName }}</p>
            <p class="truncate text-xs text-ink-tertiary">
              {{ joinNonEmpty([item.authorRole, item.authorOrganization]) }}
              <template v-if="item.date"> · {{ formatDate(item.date, locale) }}</template>
            </p>
          </div>
          <a
            v-if="toExternalHref(item.sourceUrl)"
            :href="toExternalHref(item.sourceUrl)"
            target="_blank"
            rel="noopener noreferrer nofollow"
            class="ml-auto text-ink-tertiary transition-colors hover:text-ink"
            aria-label="View the original testimonial"
          >
            <ArrowUpRight class="size-4" aria-hidden="true" />
          </a>
        </figcaption>
      </figure>
    </div>
  </PortfolioSection>
</template>
