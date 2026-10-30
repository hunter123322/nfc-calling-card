<script setup lang="ts">
import { computed } from 'vue'
import type { Portfolio } from '@/types/portfolio'
import PortfolioSection from './PortfolioSection.vue'
import { formatDate, formatDateRange } from '@/utils/portfolio-formatter'

const props = defineProps<{ portfolio: Portfolio }>()

const volunteer = computed(() => props.portfolio.volunteerExperience ?? [])
const involvements = computed(() => props.portfolio.involvements ?? [])
const memberships = computed(() => props.portfolio.professionalMemberships ?? [])
const locale = computed(() => props.portfolio.metadata.locale)
const total = computed(
  () => volunteer.value.length + involvements.value.length + memberships.value.length,
)
</script>

<template>
  <PortfolioSection v-if="total > 0" id="involvement" title="Community" :count="total">
    <div class="space-y-8">
      <div v-if="volunteer.length > 0">
        <p v-if="total > volunteer.length" class="eyebrow">Volunteering</p>
        <ul class="mt-3 space-y-4">
          <li v-for="item in volunteer" :key="item.id ?? `${item.role}-${item.organization.name}`">
            <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 class="text-sm font-semibold text-ink">
                {{ item.role }}
                <span class="font-normal text-ink-secondary"> · {{ item.organization.name }}</span>
              </h3>
              <p class="text-xs text-ink-tertiary">
                {{ formatDateRange(item.dateRange, locale) }}
              </p>
            </div>
            <p v-if="item.summary" class="mt-1 text-sm text-ink-secondary">{{ item.summary }}</p>
            <ul v-if="item.highlights && item.highlights.length > 0" class="mt-1 space-y-1">
              <li
                v-for="highlight in item.highlights"
                :key="highlight"
                class="text-sm leading-relaxed text-ink-secondary"
              >
                {{ highlight }}
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div v-if="involvements.length > 0">
        <p v-if="total > involvements.length" class="eyebrow">Involvement</p>
        <ul class="mt-3 space-y-4">
          <li v-for="item in involvements" :key="item.id ?? item.title">
            <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 class="text-sm font-semibold text-ink">
                {{ item.title }}
                <span v-if="item.role" class="font-normal text-ink-secondary">
                  · {{ item.role }}</span
                >
              </h3>
              <p v-if="item.dateRange" class="text-xs text-ink-tertiary">
                {{ formatDateRange(item.dateRange, locale) }}
              </p>
            </div>
            <p v-if="item.organization" class="mt-1 text-xs text-ink-tertiary">
              {{ item.organization.name }}
            </p>
            <p v-if="item.description" class="mt-1 text-sm leading-relaxed text-ink-secondary">
              {{ item.description }}
            </p>
          </li>
        </ul>
      </div>

      <div v-if="memberships.length > 0">
        <p v-if="total > memberships.length" class="eyebrow">Memberships</p>
        <ul class="mt-3 space-y-3">
          <li v-for="item in memberships" :key="item.id ?? item.organization.name">
            <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 class="text-sm font-semibold text-ink">
                {{ item.organization.name }}
                <span v-if="item.role" class="font-normal text-ink-secondary">
                  · {{ item.role }}</span
                >
              </h3>
              <p v-if="item.since" class="text-xs text-ink-tertiary">
                Member since {{ formatDate(item.since, locale) }}
              </p>
            </div>
            <p v-if="item.description" class="mt-1 text-sm leading-relaxed text-ink-secondary">
              {{ item.description }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </PortfolioSection>
</template>
