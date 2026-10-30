<script setup lang="ts">
import { computed } from 'vue'
import { Mail, MapPin, ArrowUpRight } from 'lucide-vue-next'
import type { Portfolio, SocialProfile } from '@/types/portfolio'
import AvailabilityBadge from '@/components/shared/AvailabilityBadge.vue'
import SocialIcon from '@/components/shared/SocialIcon.vue'
import {
  FALLBACK_PROFILE_IMAGE,
  formatAddress,
  getDisplayName,
  joinNonEmpty,
  secondaryOccupations,
} from '@/utils/portfolio-formatter'
import { toExternalHref, toMailtoHref } from '@/utils/url'

const props = defineProps<{ portfolio: Portfolio }>()

const name = computed(() => getDisplayName(props.portfolio))
const location = computed(
  () =>
    formatAddress(props.portfolio.contact.address) ||
    formatAddress(props.portfolio.summary.availability?.location),
)
const availability = computed(() => props.portfolio.summary.availability)

const primaryEmail = computed(() => {
  const emails = props.portfolio.contact.emails ?? []
  return emails.find((email) => email.isPrimary) ?? emails[0]
})
const emailHref = computed(() =>
  primaryEmail.value ? toMailtoHref(primaryEmail.value.address) : undefined,
)

const websites = computed(() =>
  (props.portfolio.contact.websites ?? [])
    .map((website) => ({ label: website.label ?? 'Website', url: toExternalHref(website.url) }))
    .filter((website): website is { label: string; url: string } => Boolean(website.url)),
)

const socialProfiles = computed(() =>
  (props.portfolio.social?.profiles ?? [])
    .map((profile) => ({ ...profile, url: toExternalHref(profile.url) }))
    .filter((profile): profile is SocialProfile & { url: string } => Boolean(profile.url))
    .slice(0, 6),
)

const imageSrc = props.portfolio.profileImageUrl ?? FALLBACK_PROFILE_IMAGE

const occupationLine = computed(() =>
  joinNonEmpty([
    secondaryOccupations(props.portfolio.occupation, props.portfolio.summary.headline).join(' · '),
    props.portfolio.pronouns,
  ]),
)

function onImageError(event: Event): void {
  const image = event.target as HTMLImageElement
  if (image.getAttribute('src') === FALLBACK_PROFILE_IMAGE) return
  image.src = FALLBACK_PROFILE_IMAGE
}
</script>

<template>
  <header class="glass relative overflow-hidden rounded-[2rem] p-6 sm:p-10">
    <div
      class="pointer-events-none absolute -top-28 -right-24 size-72 rounded-full bg-accent-soft blur-2xl"
      aria-hidden="true"
    />
    <div class="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:gap-9">
      <img
        :src="imageSrc"
        :alt="`Portrait of ${name}`"
        width="128"
        height="128"
        decoding="async"
        class="size-24 shrink-0 rounded-[1.75rem] bg-canvas-tint object-cover shadow-sm ring-1 ring-hairline sm:size-32"
        @error="onImageError"
      />

      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
          <AvailabilityBadge :availability="availability" />
          <span v-if="location" class="inline-flex items-center gap-1.5 text-xs text-ink-tertiary">
            <MapPin class="size-3.5" aria-hidden="true" />
            {{ location }}
          </span>
        </div>

        <h1 class="display-title mt-3">{{ name }}</h1>
        <p class="mt-2 text-lg leading-snug text-ink-secondary sm:text-xl">
          {{ portfolio.summary.headline }}
        </p>
        <p v-if="occupationLine" class="mt-2 text-sm text-ink-tertiary">
          {{ occupationLine }}
        </p>

        <div class="mt-6 flex flex-wrap items-center gap-2">
          <a v-if="emailHref" :href="emailHref" class="btn btn-primary">
            <Mail class="size-4" aria-hidden="true" />
            Email
          </a>
          <a
            v-for="website in websites"
            :key="website.url"
            :href="website.url"
            target="_blank"
            rel="noopener noreferrer nofollow"
            class="btn btn-secondary"
          >
            {{ website.label }}
            <ArrowUpRight class="size-3.5" aria-hidden="true" />
          </a>
          <a
            v-for="profile in socialProfiles"
            :key="profile.url"
            :href="profile.url"
            target="_blank"
            rel="noopener noreferrer nofollow"
            class="icon-btn"
            :aria-label="`${name} on ${profile.platform}`"
            :title="profile.platform"
          >
            <SocialIcon :platform="profile.platform" />
          </a>
        </div>
      </div>
    </div>
  </header>
</template>
