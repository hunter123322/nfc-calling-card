<script setup lang="ts">
import { computed } from 'vue'
import type { Availability } from '@/types/portfolio'
import { humanize, joinNonEmpty } from '@/utils/portfolio-formatter'

const props = defineProps<{ availability?: Availability }>()

const label = computed(() => {
  const availability = props.availability
  if (!availability) return ''
  const types = (availability.type ?? []).map(humanize).join(', ')
  switch (availability.status) {
    case 'available':
      return types ? `Available for ${types.toLowerCase()}` : 'Available for work'
    case 'open':
      return 'Open to opportunities'
    case 'employed':
      return 'Currently employed'
    default:
      return 'Not available'
  }
})

const tone = computed(() => {
  switch (props.availability?.status) {
    case 'available':
    case 'open':
      return 'bg-success/10 text-success'
    case 'employed':
      return 'bg-chip text-ink-secondary'
    default:
      return 'bg-chip text-ink-tertiary'
  }
})

const meta = computed(() =>
  joinNonEmpty([
    props.availability?.remote ? 'Remote' : undefined,
    props.availability?.timezone,
    props.availability?.noticePeriod ? `${props.availability.noticePeriod} notice` : undefined,
  ]),
)
</script>

<template>
  <span v-if="availability" class="inline-flex flex-wrap items-center gap-2">
    <span class="chip" :class="tone">
      <span class="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {{ label }}
    </span>
    <span v-if="meta" class="text-xs text-ink-tertiary">{{ meta }}</span>
  </span>
</template>
