<script setup lang="ts">
import type { PortfolioCardSummary } from '@/types/portfolio-manifest'
import PortfolioCard from './PortfolioCard.vue'

defineProps<{ items: PortfolioCardSummary[] }>()
</script>

<template>
  <ul class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <li v-for="item in items" :key="item.slug" class="min-w-0">
      <PortfolioCard :portfolio="item" />
    </li>
  </ul>
</template>
