<script setup lang="ts">
import { computed } from 'vue'
import type { Interest, Portfolio } from '@/types/portfolio'
import PortfolioSection from './PortfolioSection.vue'

const props = defineProps<{ portfolio: Portfolio }>()

const groups = computed(() => {
  const map = new Map<string, Interest[]>()
  for (const interest of props.portfolio.interests ?? []) {
    const key = interest.category?.trim() || 'Interests'
    const bucket = map.get(key) ?? []
    bucket.push(interest)
    map.set(key, bucket)
  }
  return [...map.entries()].map(([label, interests]) => ({ label, interests }))
})

const total = computed(() => props.portfolio.interests?.length ?? 0)
</script>

<template>
  <PortfolioSection v-if="total > 0" id="interests" title="Interests" :count="total">
    <div class="space-y-4">
      <div v-for="group in groups" :key="group.label">
        <p class="text-xs font-medium text-ink-tertiary">{{ group.label }}</p>
        <div class="mt-2 flex flex-wrap gap-2">
          <span
            v-for="interest in group.interests"
            :key="interest.name"
            class="chip"
            :title="interest.description"
          >
            {{ interest.name }}
          </span>
        </div>
      </div>
    </div>
  </PortfolioSection>
</template>
