<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowLeft, SearchX } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: 'Portfolio not found',
    description: 'This page does not exist, or the portfolio behind it is unpublished or private.',
  },
)
</script>

<template>
  <div class="mx-auto flex max-w-xl flex-col items-center py-20 text-center sm:py-28">
    <div class="grid size-12 place-items-center rounded-2xl bg-chip text-ink-secondary">
      <SearchX class="size-5" aria-hidden="true" />
    </div>
    <p class="eyebrow mt-6">404</p>
    <h1 class="display-title mt-2">{{ title }}</h1>
    <p class="mt-4 max-w-md text-base leading-relaxed text-ink-secondary">{{ description }}</p>
    <RouterLink to="/" class="btn btn-primary mt-8">
      <ArrowLeft class="size-4" aria-hidden="true" />
      Browse portfolios
    </RouterLink>
  </div>
</template>
