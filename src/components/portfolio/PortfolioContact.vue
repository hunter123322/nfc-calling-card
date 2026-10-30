<script setup lang="ts">
import { computed } from 'vue'
import { Globe, Mail, MapPin, Phone } from 'lucide-vue-next'
import type { Portfolio, SocialProfile } from '@/types/portfolio'
import PortfolioSection from './PortfolioSection.vue'
import SocialIcon from '@/components/shared/SocialIcon.vue'
import { formatAddress, getDisplayName, humanize } from '@/utils/portfolio-formatter'
import { hasContactData } from '@/utils/portfolio-sections'
import { toExternalHref, toMailtoHref, toTelHref } from '@/utils/url'

const props = defineProps<{ portfolio: Portfolio }>()

const name = computed(() => getDisplayName(props.portfolio))
const available = computed(() => hasContactData(props.portfolio))

const emails = computed(() =>
  [...(props.portfolio.contact.emails ?? [])]
    .sort((a, b) => Number(Boolean(b.isPrimary)) - Number(Boolean(a.isPrimary)))
    .map((email) => ({ ...email, href: toMailtoHref(email.address) })),
)

const phones = computed(() =>
  [...(props.portfolio.contact.phones ?? [])]
    .sort((a, b) => Number(Boolean(b.isPrimary)) - Number(Boolean(a.isPrimary)))
    .map((phone) => ({ ...phone, href: toTelHref(phone.number) })),
)

const websites = computed(() =>
  (props.portfolio.contact.websites ?? [])
    .map((website) => ({
      label: website.label ?? 'Website',
      url: toExternalHref(website.url),
    }))
    .filter((website): website is { label: string; url: string } => Boolean(website.url)),
)

const socials = computed(() =>
  (props.portfolio.social?.profiles ?? [])
    .map((profile) => ({ ...profile, url: toExternalHref(profile.url) }))
    .filter((profile): profile is SocialProfile & { url: string } => Boolean(profile.url)),
)

const address = computed(
  () =>
    formatAddress(props.portfolio.contact.address) ||
    formatAddress(props.portfolio.summary.availability?.location),
)

const primaryEmail = computed(() => emails.value[0])
const primaryPhone = computed(() => phones.value[0])
const reachLine = computed(() => {
  if (primaryEmail.value) return `The quickest way to reach ${name.value} is by email.`
  if (primaryPhone.value) return `The quickest way to reach ${name.value} is by phone.`
  return 'Reach out through any of the channels below.'
})
const referencesOnRequest = computed(() =>
  (props.portfolio.references ?? []).some((reference) => reference.isAvailableOnRequest),
)
</script>

<template>
  <PortfolioSection v-if="available" id="contact" title="Contact">
    <div class="surface-card overflow-hidden">
      <div class="grid gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:gap-12">
        <div class="flex flex-col">
          <p class="text-lg leading-snug text-ink">Have a project or role in mind?</p>
          <p class="mt-2 max-w-sm text-sm leading-relaxed text-ink-secondary">
            {{ reachLine }}
          </p>

          <div class="mt-5 flex flex-wrap items-center gap-2">
            <a v-if="primaryEmail?.href" :href="primaryEmail.href" class="btn btn-primary">
              <Mail class="size-4" aria-hidden="true" />
              Email
            </a>
            <a v-if="primaryPhone?.href" :href="primaryPhone.href" class="btn btn-secondary">
              <Phone class="size-4" aria-hidden="true" />
              Call
            </a>
            <a
              v-if="websites[0]"
              :href="websites[0].url"
              target="_blank"
              rel="noopener noreferrer nofollow"
              class="btn btn-secondary"
            >
              <Globe class="size-4" aria-hidden="true" />
              {{ websites[0].label }}
            </a>
          </div>

          <p v-if="address" class="mt-5 inline-flex items-center gap-2 text-sm text-ink-secondary">
            <MapPin class="size-4 text-ink-tertiary" aria-hidden="true" />
            {{ address }}
          </p>

          <p v-if="referencesOnRequest" class="mt-4 text-xs text-ink-tertiary">
            References are available on request.
          </p>

          <div v-if="socials.length > 0" class="mt-6 flex flex-wrap gap-2">
            <a
              v-for="profile in socials"
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

        <div class="space-y-5">
          <div v-if="emails.length > 0">
            <p class="eyebrow">Email</p>
            <ul class="mt-2 space-y-2">
              <li v-for="email in emails" :key="email.address">
                <a
                  v-if="email.href"
                  :href="email.href"
                  class="flex items-center gap-3 rounded-2xl border border-hairline px-3 py-2.5 transition-colors hover:border-hairline-strong"
                >
                  <Mail class="size-4 shrink-0 text-ink-tertiary" aria-hidden="true" />
                  <span class="min-w-0">
                    <span class="block truncate text-sm text-ink">{{ email.address }}</span>
                    <span v-if="email.label" class="block text-xs text-ink-tertiary">
                      {{ humanize(email.label) }}
                    </span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div v-if="phones.length > 0">
            <p class="eyebrow">Phone</p>
            <ul class="mt-2 space-y-2">
              <li v-for="phone in phones" :key="phone.number">
                <a
                  v-if="phone.href"
                  :href="phone.href"
                  class="flex items-center gap-3 rounded-2xl border border-hairline px-3 py-2.5 transition-colors hover:border-hairline-strong"
                >
                  <Phone class="size-4 shrink-0 text-ink-tertiary" aria-hidden="true" />
                  <span class="min-w-0">
                    <span class="block truncate text-sm text-ink">{{ phone.number }}</span>
                    <span v-if="phone.label" class="block text-xs text-ink-tertiary">
                      {{ humanize(phone.label) }}
                    </span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div v-if="websites.length > 0">
            <p class="eyebrow">Elsewhere</p>
            <ul class="mt-2 space-y-2">
              <li v-for="website in websites" :key="website.url">
                <a
                  :href="website.url"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  class="flex items-center gap-3 rounded-2xl border border-hairline px-3 py-2.5 transition-colors hover:border-hairline-strong"
                >
                  <Globe class="size-4 shrink-0 text-ink-tertiary" aria-hidden="true" />
                  <span class="min-w-0">
                    <span class="block truncate text-sm text-ink">{{ website.label }}</span>
                    <span class="block truncate text-xs text-ink-tertiary">{{ website.url }}</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </PortfolioSection>
</template>
