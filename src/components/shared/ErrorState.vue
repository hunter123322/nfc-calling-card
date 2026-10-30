<script setup lang="ts">
import { CircleAlert, RotateCcw } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    title?: string
    message?: string | null
  }>(),
  {
    title: 'Something went wrong',
    message: null,
  },
)

defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="surface-card flex flex-col items-center px-6 py-14 text-center sm:py-16">
    <div class="grid size-11 place-items-center rounded-2xl bg-chip text-ink-secondary">
      <CircleAlert class="size-5" aria-hidden="true" />
    </div>
    <h2 class="mt-5 text-lg font-semibold tracking-[-0.015em] text-ink">{{ title }}</h2>
    <p v-if="message" class="mt-2 max-w-md text-sm leading-relaxed text-ink-secondary">
      {{ message }}
    </p>
    <button type="button" class="btn btn-secondary mt-6" @click="$emit('retry')">
      <RotateCcw class="size-4" aria-hidden="true" />
      Try again
    </button>
  </div>
</template>
