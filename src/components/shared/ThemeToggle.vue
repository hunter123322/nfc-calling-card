<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'

const theme = useThemeStore()
</script>

<template>
  <button
    type="button"
    class="icon-btn"
    aria-label="Toggle light or dark theme"
    title="Toggle light or dark theme"
    @click="theme.toggle()"
  >
    <span class="relative grid size-4 place-items-center" aria-hidden="true">
      <Sun class="theme-icon-sun col-start-1 row-start-1 size-4 motion-reduce:transition-none" />
      <Moon class="theme-icon-moon col-start-1 row-start-1 size-4 motion-reduce:transition-none" />
    </span>
  </button>
</template>
