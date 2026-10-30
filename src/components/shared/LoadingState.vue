<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'

withDefaults(defineProps<{ label?: string }>(), {
  label: 'Loading portfolio…',
})
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    class="flex flex-col items-center justify-center gap-4 py-24"
  >
    <LoaderCircle
      class="size-6 animate-spin text-ink-tertiary motion-reduce:animate-none"
      aria-hidden="true"
    />
    <p class="text-sm text-ink-secondary">{{ label }}</p>
  </div>
</template>
