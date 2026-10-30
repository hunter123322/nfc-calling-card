<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowUpRight, Briefcase, Mail, MapPin, Phone } from 'lucide-vue-next'
import LoadingState from '@/components/shared/LoadingState.vue'
import ErrorState from '@/components/shared/ErrorState.vue'
import NotFound from '@/components/shared/NotFound.vue'
import SocialIcon from '@/components/shared/SocialIcon.vue'
import ThemeToggle from '@/components/shared/ThemeToggle.vue'
import { useContact } from '@/composables/useContact'
import {
  CONTACT_SOCIAL_LABELS,
  CONTACT_SOCIAL_PLATFORMS,
  type ContactSocialPlatform,
} from '@/types/contact'
import { FALLBACK_PROFILE_IMAGE } from '@/utils/portfolio-formatter'
import { buildContactNotFoundSeo, buildContactSeo } from '@/utils/portfolio-seo'
import { applySeoMetadata } from '@/utils/seo-dom'
import { toExternalHref, toMailtoHref, toTelHref } from '@/utils/url'

const route = useRoute()
const code = computed(() => String(route.params.code ?? ''))
const { contact, isLoading, notFound, hasError, errorMessage, retry } = useContact(code)

const profileImageSrc = computed(() => contact.value?.profileImageUrl ?? FALLBACK_PROFILE_IMAGE)
const emailHref = computed(() => (contact.value ? toMailtoHref(contact.value.email) : undefined))
const mobileHref = computed(() => (contact.value ? toTelHref(contact.value.mobile) : undefined))

function onProfileImageError(event: Event): void {
  const image = event.target as HTMLImageElement
  if (image.getAttribute('src') === FALLBACK_PROFILE_IMAGE) return
  image.src = FALLBACK_PROFILE_IMAGE
}

interface ContactSocialLink {
  platform: ContactSocialPlatform
  label: string
  url: string
  accent: string
  background: string
  foreground: string
}

const PLATFORM_STYLES: Record<
  ContactSocialPlatform,
  Pick<ContactSocialLink, 'accent' | 'background' | 'foreground'>
> = {
  facebook: { accent: '#1877F2', background: '#1877F2', foreground: '#ffffff' },
  instagram: {
    accent: '#E4405F',
    background: 'linear-gradient(135deg, #f9ce34 0%, #ee2a7b 55%, #6228d7 100%)',
    foreground: '#ffffff',
  },
  x: { accent: '#000000', background: '#000000', foreground: '#ffffff' },
  threads: { accent: '#000000', background: '#000000', foreground: '#ffffff' },
  linkedin: { accent: '#0A66C2', background: '#0A66C2', foreground: '#ffffff' },
  youtube: { accent: '#FF0000', background: '#FF0000', foreground: '#ffffff' },
  tiktok: { accent: '#000000', background: '#000000', foreground: '#ffffff' },
}

const socialLinks = computed<ContactSocialLink[]>(() => {
  const social = contact.value?.social
  if (!social) return []
  return CONTACT_SOCIAL_PLATFORMS.flatMap((platform) => {
    const url = toExternalHref(social[platform])
    if (!url) return []
    return [
      {
        platform,
        label: CONTACT_SOCIAL_LABELS[platform],
        url,
        ...PLATFORM_STYLES[platform],
      },
    ]
  })
})

watch(
  contact,
  (profile) => {
    if (profile) applySeoMetadata(buildContactSeo(profile))
  },
  { immediate: true },
)

watch(
  [notFound, hasError],
  ([missing, error]) => {
    if (missing) applySeoMetadata(buildContactNotFoundSeo())
    if (error) {
      applySeoMetadata({
        ...buildContactNotFoundSeo(),
        title: 'Contact unavailable',
        ogTitle: 'Contact unavailable',
        description: 'This contact could not be loaded.',
        ogDescription: 'This contact could not be loaded.',
      })
    }
  },
  { immediate: true },
)
</script>

