<script setup lang="ts">
import { computed } from 'vue'
import type { Portfolio } from '@/types/portfolio'
import PortfolioSection from './PortfolioSection.vue'
import PortfolioWorkCard from './PortfolioWorkCard.vue'

const props = defineProps<{ portfolio: Portfolio }>()

const works = computed(() => {
  const items = props.portfolio.portfolioWorks ?? []
  return [...items].sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)))
})

const hasFeatured = computed(() => works.value.some((work) => work.isFeatured))
const title = computed(() => (hasFeatured.value ? 'Selected work' : 'Work'))
</script>

<template>
  <PortfolioSection v-if="works.length > 0" id="works" :title="title" :count="works.length">
    <div class="grid gap-5 sm:grid-cols-2">
      <PortfolioWorkCard
        v-for="work in works"
        :key="work.id"
        :work="work"
        :locale="portfolio.metadata.locale"
      />
    </div>
  </PortfolioSection>
</template>
