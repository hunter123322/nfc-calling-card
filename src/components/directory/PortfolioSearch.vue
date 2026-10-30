<script setup lang="ts">
import { ChevronDown, Search, X } from 'lucide-vue-next'
import type { ProfileType } from '@/types/portfolio'
import { ALL, type ProfileFilter } from '@/composables/usePortfolios'
import { humanize } from '@/utils/portfolio-formatter'

const query = defineModel<string>('query', { required: true })
const profileType = defineModel<ProfileFilter>('profileType', { required: true })
const occupation = defineModel<string>('occupation', { required: true })

defineProps<{
  profileTypes: ProfileType[]
  occupations: string[]
}>()
</script>

<template>
  <div class="space-y-4">
    <div class="relative max-w-xl">
      <Search
        class="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-tertiary"
        aria-hidden="true"
      />
      <input
        v-model="query"
        type="search"
        class="field pr-11 pl-11"
        placeholder="Search by name or occupation"
        aria-label="Search portfolios"
        autocomplete="off"
        spellcheck="false"
      />
      <button
        v-if="query"
        type="button"
        class="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-ink-tertiary transition-colors hover:bg-chip hover:text-ink"
        aria-label="Clear search"
        @click="query = ''"
      >
        <X class="size-4" aria-hidden="true" />
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="chip min-h-9 cursor-pointer border transition-colors"
        :class="
          profileType === ALL
            ? 'border-transparent bg-ink text-canvas'
            : 'border-hairline hover:border-hairline-strong'
        "
        :aria-pressed="profileType === ALL"
        @click="profileType = ALL"
      >
        All types
      </button>
      <button
        v-for="type in profileTypes"
        :key="type"
        type="button"
        class="chip min-h-9 cursor-pointer border transition-colors"
        :class="
          profileType === type
            ? 'border-transparent bg-ink text-canvas'
            : 'border-hairline hover:border-hairline-strong'
        "
        :aria-pressed="profileType === type"
        @click="profileType = type"
      >
        {{ humanize(type) }}
      </button>

      <div v-if="occupations.length > 1" class="relative sm:ml-auto">
        <label class="sr-only" for="occupation-filter">Filter by occupation</label>
        <select
          id="occupation-filter"
          v-model="occupation"
          class="field w-full cursor-pointer appearance-none py-2 pr-9 pl-4 text-sm sm:w-auto"
        >
          <option :value="ALL">All occupations</option>
          <option v-for="item in occupations" :key="item" :value="item">{{ item }}</option>
        </select>
        <ChevronDown
          class="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-tertiary"
          aria-hidden="true"
        />
      </div>
    </div>
  </div>
</template>
