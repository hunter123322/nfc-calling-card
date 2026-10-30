<script setup lang="ts">
import { SearchX } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: 'Nothing here yet',
    description: undefined,
  },
)
</script>

<template>
  <div class="surface-card flex flex-col items-center px-6 py-14 text-center sm:py-16">
    <div class="grid size-11 place-items-center rounded-2xl bg-chip text-ink-secondary">
      <slot name="icon">
        <SearchX class="size-5" aria-hidden="true" />
      </slot>
    </div>
    <h2 class="mt-5 text-lg font-semibold tracking-[-0.015em] text-ink">{{ title }}</h2>
    <p v-if="description" class="mt-2 max-w-md text-sm leading-relaxed text-ink-secondary">
      {{ description }}
    </p>
    <div v-if="$slots.actions" class="mt-6">
      <slot name="actions" />
    </div>
  </div>
</template>
