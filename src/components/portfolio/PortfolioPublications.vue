<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, BookOpen, Mic } from 'lucide-vue-next'
import type { Portfolio } from '@/types/portfolio'
import PortfolioSection from './PortfolioSection.vue'
import { formatDate, humanize, joinNonEmpty } from '@/utils/portfolio-formatter'
import { toExternalHref } from '@/utils/url'

const props = defineProps<{ portfolio: Portfolio }>()

const publications = computed(() => props.portfolio.publications ?? [])
const talks = computed(() => props.portfolio.speakingEngagements ?? [])
const locale = computed(() => props.portfolio.metadata.locale)

const title = computed(() => {
  if (publications.value.length > 0 && talks.value.length > 0) return 'Publications & talks'
  if (talks.value.length > 0) return 'Talks'
  return 'Publications'
})

const total = computed(() => publications.value.length + talks.value.length)

function doiUrl(doi: string | undefined): string | undefined {
  if (!doi) return undefined
  return toExternalHref(`https://doi.org/${encodeURIComponent(doi)}`)
}
</script>

<template>
  <PortfolioSection v-if="total > 0" id="publications" :title="title" :count="total">
    <div class="space-y-8">
      <div v-if="publications.length > 0">
        <p v-if="talks.length > 0" class="eyebrow">Publications</p>
        <ul class="mt-3 space-y-5">
          <li
            v-for="item in publications"
            :key="item.id ?? item.title"
            class="border-b border-hairline pb-5 last:border-transparent last:pb-0"
          >
            <div class="flex items-start gap-3">
              <BookOpen class="mt-1 size-4 shrink-0 text-ink-tertiary" aria-hidden="true" />
              <div class="min-w-0 flex-1">
                <p class="text-xs text-ink-tertiary">
                  {{
                    joinNonEmpty([humanize(item.type), item.venue, formatDate(item.date, locale)])
                  }}
                </p>
                <h3 class="mt-1 text-sm font-semibold leading-snug tracking-[-0.01em] text-ink">
                  {{ item.title }}
                </h3>
                <p
                  v-if="item.authors && item.authors.length > 0"
                  class="mt-1 text-xs text-ink-tertiary"
                >
                  {{ item.authors.join(', ') }}
                </p>
                <p v-if="item.abstract" class="mt-2 text-sm leading-relaxed text-ink-secondary">
                  {{ item.abstract }}
                </p>
                <div class="mt-2 flex flex-wrap items-center gap-3 text-xs">
                  <a
                    v-if="toExternalHref(item.url)"
                    :href="toExternalHref(item.url)"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    class="inline-flex items-center gap-1 font-medium text-accent-ink hover:underline"
                  >
                    Read the work
                    <ArrowUpRight class="size-3" aria-hidden="true" />
                  </a>
                  <a
                    v-if="doiUrl(item.doi)"
                    :href="doiUrl(item.doi)"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    class="inline-flex items-center gap-1 font-medium text-accent-ink hover:underline"
                  >
                    DOI
                    <ArrowUpRight class="size-3" aria-hidden="true" />
                  </a>
                  <span v-if="item.citations" class="text-ink-tertiary">
                    {{ item.citations }} citation{{ item.citations === 1 ? '' : 's' }}
                  </span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div v-if="talks.length > 0">
        <p v-if="publications.length > 0" class="eyebrow">Talks</p>
        <ul class="mt-3 space-y-5">
          <li
            v-for="item in talks"
            :key="item.id ?? item.title"
            class="border-b border-hairline pb-5 last:border-transparent last:pb-0"
          >
            <div class="flex items-start gap-3">
              <Mic class="mt-1 size-4 shrink-0 text-ink-tertiary" aria-hidden="true" />
              <div class="min-w-0 flex-1">
                <p class="text-xs text-ink-tertiary">
                  {{
                    joinNonEmpty([
                      item.type ? humanize(item.type) : undefined,
                      formatDate(item.date, locale),
                    ])
                  }}
                </p>
                <h3 class="mt-1 text-sm font-semibold leading-snug tracking-[-0.01em] text-ink">
                  {{ item.title }}
                </h3>
                <p class="mt-1 text-xs text-ink-tertiary">{{ item.event }}</p>
                <p v-if="item.description" class="mt-2 text-sm leading-relaxed text-ink-secondary">
                  {{ item.description }}
                </p>
                <a
                  v-if="toExternalHref(item.url)"
                  :href="toExternalHref(item.url)"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  class="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent-ink hover:underline"
                >
                  View details
                  <ArrowUpRight class="size-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </PortfolioSection>
</template>
