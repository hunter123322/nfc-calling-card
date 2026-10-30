import type { Portfolio, PortfolioSectionId, ProfileType } from '../types/portfolio'
import { hasEntries } from './portfolio-formatter'

const DEFAULT_ORDER: PortfolioSectionId[] = [
  'about',
  'works',
  'experience',
  'skills',
  'education',
  'certifications',
  'publications',
  'awards',
  'services',
  'testimonials',
  'involvement',
  'interests',
]

/**
 * Section priority per profile type. The first profile type that has an entry
 * decides the order; unknown or missing types fall back to the professional
 * order. Sections without data are filtered out afterwards.
 */
const PROFILE_ORDERS: Partial<Record<ProfileType, PortfolioSectionId[]>> = {
  professional: [
    'about',
    'experience',
    'works',
    'skills',
    'education',
    'certifications',
    'awards',
    'publications',
    'services',
    'testimonials',
    'involvement',
    'interests',
  ],
  freelancer: [
    'about',
    'services',
    'works',
    'skills',
    'experience',
    'testimonials',
    'education',
    'certifications',
    'awards',
    'publications',
    'involvement',
    'interests',
  ],
  student: [
    'about',
    'education',
    'works',
    'skills',
    'experience',
    'awards',
    'certifications',
    'publications',
    'involvement',
    'interests',
    'testimonials',
    'services',
  ],
  creative: [
    'about',
    'works',
    'experience',
    'skills',
    'testimonials',
    'education',
    'services',
    'awards',
    'publications',
    'involvement',
    'interests',
    'certifications',
  ],
  researcher: [
    'about',
    'publications',
    'education',
    'works',
    'experience',
    'awards',
    'skills',
    'certifications',
    'involvement',
    'testimonials',
    'interests',
    'services',
  ],
  academic: [
    'about',
    'publications',
    'education',
    'experience',
    'awards',
    'works',
    'skills',
    'certifications',
    'involvement',
    'testimonials',
    'interests',
    'services',
  ],
  entrepreneur: [
    'about',
    'services',
    'works',
    'experience',
    'skills',
    'testimonials',
    'education',
    'awards',
    'publications',
    'certifications',
    'involvement',
    'interests',
  ],
  consultant: [
    'about',
    'services',
    'experience',
    'works',
    'skills',
    'testimonials',
    'certifications',
    'education',
    'awards',
    'publications',
    'involvement',
    'interests',
  ],
  technician: [
    'about',
    'skills',
    'experience',
    'works',
    'certifications',
    'education',
    'awards',
    'services',
    'testimonials',
    'involvement',
    'publications',
    'interests',
  ],
  'job-seeker': [
    'about',
    'experience',
    'skills',
    'education',
    'works',
    'certifications',
    'awards',
    'services',
    'testimonials',
    'publications',
    'involvement',
    'interests',
  ],
}

export function getSectionOrder(portfolio: Portfolio): PortfolioSectionId[] {
  const primary = portfolio.profileTypes?.find((type) => PROFILE_ORDERS[type])
  const preferred = primary ? (PROFILE_ORDERS[primary] ?? DEFAULT_ORDER) : DEFAULT_ORDER
  const remaining = DEFAULT_ORDER.filter((section) => !preferred.includes(section))
  return [...preferred, ...remaining]
}

export function hasSectionData(portfolio: Portfolio, section: PortfolioSectionId): boolean {
  switch (section) {
    case 'about':
      return Boolean(portfolio.summary.introduction || portfolio.introduction)
    case 'works':
      return hasEntries(portfolio.portfolioWorks)
    case 'experience':
      return hasEntries(portfolio.workExperience)
    case 'skills':
      return Boolean(
        portfolio.skills && Object.values(portfolio.skills).some((group) => hasEntries(group)),
      )
    case 'education':
      return hasEntries(portfolio.education) || Boolean(portfolio.studentProfile)
    case 'certifications':
      return hasEntries(portfolio.certifications)
    case 'publications':
      return hasEntries(portfolio.publications) || hasEntries(portfolio.speakingEngagements)
    case 'awards':
      return hasEntries(portfolio.awards)
    case 'services':
      return Boolean(portfolio.practice) || Boolean(portfolio.workEligibility)
    case 'testimonials':
      return hasEntries(portfolio.testimonials)
    case 'involvement':
      return (
        hasEntries(portfolio.volunteerExperience) ||
        hasEntries(portfolio.involvements) ||
        hasEntries(portfolio.professionalMemberships)
      )
    case 'interests':
      return hasEntries(portfolio.interests)
    default:
      return false
  }
}

export function hasContactData(portfolio: Portfolio): boolean {
  const contact = portfolio.contact
  return (
    hasEntries(contact.emails) ||
    hasEntries(contact.phones) ||
    hasEntries(contact.websites) ||
    Boolean(contact.address) ||
    hasEntries(portfolio.social?.profiles)
  )
}
