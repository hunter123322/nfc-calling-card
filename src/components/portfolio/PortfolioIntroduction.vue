<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
import type { Portfolio } from '@/types/portfolio'
import PortfolioSection from './PortfolioSection.vue'

const props = defineProps<{ portfolio: Portfolio }>()

const lead = computed(() => props.portfolio.introduction || props.portfolio.summary.introduction)
const body = computed(() => {
  const introduction = props.portfolio.introduction?.trim()
  const summary = props.portfolio.summary.introduction?.trim()
  return introduction && summary && introduction !== summary ? summary : undefined
})
const highlights = computed(() => props.portfolio.summary.highlights ?? [])
</script>

<template>
  <PortfolioSection id="about" title="About">
    <div class="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12">
      <div class="space-y-4">
        <p class="text-lg leading-relaxed text-ink sm:text-xl sm:leading-relaxed">{{ lead }}</p>
        <p v-if="body" class="max-w-2xl text-sm leading-relaxed text-ink-secondary">{{ body }}</p>
      </div>

      <ul v-if="highlights.length > 0" class="space-y-3">
        <li
          v-for="highlight in highlights"
          :key="highlight"
          class="flex gap-2.5 text-sm leading-relaxed text-ink-secondary"
        >
          <Check class="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <span>{{ highlight }}</span>
        </li>
      </ul>
    </div>
  </PortfolioSection>
</template>
