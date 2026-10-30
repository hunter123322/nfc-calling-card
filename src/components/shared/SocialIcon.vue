<script setup lang="ts">
import { computed, type Component } from 'vue'
import {
  AtSign,
  BookOpen,
  Dribbble,
  Facebook,
  Github,
  Globe,
  GraduationCap,
  Instagram,
  Linkedin,
  Music2,
  Palette,
  Twitter,
  Youtube,
} from 'lucide-vue-next'

const props = withDefaults(defineProps<{ platform: string; sizeClass?: string }>(), {
  sizeClass: 'size-4',
})

const ICONS: Record<string, Component> = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  dribbble: Dribbble,
  behance: Palette,
  facebook: Facebook,
  threads: AtSign,
  tiktok: Music2,
  'google scholar': GraduationCap,
  orcid: GraduationCap,
  researchgate: GraduationCap,
  medium: BookOpen,
  substack: BookOpen,
  'dev.to': BookOpen,
  website: Globe,
}

const icon = computed<Component>(() => ICONS[props.platform.trim().toLowerCase()] ?? Globe)
</script>

<template>
  <component :is="icon" :class="sizeClass" aria-hidden="true" />
</template>
