<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/shared/AppHeader.vue'

const route = useRoute()
const showHeader = computed(() => route.name !== 'contact')
</script>

<template>
  <a href="#main" class="skip-link">Skip to content</a>
  <div class="flex min-h-dvh flex-col">
    <AppHeader v-if="showHeader" />
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </div>
</template>
