<script setup lang="ts">
import { computed } from 'vue'
import { GraduationCap } from 'lucide-vue-next'
import type { Portfolio } from '@/types/portfolio'
import PortfolioSection from './PortfolioSection.vue'
import {
  formatDate,
  formatDateRange,
  formatMeasurement,
  humanize,
  joinNonEmpty,
} from '@/utils/portfolio-formatter'

const props = defineProps<{ portfolio: Portfolio }>()

const items = computed(() => props.portfolio.education ?? [])
const student = computed(() => props.portfolio.studentProfile)
const locale = computed(() => props.portfolio.metadata.locale)

const expectedGraduation = computed(() => {
  const range = student.value?.expectedGraduation
  if (!range) return undefined
  const date = range.kind === 'range' ? range.end : range.start
  return formatDate(date, locale.value)
})

const studentMeta = computed(() =>
  joinNonEmpty([
    student.value?.school,
    student.value?.academicLevel ? humanize(student.value.academicLevel) : undefined,
    student.value?.gpa ? formatMeasurement(student.value.gpa) : undefined,
    expectedGraduation.value ? `Graduating ${expectedGraduation.value}` : undefined,
  ]),
)
</script>

<template>
  <PortfolioSection
    v-if="items.length > 0 || student"
    id="education"
    title="Education"
    :count="items.length || undefined"
  >
    <div v-if="student" class="surface-card mb-8 p-5 sm:p-6">
      <p class="eyebrow">Currently studying</p>
      <h3 class="mt-2 text-base font-semibold tracking-[-0.012em] text-ink">
        {{ student.program ?? student.school ?? 'Student' }}
      </h3>
      <p v-if="studentMeta" class="mt-1 text-sm text-ink-secondary">{{ studentMeta }}</p>

      <dl class="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        <div v-if="student.coursework && student.coursework.length > 0">
          <dt class="text-xs font-medium text-ink-tertiary">Coursework</dt>
          <dd class="mt-1 text-sm text-ink-secondary">{{ student.coursework.join(', ') }}</dd>
        </div>
        <div v-if="student.honors && student.honors.length > 0">
          <dt class="text-xs font-medium text-ink-tertiary">Honours</dt>
          <dd class="mt-1 text-sm text-ink-secondary">{{ student.honors.join(', ') }}</dd>
        </div>
        <div v-if="student.activities && student.activities.length > 0">
          <dt class="text-xs font-medium text-ink-tertiary">Activities</dt>
          <dd class="mt-1 text-sm text-ink-secondary">{{ student.activities.join(', ') }}</dd>
        </div>
      </dl>
    </div>

    <ul v-if="items.length > 0" class="space-y-6">
      <li
        v-for="(item, index) in items"
        :key="item.id ?? `${item.degree}-${index}`"
        class="flex gap-4"
      >
        <span
          class="grid size-9 shrink-0 place-items-center rounded-xl bg-chip text-ink-secondary"
          aria-hidden="true"
        >
          <GraduationCap class="size-4" />
        </span>
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 class="text-base font-semibold tracking-[-0.012em] text-ink">
              {{ item.degree }}
              <span v-if="item.fieldOfStudy" class="font-normal text-ink-secondary">
                · {{ item.fieldOfStudy }}
              </span>
            </h3>
            <p class="text-xs text-ink-tertiary">
              {{ formatDateRange(item.dateRange, locale) }}
            </p>
          </div>
          <p class="mt-1 text-sm text-ink-secondary">
            {{ item.institution.name }}
            <template v-if="item.grade"> · {{ formatMeasurement(item.grade) }}</template>
          </p>
          <ul v-if="item.highlights && item.highlights.length > 0" class="mt-2 space-y-1">
            <li
              v-for="highlight in item.highlights"
              :key="highlight"
              class="text-sm leading-relaxed text-ink-secondary"
            >
              {{ highlight }}
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </PortfolioSection>
</template>
