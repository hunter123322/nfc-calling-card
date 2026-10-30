<script setup lang="ts">
import NotFound from '@/components/shared/NotFound.vue'
import { onMounted } from 'vue'
import { buildNotFoundSeo } from '@/utils/portfolio-seo'
import { applySeoMetadata } from '@/utils/seo-dom'

onMounted(() => applySeoMetadata(buildNotFoundSeo()))
</script>

<template>
  <main id="main" class="mx-auto w-full max-w-5xl px-5 pb-24 sm:px-8">
    <NotFound
      title="Page not found"
      description="The page you are looking for does not exist. The directory is the best place to start."
    />
  </main>
</template>
