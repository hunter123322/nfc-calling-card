<script setup lang="ts">
import type { PortfolioSectionId } from '@/types/portfolio'

withDefaults(
  defineProps<{
    id: PortfolioSectionId | 'contact'
    title: string
    eyebrow?: string
    count?: number
  }>(),
  {
    eyebrow: undefined,
    count: undefined,
  },
)
</script>

<template>
  <section
    :id="id"
    :aria-labelledby="`${id}-title`"
    class="scroll-mt-28 border-t border-hairline pt-9 sm:pt-11"
  >
    <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
      <div>
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 :id="`${id}-title`" class="display-section" :class="eyebrow ? 'mt-1.5' : undefined">
          {{ title }}
        </h2>
      </div>
      <span v-if="count !== undefined" class="text-xs tabular-nums text-ink-tertiary">
        {{ count }}
      </span>
    </div>
    <div class="mt-6">
      <slot />
    </div>
  </section>
</template>
