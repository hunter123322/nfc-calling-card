<script setup lang="ts">
import { computed, watch, type Component } from 'vue'
import { useRoute } from 'vue-router'
import type { PortfolioSectionId } from '@/types/portfolio'
import { usePortfolio } from '@/composables/usePortfolio'
import { useThemeStore } from '@/stores/theme'
import { getSectionOrder, hasContactData, hasSectionData } from '@/utils/portfolio-sections'
import { buildNotFoundSeo, buildPortfolioSeo } from '@/utils/portfolio-seo'
import { applySeoMetadata } from '@/utils/seo-dom'
import LoadingState from '@/components/shared/LoadingState.vue'
import ErrorState from '@/components/shared/ErrorState.vue'
import NotFound from '@/components/shared/NotFound.vue'
import PortfolioHeader from '@/components/portfolio/PortfolioHeader.vue'
import PortfolioIntroduction from '@/components/portfolio/PortfolioIntroduction.vue'
import PortfolioWorks from '@/components/portfolio/PortfolioWorks.vue'
import PortfolioExperience from '@/components/portfolio/PortfolioExperience.vue'
import PortfolioSkills from '@/components/portfolio/PortfolioSkills.vue'
import PortfolioEducation from '@/components/portfolio/PortfolioEducation.vue'
import PortfolioCertifications from '@/components/portfolio/PortfolioCertifications.vue'
import PortfolioPublications from '@/components/portfolio/PortfolioPublications.vue'
import PortfolioAwards from '@/components/portfolio/PortfolioAwards.vue'
import PortfolioServices from '@/components/portfolio/PortfolioServices.vue'
import PortfolioTestimonials from '@/components/portfolio/PortfolioTestimonials.vue'
import PortfolioInvolvement from '@/components/portfolio/PortfolioInvolvement.vue'
import PortfolioInterests from '@/components/portfolio/PortfolioInterests.vue'
import PortfolioContact from '@/components/portfolio/PortfolioContact.vue'
import PortfolioFooter from '@/components/portfolio/PortfolioFooter.vue'

const route = useRoute()
const slug = computed(() => String(route.params.username ?? ''))
const { portfolio, isLoading, notFound, hasError, errorMessage, retry } = usePortfolio(slug)
const theme = useThemeStore()

const SECTION_COMPONENTS: Record<PortfolioSectionId, Component> = {
  about: PortfolioIntroduction,
  works: PortfolioWorks,
  experience: PortfolioExperience,
  skills: PortfolioSkills,
  education: PortfolioEducation,
  certifications: PortfolioCertifications,
  publications: PortfolioPublications,
  awards: PortfolioAwards,
  services: PortfolioServices,
  testimonials: PortfolioTestimonials,
  involvement: PortfolioInvolvement,
  interests: PortfolioInterests,
}

const sections = computed(() => {
  const item = portfolio.value
  if (!item) return []
  return getSectionOrder(item).filter((section) => hasSectionData(item, section))
})

const showContact = computed(() => (portfolio.value ? hasContactData(portfolio.value) : false))

watch(
  portfolio,
  (item) => {
    if (!item) return
    applySeoMetadata(buildPortfolioSeo(item))
    theme.applyPortfolioHint(item.metadata.theme)
  },
  { immediate: true },
)

watch(
  [notFound, hasError],
  ([missing, error]) => {
    if (missing) applySeoMetadata(buildNotFoundSeo())
    if (error) {
      applySeoMetadata({
        ...buildNotFoundSeo(),
        title: 'Portfolio unavailable',
        ogTitle: 'Portfolio unavailable',
        description: 'This portfolio could not be loaded.',
        ogDescription: 'This portfolio could not be loaded.',
      })
    }
  },
  { immediate: true },
)
</script>

<template>
  <main id="main" class="mx-auto w-full max-w-5xl px-5 pt-8 pb-20 sm:px-8 sm:pt-12">
    <LoadingState v-if="isLoading" />

    <ErrorState
      v-else-if="hasError"
      title="This portfolio could not be loaded"
      :message="errorMessage"
      @retry="retry"
    />

    <NotFound v-else-if="notFound" />

    <article v-else-if="portfolio">
      <PortfolioHeader :portfolio="portfolio" />

      <div class="mt-12 space-y-10 sm:mt-14">
        <component
          :is="SECTION_COMPONENTS[section]"
          v-for="section in sections"
          :key="section"
          :portfolio="portfolio"
        />
        <PortfolioContact v-if="showContact" :portfolio="portfolio" />
      </div>

      <PortfolioFooter :portfolio="portfolio" />
    </article>

    <LoadingState v-else />
  </main>
</template>
