<script setup lang="ts">
import { computed, onMounted } from 'vue'
import PortfolioSearch from '@/components/directory/PortfolioSearch.vue'
import PortfolioList from '@/components/directory/PortfolioList.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import { usePortfolios } from '@/composables/usePortfolios'
import { buildDirectorySeo } from '@/utils/portfolio-seo'
import { applySeoMetadata } from '@/utils/seo-dom'

const {
  query,
  profileType,
  occupation,
  items,
  results,
  profileTypes,
  occupations,
  hasPortfolios,
  isFiltering,
  reset,
} = usePortfolios()

const count = computed(() => items.value.length)
const resultLabel = computed(() => {
  if (!isFiltering.value) {
    return `${count.value} ${count.value === 1 ? 'portfolio' : 'portfolios'}`
  }
  return `${results.value.length} of ${count.value} ${count.value === 1 ? 'portfolio' : 'portfolios'}`
})

onMounted(() => applySeoMetadata(buildDirectorySeo(count.value)))
</script>

<template>
  <main id="main" class="mx-auto w-full max-w-6xl px-5 pt-14 pb-24 sm:px-8 sm:pt-20">
    <section class="max-w-3xl">
      <p class="eyebrow">Portfolio directory</p>
      <h1 class="display-hero mt-3">Work from people who care about the details.</h1>
      <p class="mt-5 max-w-xl text-base leading-relaxed text-ink-secondary sm:text-lg">
        {{ count }} published {{ count === 1 ? 'portfolio' : 'portfolios' }}, each one a single
        Markdown file rendered as a focused page.
      </p>
    </section>

    <section class="mt-10 sm:mt-12" aria-label="Find a portfolio">
      <PortfolioSearch
        v-model:query="query"
        v-model:profileType="profileType"
        v-model:occupation="occupation"
        :profile-types="profileTypes"
        :occupations="occupations"
      />
    </section>

    <div class="mt-10 flex items-center justify-between gap-4">
      <p class="text-sm text-ink-tertiary" aria-live="polite">{{ resultLabel }}</p>
      <button
        v-if="isFiltering"
        type="button"
        class="text-xs font-medium text-accent-ink hover:underline"
        @click="reset"
      >
        Clear filters
      </button>
    </div>

    <PortfolioList v-if="results.length > 0" :items="results" class="mt-4" />

    <EmptyState
      v-else
      class="mt-4"
      :title="hasPortfolios ? 'No matching portfolios' : 'No portfolios yet'"
      :description="
        hasPortfolios
          ? 'Try a different name, occupation, or filter.'
          : 'Add a Markdown file to public/userData/ and regenerate the manifest.'
      "
    >
      <template v-if="isFiltering" #actions>
        <button type="button" class="btn btn-secondary" @click="reset">Clear filters</button>
      </template>
    </EmptyState>
  </main>
</template>
