<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, Check } from 'lucide-vue-next'
import type { Portfolio, WorkExperience } from '@/types/portfolio'
import PortfolioSection from './PortfolioSection.vue'
import { formatAddress, formatDateRange, humanize, joinNonEmpty } from '@/utils/portfolio-formatter'
import { toExternalHref } from '@/utils/url'

const props = defineProps<{ portfolio: Portfolio }>()

const items = computed(() => props.portfolio.workExperience ?? [])
const locale = computed(() => props.portfolio.metadata.locale)

function detail(item: WorkExperience): string {
  return joinNonEmpty([
    item.employmentType ? humanize(item.employmentType) : undefined,
    formatAddress(item.location) || undefined,
  ])
}

function organizationUrl(item: WorkExperience): string | undefined {
  return toExternalHref(item.organization.url)
}
</script>

<template>
  <PortfolioSection
    v-if="items.length > 0"
    id="experience"
    title="Experience"
    :count="items.length"
  >
    <ol>
      <li
        v-for="(item, index) in items"
        :key="item.id ?? `${item.role}-${index}`"
        class="relative border-l border-hairline pb-8 pl-6 last:border-transparent last:pb-0"
      >
        <span
          class="absolute top-1.5 -left-[5px] size-2.5 rounded-full border-2 border-canvas bg-accent"
          aria-hidden="true"
        />
        <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3 class="text-base font-semibold tracking-[-0.012em] text-ink">
            {{ item.role }}
            <span class="font-normal text-ink-secondary">
              ·
              <a
                v-if="organizationUrl(item)"
                :href="organizationUrl(item)"
                target="_blank"
                rel="noopener noreferrer nofollow"
                class="inline-flex items-center gap-1 underline decoration-hairline-strong underline-offset-4 transition-colors hover:text-ink"
              >
                {{ item.organization.name }}
                <ArrowUpRight class="size-3" aria-hidden="true" />
              </a>
              <template v-else>{{ item.organization.name }}</template>
            </span>
          </h3>
          <p class="text-xs text-ink-tertiary">
            {{ formatDateRange(item.dateRange, locale) }}
          </p>
        </div>

        <p v-if="detail(item)" class="mt-1 text-xs text-ink-tertiary">{{ detail(item) }}</p>
        <p v-if="item.summary" class="mt-2 text-sm leading-relaxed text-ink-secondary">
          {{ item.summary }}
        </p>

        <ul v-if="item.highlights && item.highlights.length > 0" class="mt-3 space-y-1.5">
          <li
            v-for="highlight in item.highlights"
            :key="highlight"
            class="flex gap-2 text-sm leading-relaxed text-ink-secondary"
          >
            <Check class="mt-1 size-3.5 shrink-0 text-accent" aria-hidden="true" />
            <span>{{ highlight }}</span>
          </li>
        </ul>

        <div v-if="item.skills && item.skills.length > 0" class="mt-3 flex flex-wrap gap-1.5">
          <span v-for="skill in item.skills" :key="skill" class="chip">{{ skill }}</span>
        </div>
      </li>
    </ol>
  </PortfolioSection>
</template>
