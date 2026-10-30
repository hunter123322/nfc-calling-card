<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, Check } from 'lucide-vue-next'
import type { Portfolio } from '@/types/portfolio'
import PortfolioSection from './PortfolioSection.vue'
import { joinNonEmpty } from '@/utils/portfolio-formatter'
import { toExternalHref } from '@/utils/url'

const props = defineProps<{ portfolio: Portfolio }>()

const practice = computed(() => props.portfolio.practice)
const services = computed(() => practice.value?.services ?? [])
const eligibility = computed(() => props.portfolio.workEligibility)

const hasSection = computed(() => Boolean(practice.value) || Boolean(eligibility.value))
const title = computed(() => (practice.value ? 'Services' : 'Work eligibility'))

const practiceUrl = computed(() => toExternalHref(practice.value?.url))

const eligibilityChips = computed(() => {
  const item = eligibility.value
  if (!item) return []
  const chips: string[] = []
  for (const country of item.authorizedCountries ?? []) chips.push(`Authorised in ${country}`)
  if (item.remote) chips.push('Open to remote')
  if (item.relocation) chips.push('Open to relocation')
  if (item.requiresSponsorship === true) chips.push('Requires sponsorship')
  if (item.requiresSponsorship === false) chips.push('No sponsorship required')
  return chips
})
</script>

<template>
  <PortfolioSection
    v-if="hasSection"
    id="services"
    :title="title"
    :eyebrow="practice?.businessName"
  >
    <div v-if="practice" class="surface-card p-6 sm:p-8">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div class="max-w-xl">
          <p v-if="practice.tagline" class="text-lg leading-snug text-ink">
            {{ practice.tagline }}
          </p>
          <p v-if="practice.description" class="mt-2 text-sm leading-relaxed text-ink-secondary">
            {{ practice.description }}
          </p>
        </div>
        <a
          v-if="practiceUrl"
          :href="practiceUrl"
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="btn btn-secondary"
        >
          Visit studio
          <ArrowUpRight class="size-3.5" aria-hidden="true" />
        </a>
      </div>

      <p
        v-if="practice.foundedYear || practice.serviceArea?.length"
        class="mt-4 text-xs text-ink-tertiary"
      >
        {{
          joinNonEmpty([
            practice.foundedYear ? `Since ${practice.foundedYear}` : undefined,
            ...(practice.serviceArea ?? []),
          ])
        }}
      </p>

      <ul v-if="services.length > 0" class="mt-6 grid gap-4 sm:grid-cols-2">
        <li
          v-for="service in services"
          :key="service.name"
          class="rounded-2xl border border-hairline p-4"
        >
          <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 class="text-sm font-semibold tracking-[-0.01em] text-ink">{{ service.name }}</h3>
            <span v-if="service.priceLabel" class="chip">{{ service.priceLabel }}</span>
          </div>
          <p v-if="service.description" class="mt-2 text-sm leading-relaxed text-ink-secondary">
            {{ service.description }}
          </p>
          <ul v-if="service.deliverables && service.deliverables.length > 0" class="mt-3 space-y-1">
            <li
              v-for="deliverable in service.deliverables"
              :key="deliverable"
              class="flex gap-2 text-xs leading-relaxed text-ink-secondary"
            >
              <Check class="mt-0.5 size-3 shrink-0 text-accent" aria-hidden="true" />
              <span>{{ deliverable }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div v-if="eligibility" class="surface-card p-6 sm:p-8" :class="practice ? 'mt-4' : undefined">
      <h3 class="text-sm font-semibold tracking-[-0.01em] text-ink">Work eligibility</h3>
      <div v-if="eligibilityChips.length > 0" class="mt-3 flex flex-wrap gap-2">
        <span v-for="chip in eligibilityChips" :key="chip" class="chip">{{ chip }}</span>
      </div>
      <p v-if="eligibility.visaStatus" class="mt-3 text-sm text-ink-secondary">
        {{ eligibility.visaStatus }}
      </p>
      <p v-if="eligibility.notes" class="mt-2 text-sm leading-relaxed text-ink-secondary">
        {{ eligibility.notes }}
      </p>
    </div>
  </PortfolioSection>
</template>
