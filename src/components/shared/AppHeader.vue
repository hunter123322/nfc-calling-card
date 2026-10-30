<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import ThemeToggle from './ThemeToggle.vue'

const route = useRoute()
const isPortfolio = computed(() => route.name === 'portfolio')
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-hairline bg-surface backdrop-blur-xl backdrop-saturate-150 transition-colors duration-500"
  >
    <div class="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-5 sm:px-8">
      <RouterLink
        to="/"
        class="group inline-flex items-center gap-2.5 rounded-full text-sm font-semibold tracking-tight text-ink"
        aria-label="Portfolios home"
      >
        <span
          class="grid size-7 place-items-center rounded-[0.6rem] bg-ink text-[0.7rem] font-bold text-canvas transition-transform duration-200 ease-spring group-hover:scale-105 motion-reduce:transition-none"
          aria-hidden="true"
        >
          P
        </span>
        <span>Portfolios</span>
      </RouterLink>

      <div class="ml-auto flex items-center gap-2">
        <RouterLink v-if="isPortfolio" to="/" class="btn btn-ghost">
          <ArrowLeft class="size-4" aria-hidden="true" />
          <span class="hidden sm:inline">Directory</span>
          <span class="sr-only sm:hidden">Back to the portfolio directory</span>
        </RouterLink>
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>
