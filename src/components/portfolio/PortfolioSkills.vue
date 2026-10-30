<script setup lang="ts">
import { computed } from 'vue'
import type { Portfolio, Skill, Skills } from '@/types/portfolio'
import PortfolioSection from './PortfolioSection.vue'
import { humanize } from '@/utils/portfolio-formatter'

const props = defineProps<{ portfolio: Portfolio }>()

const GROUPS: { key: keyof Skills; label: string }[] = [
  { key: 'technical', label: 'Technical' },
  { key: 'tools', label: 'Tools' },
  { key: 'creative', label: 'Creative' },
  { key: 'domain', label: 'Domain' },
  { key: 'languages', label: 'Languages' },
  { key: 'soft', label: 'Ways of working' },
]

const groups = computed(() =>
  GROUPS.map((group) => ({
    label: group.label,
    skills: (props.portfolio.skills?.[group.key] ?? []) as Skill[],
  })).filter((group) => group.skills.length > 0),
)

const total = computed(() => groups.value.reduce((sum, group) => sum + group.skills.length, 0))
</script>

<template>
  <PortfolioSection v-if="groups.length > 0" id="skills" title="Skills" :count="total">
    <div class="space-y-6">
      <div v-for="group in groups" :key="group.label">
        <p class="text-xs font-medium tracking-[0.02em] text-ink-tertiary">{{ group.label }}</p>
        <div class="mt-2.5 flex flex-wrap gap-2">
          <span v-for="skill in group.skills" :key="skill.name" class="chip">
            {{ skill.name }}
            <span v-if="skill.proficiency" class="text-[0.68rem] text-ink-tertiary">
              · {{ humanize(skill.proficiency) }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </PortfolioSection>
</template>
