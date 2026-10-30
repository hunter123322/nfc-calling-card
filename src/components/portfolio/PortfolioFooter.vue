<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import type { Portfolio } from '@/types/portfolio'
import { formatDate, getDisplayName, secondaryOccupations } from '@/utils/portfolio-formatter'

const props = defineProps<{ portfolio: Portfolio }>()

const name = computed(() => getDisplayName(props.portfolio))
const occupationLine = computed(() =>
  secondaryOccupations(props.portfolio.occupation, props.portfolio.summary.headline).join(' · '),
)
const updated = computed(() =>
  formatDate(props.portfolio.metadata.lastUpdated, props.portfolio.metadata.locale),
)
</script>

<template>
  <footer class="mt-14 border-t border-hairline pt-6">
    <div
      class="flex flex-col gap-3 text-xs text-ink-tertiary sm:flex-row sm:items-center sm:justify-between"
    >
      <p>
        {{ name }}<template v-if="occupationLine"> · {{ occupationLine }}</template>
      </p>
      <p>
        <template v-if="updated">Updated {{ updated }} · </template>{{ portfolio.metadata.locale }}
      </p>
    </div>
    <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
      <RouterLink
        to="/"
        class="inline-flex items-center gap-1.5 text-xs font-medium text-ink-secondary transition-colors hover:text-ink"
      >
        <ArrowLeft class="size-3.5" aria-hidden="true" />
        All portfolios
      </RouterLink>
      <p class="text-xs text-ink-tertiary">One Markdown file. No database.</p>
    </div>
  </footer>
</template>
