<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowUpRight, Check, Github } from 'lucide-vue-next'
import type { PortfolioMedia, PortfolioWork } from '@/types/portfolio'
import {
  FALLBACK_WORK_IMAGE,
  formatDateRange,
  humanize,
  joinNonEmpty,
} from '@/utils/portfolio-formatter'
import { toExternalHref, toMediaSrc } from '@/utils/url'

const props = defineProps<{ work: PortfolioWork; locale: string }>()

const media = computed(() => props.work.media ?? [])
const activeIndex = ref(0)
const activeMedia = computed<PortfolioMedia | undefined>(
  () => media.value[activeIndex.value] ?? media.value[0],
)

const imageMedia = computed(() =>
  media.value.map((item, index) => ({ item, index })).filter(({ item }) => item.type === 'image'),
)

const embedUrl = computed(() => toExternalHref(activeMedia.value?.url))
const audioUrl = computed(() => toMediaSrc(activeMedia.value?.url))
const videoUrl = computed(() => toMediaSrc(activeMedia.value?.url))

const meta = computed(() =>
  joinNonEmpty([
    humanize(props.work.kind),
    props.work.status ? humanize(props.work.status) : undefined,
    formatDateRange(props.work.dateRange, props.locale),
    props.work.role,
  ]),
)

interface WorkLink {
  label: string
  url: string
  icon: 'github' | 'external'
}

const links = computed<WorkLink[]>(() => {
  const result: WorkLink[] = []
  const seen = new Set<string>()
  const push = (label: string, url: string | undefined, icon: WorkLink['icon'] = 'external') => {
    const safe = toExternalHref(url)
    if (!safe || seen.has(safe)) return
    seen.add(safe)
    result.push({ label, url: safe, icon })
  }

  push('View work', props.work.links?.primary)
  push('Repository', props.work.links?.repository, 'github')
  push('Live demo', props.work.links?.liveDemo)
  for (const external of props.work.links?.external ?? []) {
    push(external.label, external.url)
  }
  return result
})

const collaborators = computed(
  () => props.work.collaborators?.map((collaborator) => collaborator.name).join(', ') ?? '',
)

function onImageError(event: Event): void {
  const image = event.target as HTMLImageElement
  if (image.getAttribute('src') === FALLBACK_WORK_IMAGE) return
  image.src = FALLBACK_WORK_IMAGE
}

function selectMedia(index: number): void {
  activeIndex.value = index
}
</script>

<template>
  <article
    class="surface-card flex flex-col overflow-hidden"
    :class="work.isFeatured ? 'sm:col-span-2' : undefined"
  >
    <div
      v-if="activeMedia"
      class="relative w-full overflow-hidden bg-canvas-tint"
      :class="work.isFeatured ? 'aspect-[16/10] sm:aspect-[21/9]' : 'aspect-[16/10]'"
    >
      <img
        v-if="activeMedia?.type === 'image'"
        :src="activeMedia.url"
        :alt="activeMedia.altText ?? work.title"
        loading="lazy"
        decoding="async"
        class="size-full object-cover"
        @error="onImageError"
      />
      <video
        v-else-if="activeMedia?.type === 'video' && videoUrl"
        :src="videoUrl"
        :poster="activeMedia.posterUrl"
        controls
        preload="metadata"
        class="size-full bg-black object-contain"
      >
        Your browser does not support embedded video.
      </video>
      <div
        v-else-if="activeMedia?.type === 'audio' && audioUrl"
        class="grid size-full place-items-center p-6"
      >
        <audio :src="audioUrl" controls preload="metadata" class="w-full max-w-sm">
          Your browser does not support embedded audio.
        </audio>
      </div>
      <a
        v-else-if="activeMedia?.type === 'embed' && embedUrl"
        :href="embedUrl"
        target="_blank"
        rel="noopener noreferrer nofollow"
        class="grid size-full place-items-center gap-2 text-sm text-ink-secondary transition-colors hover:text-ink"
      >
        <span class="eyebrow">{{ humanize(work.kind) }}</span>
        <span class="inline-flex items-center gap-1.5 font-medium">
          Open embedded media
          <ArrowUpRight class="size-4" aria-hidden="true" />
        </span>
      </a>
      <div v-else class="grid size-full place-items-center">
        <span class="eyebrow">{{ humanize(work.kind) }}</span>
      </div>
      <span class="chip absolute top-3 left-3 bg-black/55 text-white backdrop-blur-md">
        {{ humanize(work.kind) }}
      </span>
      <span
        v-if="work.isFeatured"
        class="chip absolute top-3 right-3 bg-white/85 text-black backdrop-blur-md"
      >
        Featured
      </span>
    </div>

    <div
      v-if="imageMedia.length > 1"
      class="flex gap-2 overflow-x-auto border-b border-hairline p-3"
    >
      <button
        v-for="entry in imageMedia"
        :key="entry.item.url"
        type="button"
        class="size-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-hairline transition focus-visible:ring-2 focus-visible:ring-accent"
        :class="entry.index === activeIndex ? 'ring-2 ring-accent' : undefined"
        :aria-pressed="entry.index === activeIndex"
        :aria-label="`Show image ${entry.index + 1} of ${work.title}`"
        @click="selectMedia(entry.index)"
      >
        <img
          :src="entry.item.thumbnailUrl ?? entry.item.url"
          :alt="entry.item.altText ?? ''"
          loading="lazy"
          decoding="async"
          class="size-full object-cover"
          @error="onImageError"
        />
      </button>
    </div>

    <div class="flex flex-1 flex-col p-5 sm:p-6">
      <p class="text-xs text-ink-tertiary">{{ meta }}</p>
      <h3 class="mt-2 text-lg font-semibold tracking-[-0.02em] text-ink sm:text-xl">
        {{ work.title }}
      </h3>
      <p v-if="work.subtitle" class="mt-1 text-sm text-ink-secondary">{{ work.subtitle }}</p>
      <p class="mt-3 text-sm leading-relaxed text-ink-secondary">{{ work.summary }}</p>

      <ul v-if="work.outcomes && work.outcomes.length > 0" class="mt-4 space-y-1.5">
        <li
          v-for="outcome in work.outcomes"
          :key="outcome"
          class="flex gap-2 text-sm leading-relaxed text-ink-secondary"
        >
          <Check class="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
          <span>{{ outcome }}</span>
        </li>
      </ul>

      <div v-if="work.tags && work.tags.length > 0" class="mt-4 flex flex-wrap gap-1.5">
        <span v-for="tag in work.tags" :key="tag" class="chip">{{ tag }}</span>
      </div>

      <div v-if="links.length > 0" class="mt-5 flex flex-wrap items-center gap-2">
        <a
          v-for="link in links"
          :key="link.url"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="btn btn-secondary"
        >
          <Github v-if="link.icon === 'github'" class="size-4" aria-hidden="true" />
          <ArrowUpRight v-else class="size-4" aria-hidden="true" />
          {{ link.label }}
        </a>
      </div>

      <p v-if="collaborators" class="mt-4 text-xs text-ink-tertiary">With {{ collaborators }}</p>
    </div>
  </article>
</template>