<template>
  <main id="main" class="mx-auto w-full max-w-4xl px-5 pt-6 pb-24 sm:px-8 sm:pt-10">
    <LoadingState v-if="isLoading" label="Loading contact…" />

    <ErrorState
      v-else-if="hasError"
      title="This contact could not be loaded"
      :message="errorMessage"
      @retry="retry"
    />

    <NotFound
      v-else-if="notFound"
      title="Contact not found"
      description="This contact code does not exist. Check the link you were given."
    />

    <article v-else-if="contact">
      <header class="glass relative overflow-hidden rounded-4xl p-6 sm:p-10">
        <div
          class="pointer-events-none absolute -top-28 -right-24 size-72 rounded-full bg-accent-soft blur-2xl"
          aria-hidden="true"
        />

        <div class="absolute top-4 right-4 z-10 sm:top-6 sm:right-6">
          <ThemeToggle />
        </div>

        <div class="relative flex flex-col gap-7 sm:flex-row sm:items-stretch sm:gap-9">
          <img
            :src="profileImageSrc"
            :alt="`Portrait of ${contact.fullName}`"
            width="128"
            height="128"
            decoding="async"
            class="size-40 shrink-0 self-center sm:w-50 rounded-[1.75rem] bg-canvas-tint object-cover shadow-sm ring-1 ring-hairline sm:h-auto sm:self-stretch"
            @error="onProfileImageError"
          />

          <div class="min-w-0 flex-1">
            <h1 class="display-title">{{ contact.fullName }}</h1>

            <p class="mt-2 text-xl leading-snug text-ink-secondary sm:text-2xl">
              {{ contact.occupation }}
            </p>

            <span class="chip mt-3 px-3 py-1.5 text-sm"> {{ contact.age }} years old </span>

            <div class="mt-6 flex flex-wrap items-center gap-2">
              <a v-if="emailHref" :href="emailHref" class="btn btn-primary text-base">
                <Mail class="size-4" aria-hidden="true" />
                Email
              </a>

              <a v-if="mobileHref" :href="mobileHref" class="btn btn-secondary text-base">
                <Phone class="size-4" aria-hidden="true" />
                Call
              </a>
            </div>
          </div>
        </div>
      </header>

      <section aria-labelledby="contact-details-title" class="mt-10 border-t border-hairline pt-9">
        <h2 id="contact-details-title" class="display-section">Details</h2>

        <dl class="mt-6 grid gap-4 sm:grid-cols-2">
          <div
            class="group rounded-2xl border border-hairline bg-gradient-to-br from-accent/10 via-canvas to-canvas-tint/50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-md sm:p-6"
          >
            <dt
              class="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-ink-tertiary"
            >
              <MapPin class="size-4 text-accent-ink" aria-hidden="true" />
              Address
            </dt>
            <dd class="mt-3 text-base leading-relaxed text-ink">{{ contact.address }}</dd>
          </div>

          <div
            class="group rounded-2xl border border-hairline bg-gradient-to-br from-sky-500/10 via-canvas to-canvas-tint/50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/30 hover:shadow-md sm:p-6"
          >
            <dt
              class="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-ink-tertiary"
            >
              <Mail class="size-4 text-sky-600" aria-hidden="true" />
              Email
            </dt>
            <dd class="mt-3 text-base">
              <a
                v-if="emailHref"
                :href="emailHref"
                class="break-all font-medium text-ink underline decoration-hairline-strong underline-offset-4 transition-colors hover:text-accent-ink"
              >
                {{ contact.email }}
              </a>
              <span v-else class="text-ink-secondary">{{ contact.email }}</span>
            </dd>
          </div>

          <div
            class="group rounded-2xl border border-hairline bg-gradient-to-br from-emerald-500/10 via-canvas to-canvas-tint/50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-md sm:p-6"
          >
            <dt
              class="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-ink-tertiary"
            >
              <Phone class="size-4 text-emerald-600" aria-hidden="true" />
              Mobile
            </dt>
            <dd class="mt-3 text-base">
              <a
                v-if="mobileHref"
                :href="mobileHref"
                class="font-medium text-ink underline decoration-hairline-strong underline-offset-4 transition-colors hover:text-accent-ink"
              >
                {{ contact.mobile }}
              </a>
              <span v-else class="text-ink-secondary">{{ contact.mobile }}</span>
            </dd>
          </div>

          <div
            class="group rounded-2xl border border-hairline bg-gradient-to-br from-violet-500/10 via-canvas to-canvas-tint/50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-md sm:p-6"
          >
            <dt
              class="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-ink-tertiary"
            >
              <Briefcase class="size-4 text-violet-600" aria-hidden="true" />
              Occupation
            </dt>
            <dd class="mt-3 text-base text-ink">{{ contact.occupation }}</dd>
          </div>
        </dl>
      </section>

      <section
        v-if="socialLinks.length > 0"
        aria-labelledby="contact-social-title"
        class="mt-10 border-t border-hairline pt-9"
      >
        <h2 id="contact-social-title" class="display-section">Social</h2>

        <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a
            v-for="link in socialLinks"
            :key="link.platform"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer nofollow"
            class="surface-card pressable flex min-w-0 items-center gap-3 overflow-hidden border-l-4 p-4 sm:p-5"
            :style="{ borderLeftColor: link.accent }"
            :aria-label="`${contact.fullName} on ${link.label}`"
          >
            <span
              class="grid size-10 shrink-0 place-items-center rounded-xl shadow-sm ring-1 ring-black/10 dark:ring-white/20"
              :style="{ background: link.background, color: link.foreground }"
              aria-hidden="true"
            >
              <SocialIcon :platform="link.platform" size-class="size-5" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-base font-medium text-ink">{{ link.label }}</span>
              <span class="block truncate text-sm text-ink-tertiary">{{ link.url }}</span>
            </span>
            <ArrowUpRight class="size-4 shrink-0 text-ink-tertiary" aria-hidden="true" />
          </a>
        </div>
      </section>
    </article>

    <LoadingState v-else label="Loading contact…" />
  </main>
</template>
