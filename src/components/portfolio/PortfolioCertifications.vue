<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight, BadgeCheck } from 'lucide-vue-next'
import type { Certification, Portfolio } from '@/types/portfolio'
import PortfolioSection from './PortfolioSection.vue'
import { formatDate } from '@/utils/portfolio-formatter'
import { toExternalHref } from '@/utils/url'

const props = defineProps<{ portfolio: Portfolio }>()

const items = computed(() => props.portfolio.certifications ?? [])
const locale = computed(() => props.portfolio.metadata.locale)

function verifyUrl(item: Certification): string | undefined {
  return toExternalHref(item.url)
}

function issuerUrl(item: Certification): string | undefined {
  return toExternalHref(item.issuer.url)
}
</script>

<template>
  <PortfolioSection
    v-if="items.length > 0"
    id="certifications"
    title="Certifications"
    :count="items.length"
  >
    <div class="grid gap-4 sm:grid-cols-2">
      <article
        v-for="item in items"
        :key="item.id ?? item.name"
        class="surface-card flex flex-col p-5"
      >
        <div class="flex items-start gap-3">
          <span
            class="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"
            aria-hidden="true"
          >
            <BadgeCheck class="size-4" />
          </span>
          <div class="min-w-0">
            <h3 class="text-sm font-semibold leading-snug tracking-[-0.01em] text-ink">
              {{ item.name }}
            </h3>
            <p class="mt-1 text-xs text-ink-tertiary">
              <a
                v-if="issuerUrl(item)"
                :href="issuerUrl(item)"
                target="_blank"
                rel="noopener noreferrer nofollow"
                class="underline decoration-hairline-strong underline-offset-2 hover:text-ink-secondary"
              >
                {{ item.issuer.name }}
              </a>
              <template v-else>{{ item.issuer.name }}</template>
              · {{ formatDate(item.issueDate, locale) }}
            </p>
          </div>
        </div>

        <p v-if="item.credentialId" class="mt-3 text-xs text-ink-tertiary">
          Credential {{ item.credentialId }}
        </p>

        <div v-if="item.skills && item.skills.length > 0" class="mt-3 flex flex-wrap gap-1.5">
          <span v-for="skill in item.skills" :key="skill" class="chip">{{ skill }}</span>
        </div>

        <a
          v-if="verifyUrl(item)"
          :href="verifyUrl(item)"
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="btn btn-ghost mt-4 -ml-2 self-start"
        >
          Verify credential
          <ArrowUpRight class="size-3.5" aria-hidden="true" />
        </a>
      </article>
    </div>
  </PortfolioSection>
</template>
