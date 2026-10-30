<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, Award } from 'lucide-vue-next'
import type { Portfolio } from '@/types/portfolio'
import PortfolioSection from './PortfolioSection.vue'
import { formatDate } from '@/utils/portfolio-formatter'
import { toExternalHref } from '@/utils/url'

const props = defineProps<{ portfolio: Portfolio }>()

const items = computed(() => props.portfolio.awards ?? [])
const locale = computed(() => props.portfolio.metadata.locale)
</script>

<template>
  <PortfolioSection v-if="items.length > 0" id="awards" title="Recognition" :count="items.length">
    <ul class="space-y-5">
      <li
        v-for="item in items"
        :key="item.id ?? item.title"
        class="flex gap-4 border-b border-hairline pb-5 last:border-transparent last:pb-0"
      >
        <span
          class="grid size-9 shrink-0 place-items-center rounded-xl bg-chip text-ink-secondary"
          aria-hidden="true"
        >
          <Award class="size-4" />
        </span>
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 class="text-sm font-semibold tracking-[-0.01em] text-ink">{{ item.title }}</h3>
            <p class="text-xs text-ink-tertiary">{{ formatDate(item.date, locale) }}</p>
          </div>
          <p v-if="item.issuer" class="mt-1 text-xs text-ink-tertiary">{{ item.issuer.name }}</p>
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
            Read more
            <ArrowUpRight class="size-3" aria-hidden="true" />
          </a>
        </div>
      </li>
    </ul>
  </PortfolioSection>
</template>
