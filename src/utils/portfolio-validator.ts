import type {
  AcademicLevel,
  Address,
  Availability,
  AvailabilityStatus,
  AvailabilityType,
  Award,
  Certification,
  Collaborator,
  Contact,
  DateRange,
  Education,
  EmailContact,
  EmploymentType,
  Interest,
  Involvement,
  LabeledLink,
  Measurement,
  MeasurementScale,
  Organization,
  PhoneContact,
  Portfolio,
  PortfolioMedia,
  PortfolioMediaType,
  PortfolioMetadata,
  PortfolioWork,
  PortfolioWorkKind,
  PortfolioWorkStatus,
  PracticeProfile,
  ProfessionalMembership,
  ProfileType,
  ProfileVisibility,
  Publication,
  PublicationType,
  Reference,
  ServiceOffering,
  Skill,
  SkillCategory,
  SkillProficiency,
  Skills,
  SocialCategory,
  SocialLinks,
  SocialProfile,
  SpeakingEngagement,
  SpeakingType,
  StudentProfile,
  Testimonial,
  ThemePreference,
  VolunteerExperience,
  WebsiteContact,
  WorkEligibility,
  WorkExperience,
} from '../types/portfolio'
import { isSafeEmail, isSafePhoneNumber, toExternalHref, toMediaSrc } from './url'

export type IssueSeverity = 'error' | 'warning'

export interface PortfolioIssue {
  path: string
  message: string
  severity: IssueSeverity
}

export interface PortfolioValidationResult {
  valid: boolean
  issues: PortfolioIssue[]
  portfolio: Portfolio | null
}

interface ValidationContext {
  issues: PortfolioIssue[]
}

const PROFILE_TYPES: readonly ProfileType[] = [
  'professional',
  'freelancer',
  'student',
  'creative',
  'researcher',
  'entrepreneur',
  'consultant',
  'academic',
  'technician',
  'job-seeker',
]

const VISIBILITIES: readonly ProfileVisibility[] = ['public', 'unlisted', 'private']
const THEMES: readonly ThemePreference[] = ['light', 'dark', 'system']
const EMPLOYMENT_TYPES: readonly EmploymentType[] = [
  'full-time',
  'part-time',
  'contract',
  'freelance',
  'internship',
  'apprenticeship',
  'volunteer',
  'self-employed',
]
const AVAILABILITY_STATUSES: readonly AvailabilityStatus[] = [
  'available',
  'open',
  'employed',
  'unavailable',
]
const AVAILABILITY_TYPES: readonly AvailabilityType[] = [
  'full-time',
  'part-time',
  'contract',
  'freelance',
  'internship',
  'volunteer',
]
const SOCIAL_CATEGORIES: readonly SocialCategory[] = [
  'professional',
  'creative',
  'academic',
  'personal',
]
const SKILL_CATEGORIES: readonly SkillCategory[] = [
  'technical',
  'tool',
  'soft',
  'language',
  'domain',
  'creative',
]
const SKILL_PROFICIENCIES: readonly SkillProficiency[] = [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
  'native',
]
const WORK_KINDS: readonly PortfolioWorkKind[] = [
  'project',
  'case-study',
  'design',
  'artwork',
  'photography',
  'writing',
  'publication',
  'research',
  'talk',
  'video',
  'audio',
  'product',
  'service',
  'event',
  'course',
  'experiment',
  'other',
]
const WORK_STATUSES: readonly PortfolioWorkStatus[] = [
  'completed',
  'in-progress',
  'planned',
  'ongoing',
  'archived',
]
const MEDIA_TYPES: readonly PortfolioMediaType[] = ['image', 'video', 'audio', 'embed']
const PUBLICATION_TYPES: readonly PublicationType[] = [
  'article',
  'paper',
  'journal',
  'conference-paper',
  'book',
  'chapter',
  'preprint',
  'poster',
  'podcast',
  'report',
  'other',
]
const SPEAKING_TYPES: readonly SpeakingType[] = [
  'keynote',
  'talk',
  'panel',
  'workshop',
  'webinar',
  'lecture',
  'podcast',
  'other',
]
const ACADEMIC_LEVELS: readonly AcademicLevel[] = [
  'high-school',
  'undergraduate',
  'graduate',
  'postgraduate',
  'doctorate',
  'bootcamp',
  'other',
]
const MEASUREMENT_SCALES: readonly MeasurementScale[] = [
  'percent',
  'gpa-4',
  'gpa-5',
  'grade',
  'custom',
]

/* -------------------------------------------------------------------------- */
/* Primitive helpers                                                           */
/* -------------------------------------------------------------------------- */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Converts YAML dates (and nested structures) into plain JSON values. */
function toPlain(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString()
  if (Array.isArray(value)) return value.map(toPlain)
  if (isRecord(value)) {
    const result: Record<string, unknown> = {}
    for (const [key, entry] of Object.entries(value)) result[key] = toPlain(entry)
    return result
  }
  return value
}

function asString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function asText(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const result: string[] = []
  for (const entry of value) {
    const text = asString(entry)
    if (!text || seen.has(text)) continue
    seen.add(text)
    result.push(text)
  }
  return result
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

function asBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function oneOf<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim().toLowerCase().replace(/_/g, '-')
  return allowed.find((entry) => entry === normalized)
}

function warn(context: ValidationContext, path: string, message: string): void {
  context.issues.push({ path, message, severity: 'warning' })
}

function fail(context: ValidationContext, path: string, message: string): void {
  context.issues.push({ path, message, severity: 'error' })
}

/* -------------------------------------------------------------------------- */
/* Section parsers                                                             */
/* -------------------------------------------------------------------------- */

function parseAddress(value: unknown): Address | undefined {
  const record = value
  if (!isRecord(record)) return undefined
  const address: Address = {
    street: asString(record.street),
    city: asString(record.city),
    region: asString(record.region),
    postalCode: asString(record.postalCode),
    country: asString(record.country),
    countryCode: asString(record.countryCode),
    isRemote: asBoolean(record.isRemote),
  }
  return Object.values(address).some((entry) => entry !== undefined) ? address : undefined
}

function parseDateRange(value: unknown): DateRange | undefined {
  if (!isRecord(value)) return undefined
  const start = asString(value.start)
  if (!start) return undefined
  const end = asString(value.end)
  if (end) return { kind: 'range', start, end }
  return { kind: 'ongoing', start }
}

function parseOrganization(
  value: unknown,
  context: ValidationContext,
  path: string,
): Organization | undefined {
  if (!isRecord(value)) return undefined
  const name = asString(value.name)
  if (!name) {
    warn(context, `${path}.name`, 'Organization name is required and was ignored.')
    return undefined
  }
  const rawUrl = asString(value.url)
  const url = toExternalHref(rawUrl)
  if (rawUrl && !url) warn(context, `${path}.url`, 'Ignored an unsafe organization URL.')
  return { name, url, industry: asString(value.industry) }
}

function parseMeasurement(value: unknown): Measurement | undefined {
  if (!isRecord(value)) return undefined
  const numeric = asNumber(value.value)
  if (numeric === undefined) return undefined
  return {
    value: numeric,
    scale: oneOf(value.scale, MEASUREMENT_SCALES) ?? 'custom',
    outOf: asNumber(value.outOf),
    label: asString(value.label),
  }
}

function parseAvailability(value: unknown): Availability | undefined {
  if (!isRecord(value)) return undefined
  const status = oneOf(value.status, AVAILABILITY_STATUSES)
  if (!status) return undefined
  const types = asArray(value.type)
    .map((entry) => oneOf(entry, AVAILABILITY_TYPES))
    .filter((entry): entry is AvailabilityType => Boolean(entry))
  return {
    status,
    type: types.length > 0 ? [...new Set(types)] : undefined,
    remote: asBoolean(value.remote),
    timezone: asString(value.timezone),
    noticePeriod: asString(value.noticePeriod),
    startDate: asString(value.startDate),
    location: parseAddress(value.location),
  }
}

function parseContact(value: unknown, context: ValidationContext): Contact {
  const contact: Contact = {}
  if (!isRecord(value)) {
    fail(context, 'contact', 'A contact object is required.')
    return contact
  }

  const emails: EmailContact[] = []
  asArray(value.emails).forEach((entry, index) => {
    if (!isRecord(entry)) return
    const address = asString(entry.address)
    if (!isSafeEmail(address)) {
      warn(context, `contact.emails[${index}].address`, 'Ignored an invalid email address.')
      return
    }
    emails.push({
      address,
      label: asString(entry.label),
      isPrimary: asBoolean(entry.isPrimary),
    })
  })

  const phones: PhoneContact[] = []
  asArray(value.phones).forEach((entry, index) => {
    if (!isRecord(entry)) return
    const number = asString(entry.number)
    if (!isSafePhoneNumber(number)) {
      warn(context, `contact.phones[${index}].number`, 'Ignored an invalid phone number.')
      return
    }
    phones.push({
      number,
      label: asString(entry.label),
      isPrimary: asBoolean(entry.isPrimary),
    })
  })

  const websites: WebsiteContact[] = []
  asArray(value.websites).forEach((entry, index) => {
    if (!isRecord(entry)) return
    const rawUrl = asString(entry.url)
    const url = toExternalHref(rawUrl)
    if (!url) {
      warn(context, `contact.websites[${index}].url`, 'Ignored an unsafe website URL.')
      return
    }
    websites.push({ url, label: asString(entry.label) })
  })

  if (emails.length > 0) contact.emails = emails
  if (phones.length > 0) contact.phones = phones
  if (websites.length > 0) contact.websites = websites
  const address = parseAddress(value.address)
  if (address) contact.address = address
  return contact
}

function parseSocial(value: unknown, context: ValidationContext): SocialLinks | undefined {
  if (!isRecord(value)) return undefined
  const profiles: SocialProfile[] = []
  asArray(value.profiles).forEach((entry, index) => {
    if (!isRecord(entry)) return
    const platform = asString(entry.platform)
    const rawUrl = asString(entry.url)
    const url = toExternalHref(rawUrl)
    if (!platform || !url) {
      warn(
        context,
        `social.profiles[${index}]`,
        'Ignored a social profile without a platform or safe URL.',
      )
      return
    }
    profiles.push({
      platform,
      url,
      handle: asString(entry.handle),
      category: oneOf(entry.category, SOCIAL_CATEGORIES),
    })
  })
  return profiles.length > 0 ? { profiles } : undefined
}

function parseSkills(value: unknown, context: ValidationContext): Skills | undefined {
  if (!isRecord(value)) return undefined
  const groups: { key: keyof Skills; category: SkillCategory }[] = [
    { key: 'technical', category: 'technical' },
    { key: 'tools', category: 'tool' },
    { key: 'soft', category: 'soft' },
    { key: 'languages', category: 'language' },
    { key: 'domain', category: 'domain' },
    { key: 'creative', category: 'creative' },
  ]

  const skills: Skills = {}
  for (const group of groups) {
    const parsed: Skill[] = []
    asArray(value[group.key]).forEach((entry, index) => {
      if (!isRecord(entry)) return
      const name = asString(entry.name)
      if (!name) {
        warn(
          context,
          `skills.${group.key}[${index}].name`,
          'Skill name is required and was ignored.',
        )
        return
      }
      parsed.push({
        name,
        category: oneOf(entry.category, SKILL_CATEGORIES) ?? group.category,
        proficiency: oneOf(entry.proficiency, SKILL_PROFICIENCIES),
        yearsOfExperience: asNumber(entry.yearsOfExperience),
        keywords: asStringArray(entry.keywords),
      })
    })
    if (parsed.length > 0) skills[group.key] = parsed
  }

  return Object.keys(skills).length > 0 ? skills : undefined
}

function parseWorkExperience(
  value: unknown,
  context: ValidationContext,
): WorkExperience[] | undefined {
  const result: WorkExperience[] = []
  asArray(value).forEach((entry, index) => {
    if (!isRecord(entry)) return
    const role = asString(entry.role)
    const organization = parseOrganization(
      entry.organization,
      context,
      `workExperience[${index}].organization`,
    )
    const dateRange = parseDateRange(entry.dateRange)
    if (!role || !organization || !dateRange) {
      warn(
        context,
        `workExperience[${index}]`,
        'Ignored a role without a title, organization, or date range.',
      )
      return
    }
    result.push({
      id: asString(entry.id),
      role,
      organization,
      employmentType: oneOf(entry.employmentType, EMPLOYMENT_TYPES),
      dateRange,
      location: parseAddress(entry.location),
      summary: asText(entry.summary),
      highlights: asStringArray(entry.highlights),
      skills: asStringArray(entry.skills),
      url: toExternalHref(asString(entry.url)),
    })
  })
  return result.length > 0 ? result : undefined
}

function parseEducation(value: unknown, context: ValidationContext): Education[] | undefined {
  const result: Education[] = []
  asArray(value).forEach((entry, index) => {
    if (!isRecord(entry)) return
    const institution = parseOrganization(
      entry.institution,
      context,
      `education[${index}].institution`,
    )
    const degree = asString(entry.degree)
    const dateRange = parseDateRange(entry.dateRange)
    if (!institution || !degree || !dateRange) {
      warn(
        context,
        `education[${index}]`,
        'Ignored an education entry without a degree, school, or date range.',
      )
      return
    }
    result.push({
      id: asString(entry.id),
      institution,
      degree,
      fieldOfStudy: asString(entry.fieldOfStudy),
      dateRange,
      location: parseAddress(entry.location),
      grade: parseMeasurement(entry.grade),
      highlights: asStringArray(entry.highlights),
      url: toExternalHref(asString(entry.url)),
    })
  })
  return result.length > 0 ? result : undefined
}

function parseMedia(
  value: unknown,
  context: ValidationContext,
  path: string,
): PortfolioMedia | undefined {
  if (!isRecord(value)) return undefined
  const url = toMediaSrc(asString(value.url))
  if (!url) {
    warn(context, `${path}.url`, 'Ignored a media item with an unsafe URL.')
    return undefined
  }
  return {
    type: oneOf(value.type, MEDIA_TYPES) ?? 'image',
    url,
    altText: asString(value.altText),
    caption: asString(value.caption),
    posterUrl: toMediaSrc(asString(value.posterUrl)),
    thumbnailUrl: toMediaSrc(asString(value.thumbnailUrl)),
    width: asNumber(value.width),
    height: asNumber(value.height),
  }
}

function parseWorkLinks(value: unknown, context: ValidationContext, path: string) {
  if (!isRecord(value)) return undefined
  const external: LabeledLink[] = []
  asArray(value.external).forEach((entry, index) => {
    if (!isRecord(entry)) return
    const url = toExternalHref(asString(entry.url))
    if (!url) {
      warn(context, `${path}.external[${index}]`, 'Ignored an unsafe external link.')
      return
    }
    external.push({ label: asString(entry.label) ?? 'Open link', url })
  })
  const links = {
    primary: toExternalHref(asString(value.primary)),
    repository: toExternalHref(asString(value.repository)),
    liveDemo: toExternalHref(asString(value.liveDemo)),
    external: external.length > 0 ? external : undefined,
  }
  return Object.values(links).some((entry) => entry !== undefined) ? links : undefined
}

function parsePortfolioWorks(
  value: unknown,
  context: ValidationContext,
): PortfolioWork[] | undefined {
  const result: PortfolioWork[] = []
  asArray(value).forEach((entry, index) => {
    if (!isRecord(entry)) return
    const title = asString(entry.title)
    const summary = asText(entry.summary)
    const slug = asString(entry.slug) ?? (title ? normalizeUsername(title) : undefined)
    if (!title || !summary || !slug) {
      warn(context, `portfolioWorks[${index}]`, 'Ignored a work without a title, summary, or slug.')
      return
    }
    const rawKind = asString(entry.kind)
    const kind = oneOf(rawKind, WORK_KINDS) ?? 'other'
    if (rawKind && !oneOf(rawKind, WORK_KINDS)) {
      warn(
        context,
        `portfolioWorks[${index}].kind`,
        `Unknown work kind "${rawKind}" rendered as "other".`,
      )
    }

    const organizations = asArray(entry.organizations)
      .map((organization, organizationIndex) =>
        parseOrganization(
          organization,
          context,
          `portfolioWorks[${index}].organizations[${organizationIndex}]`,
        ),
      )
      .filter((organization): organization is Organization => Boolean(organization))

    const collaborators: Collaborator[] = []
    asArray(entry.collaborators).forEach((collaborator) => {
      if (!isRecord(collaborator)) return
      const name = asString(collaborator.name)
      if (!name) return
      collaborators.push({
        name,
        role: asString(collaborator.role),
        url: toExternalHref(asString(collaborator.url)),
      })
    })

    const media = asArray(entry.media)
      .map((item, mediaIndex) =>
        parseMedia(item, context, `portfolioWorks[${index}].media[${mediaIndex}]`),
      )
      .filter((item): item is PortfolioMedia => Boolean(item))

    result.push({
      id: asString(entry.id) ?? slug,
      slug,
      kind,
      title,
      subtitle: asString(entry.subtitle),
      summary,
      description: asText(entry.description),
      role: asString(entry.role),
      status: oneOf(entry.status, WORK_STATUSES),
      isFeatured: asBoolean(entry.isFeatured),
      dateRange: parseDateRange(entry.dateRange),
      organizations: organizations.length > 0 ? organizations : undefined,
      tags: asStringArray(entry.tags),
      skills: asStringArray(entry.skills),
      links: parseWorkLinks(entry.links, context, `portfolioWorks[${index}].links`),
      media: media.length > 0 ? media : undefined,
      outcomes: asStringArray(entry.outcomes),
      collaborators: collaborators.length > 0 ? collaborators : undefined,
    })
  })
  return result.length > 0 ? result : undefined
}

function parseCertifications(
  value: unknown,
  context: ValidationContext,
): Certification[] | undefined {
  const result: Certification[] = []
  asArray(value).forEach((entry, index) => {
    if (!isRecord(entry)) return
    const name = asString(entry.name)
    const issuer = parseOrganization(entry.issuer, context, `certifications[${index}].issuer`)
    const issueDate = asString(entry.issueDate)
    if (!name || !issuer || !issueDate) {
      warn(
        context,
        `certifications[${index}]`,
        'Ignored a certification without a name, issuer, or issue date.',
      )
      return
    }
    result.push({
      id: asString(entry.id),
      name,
      issuer,
      issueDate,
      expiryDate: asString(entry.expiryDate),
      credentialId: asString(entry.credentialId),
      url: toExternalHref(asString(entry.url)),
      skills: asStringArray(entry.skills),
    })
  })
  return result.length > 0 ? result : undefined
}

function parseAwards(value: unknown, context: ValidationContext): Award[] | undefined {
  const result: Award[] = []
  asArray(value).forEach((entry, index) => {
    if (!isRecord(entry)) return
    const title = asString(entry.title)
    const date = asString(entry.date)
    if (!title || !date) {
      warn(context, `awards[${index}]`, 'Ignored an award without a title or date.')
      return
    }
    result.push({
      id: asString(entry.id),
      title,
      issuer: parseOrganization(entry.issuer, context, `awards[${index}].issuer`),
      date,
      description: asText(entry.description),
      url: toExternalHref(asString(entry.url)),
    })
  })
  return result.length > 0 ? result : undefined
}

function parsePublications(value: unknown, context: ValidationContext): Publication[] | undefined {
  const result: Publication[] = []
  asArray(value).forEach((entry, index) => {
    if (!isRecord(entry)) return
    const title = asString(entry.title)
    const date = asString(entry.date)
    if (!title || !date) {
      warn(context, `publications[${index}]`, 'Ignored a publication without a title or date.')
      return
    }
    result.push({
      id: asString(entry.id),
      type: oneOf(entry.type, PUBLICATION_TYPES) ?? 'other',
      title,
      venue: asString(entry.venue),
      publisher: asString(entry.publisher),
      date,
      authors: asStringArray(entry.authors),
      abstract: asText(entry.abstract),
      url: toExternalHref(asString(entry.url)),
      doi: asString(entry.doi),
      citations: asNumber(entry.citations),
    })
  })
  return result.length > 0 ? result : undefined
}

function parseSpeakingEngagements(
  value: unknown,
  context: ValidationContext,
): SpeakingEngagement[] | undefined {
  const result: SpeakingEngagement[] = []
  asArray(value).forEach((entry, index) => {
    if (!isRecord(entry)) return
    const title = asString(entry.title)
    const event = asString(entry.event)
    const date = asString(entry.date)
    if (!title || !event || !date) {
      warn(
        context,
        `speakingEngagements[${index}]`,
        'Ignored a talk without a title, event, or date.',
      )
      return
    }
    result.push({
      id: asString(entry.id),
      title,
      event,
      type: oneOf(entry.type, SPEAKING_TYPES),
      date,
      location: parseAddress(entry.location),
      url: toExternalHref(asString(entry.url)),
      description: asText(entry.description),
    })
  })
  return result.length > 0 ? result : undefined
}

function parseVolunteerExperience(
  value: unknown,
  context: ValidationContext,
): VolunteerExperience[] | undefined {
  const result: VolunteerExperience[] = []
  asArray(value).forEach((entry, index) => {
    if (!isRecord(entry)) return
    const role = asString(entry.role)
    const organization = parseOrganization(
      entry.organization,
      context,
      `volunteerExperience[${index}].organization`,
    )
    const dateRange = parseDateRange(entry.dateRange)
    if (!role || !organization || !dateRange) {
      warn(
        context,
        `volunteerExperience[${index}]`,
        'Ignored a volunteer role without a title, organization, or date range.',
      )
      return
    }
    result.push({
      id: asString(entry.id),
      role,
      organization,
      dateRange,
      location: parseAddress(entry.location),
      summary: asText(entry.summary),
      highlights: asStringArray(entry.highlights),
      url: toExternalHref(asString(entry.url)),
    })
  })
  return result.length > 0 ? result : undefined
}

function parseInvolvements(value: unknown, context: ValidationContext): Involvement[] | undefined {
  const result: Involvement[] = []
  asArray(value).forEach((entry, index) => {
    if (!isRecord(entry)) return
    const title = asString(entry.title)
    if (!title) {
      warn(context, `involvements[${index}].title`, 'Ignored an involvement without a title.')
      return
    }
    result.push({
      id: asString(entry.id),
      title,
      organization: parseOrganization(
        entry.organization,
        context,
        `involvements[${index}].organization`,
      ),
      role: asString(entry.role),
      dateRange: parseDateRange(entry.dateRange),
      description: asText(entry.description),
      url: toExternalHref(asString(entry.url)),
    })
  })
  return result.length > 0 ? result : undefined
}

function parseProfessionalMemberships(
  value: unknown,
  context: ValidationContext,
): ProfessionalMembership[] | undefined {
  const result: ProfessionalMembership[] = []
  asArray(value).forEach((entry, index) => {
    if (!isRecord(entry)) return
    const organization = parseOrganization(
      entry.organization,
      context,
      `professionalMemberships[${index}].organization`,
    )
    if (!organization) {
      warn(
        context,
        `professionalMemberships[${index}]`,
        'Ignored a membership without an organization.',
      )
      return
    }
    result.push({
      id: asString(entry.id),
      organization,
      role: asString(entry.role),
      since: asString(entry.since),
      url: toExternalHref(asString(entry.url)),
      description: asText(entry.description),
    })
  })
  return result.length > 0 ? result : undefined
}

function parseInterests(value: unknown): Interest[] | undefined {
  const result: Interest[] = []
  asArray(value).forEach((entry) => {
    if (typeof entry === 'string') {
      const name = asString(entry)
      if (name) result.push({ name })
      return
    }
    if (!isRecord(entry)) return
    const name = asString(entry.name)
    if (!name) return
    result.push({
      name,
      category: asString(entry.category),
      description: asText(entry.description),
    })
  })
  return result.length > 0 ? result : undefined
}

function parseTestimonials(value: unknown, context: ValidationContext): Testimonial[] | undefined {
  const result: Testimonial[] = []
  asArray(value).forEach((entry, index) => {
    if (!isRecord(entry)) return
    const quote = asText(entry.quote)
    const authorName = asString(entry.authorName)
    if (!quote || !authorName) {
      warn(context, `testimonials[${index}]`, 'Ignored a testimonial without a quote or author.')
      return
    }
    result.push({
      id: asString(entry.id),
      quote,
      authorName,
      authorRole: asString(entry.authorRole),
      authorOrganization: asString(entry.authorOrganization),
      authorAvatarUrl: toMediaSrc(asString(entry.authorAvatarUrl)),
      date: asString(entry.date),
      sourceUrl: toExternalHref(asString(entry.sourceUrl)),
    })
  })
  return result.length > 0 ? result : undefined
}

function parseReferences(value: unknown, context: ValidationContext): Reference[] | undefined {
  const result: Reference[] = []
  asArray(value).forEach((entry, index) => {
    if (!isRecord(entry)) return
    const name = asString(entry.name)
    if (!name) {
      warn(context, `references[${index}].name`, 'Ignored a reference without a name.')
      return
    }
    const email = asString(entry.email)
    const phone = asString(entry.phone)
    result.push({
      id: asString(entry.id),
      name,
      role: asString(entry.role),
      organization: asString(entry.organization),
      relationship: asString(entry.relationship),
      email: isSafeEmail(email) ? email : undefined,
      phone: isSafePhoneNumber(phone) ? phone : undefined,
      isAvailableOnRequest: asBoolean(entry.isAvailableOnRequest),
    })
  })
  return result.length > 0 ? result : undefined
}

function parsePractice(value: unknown, context: ValidationContext): PracticeProfile | undefined {
  if (!isRecord(value)) return undefined
  const businessName = asString(value.businessName)
  if (!businessName) {
    warn(context, 'practice.businessName', 'Ignored a practice profile without a business name.')
    return undefined
  }
  const services: ServiceOffering[] = []
  asArray(value.services).forEach((entry, index) => {
    if (!isRecord(entry)) return
    const name = asString(entry.name)
    if (!name) {
      warn(context, `practice.services[${index}].name`, 'Ignored a service without a name.')
      return
    }
    services.push({
      name,
      description: asText(entry.description),
      priceLabel: asString(entry.priceLabel),
      url: toExternalHref(asString(entry.url)),
      deliverables: asStringArray(entry.deliverables),
    })
  })
  return {
    businessName,
    legalName: asString(value.legalName),
    tagline: asString(value.tagline),
    description: asText(value.description),
    foundedYear: asNumber(value.foundedYear),
    services: services.length > 0 ? services : undefined,
    serviceArea: asStringArray(value.serviceArea),
    registrationNumber: asString(value.registrationNumber),
    url: toExternalHref(asString(value.url)),
    availability: parseAvailability(value.availability),
  }
}

function parseStudentProfile(value: unknown): StudentProfile | undefined {
  if (!isRecord(value)) return undefined
  const profile: StudentProfile = {
    school: asString(value.school),
    program: asString(value.program),
    academicLevel: oneOf(value.academicLevel, ACADEMIC_LEVELS),
    expectedGraduation: parseDateRange(value.expectedGraduation),
    gpa: parseMeasurement(value.gpa),
    coursework: asStringArray(value.coursework),
    honors: asStringArray(value.honors),
    activities: asStringArray(value.activities),
  }
  return Object.values(profile).some((entry) => entry !== undefined) ? profile : undefined
}

function parseWorkEligibility(value: unknown): WorkEligibility | undefined {
  if (!isRecord(value)) return undefined
  const eligibility: WorkEligibility = {
    authorizedCountries: asStringArray(value.authorizedCountries),
    requiresSponsorship: asBoolean(value.requiresSponsorship),
    remote: asBoolean(value.remote),
    relocation: asBoolean(value.relocation),
    visaStatus: asString(value.visaStatus),
    notes: asText(value.notes),
  }
  return Object.values(eligibility).some((entry) => entry !== undefined) ? eligibility : undefined
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                  */
/* -------------------------------------------------------------------------- */

export function normalizeUsername(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** A portfolio can be rendered by URL: published, not private. Unlisted stays reachable. */
export function isPubliclyRenderable(portfolio: Portfolio): boolean {
  return portfolio.metadata.isPublished && portfolio.metadata.visibility !== 'private'
}

/**
 * Validates and normalises untrusted frontmatter.
 *
 * Core identity fields produce errors (the document is rejected). Problems in
 * optional sections produce warnings and drop only the offending entry, so one
 * bad project cannot take down an entire portfolio.
 */
export function validatePortfolio(raw: unknown, expectedSlug?: string): PortfolioValidationResult {
  const context: ValidationContext = { issues: [] }

  if (!isRecord(raw)) {
    fail(context, 'document', 'Portfolio frontmatter must be a YAML mapping.')
    return { valid: false, issues: context.issues, portfolio: null }
  }

  const data = toPlain(raw)
  if (!isRecord(data)) {
    fail(context, 'document', 'Portfolio frontmatter must be a YAML mapping.')
    return { valid: false, issues: context.issues, portfolio: null }
  }

  const schemaVersion = asString(data.schemaVersion)
  if (!schemaVersion) fail(context, 'schemaVersion', 'schemaVersion is required.')

  const rawUsername = asString(data.username)
  if (!rawUsername) fail(context, 'username', 'username is required.')
  const username = rawUsername ? normalizeUsername(rawUsername) : ''
  if (username && rawUsername && rawUsername !== username) {
    warn(context, 'username', `username was normalised to "${username}".`)
  }
  if (username && expectedSlug && username !== normalizeUsername(expectedSlug)) {
    fail(
      context,
      'username',
      `username must match the file name ("${normalizeUsername(expectedSlug)}").`,
    )
  }

  const firstName = asString(data.firstName)
  if (!firstName) fail(context, 'firstName', 'firstName is required.')

  const occupation = asStringArray(data.occupation)
  if (occupation.length === 0) fail(context, 'occupation', 'At least one occupation is required.')

  const profileTypes: ProfileType[] = []
  asArray(data.profileTypes).forEach((entry, index) => {
    const profileType = oneOf(entry, PROFILE_TYPES)
    if (!profileType) {
      warn(context, `profileTypes[${index}]`, 'Unknown profile type was ignored.')
      return
    }
    if (!profileTypes.includes(profileType)) profileTypes.push(profileType)
  })

  const summarySource = data.summary
  const summaryRecord = isRecord(summarySource) ? summarySource : undefined
  if (!summaryRecord) fail(context, 'summary', 'A professional summary is required.')
  const headline = asString(summaryRecord?.headline)
  if (!headline) fail(context, 'summary.headline', 'summary.headline is required.')
  const summaryIntroduction = asText(summaryRecord?.introduction)
  if (!summaryIntroduction)
    fail(context, 'summary.introduction', 'summary.introduction is required.')

  const metadataRecord = isRecord(data.metadata) ? data.metadata : undefined
  if (!metadataRecord) fail(context, 'metadata', 'A metadata section is required.')

  const metadataSchemaVersion = asString(metadataRecord?.schemaVersion)
  if (metadataSchemaVersion && schemaVersion && metadataSchemaVersion !== schemaVersion) {
    warn(
      context,
      'metadata.schemaVersion',
      'metadata.schemaVersion differs from the document schemaVersion.',
    )
  }
  const lastUpdated = asString(metadataRecord?.lastUpdated)
  if (!lastUpdated) fail(context, 'metadata.lastUpdated', 'metadata.lastUpdated is required.')
  else if (Number.isNaN(new Date(lastUpdated).getTime())) {
    warn(context, 'metadata.lastUpdated', 'metadata.lastUpdated is not a valid date.')
  }
  const locale = asString(metadataRecord?.locale)
  if (!locale) fail(context, 'metadata.locale', 'metadata.locale is required.')
  const theme = oneOf(metadataRecord?.theme, THEMES)
  if (!theme) fail(context, 'metadata.theme', 'metadata.theme must be light, dark, or system.')
  const isPublished = asBoolean(metadataRecord?.isPublished)
  if (isPublished === undefined)
    fail(context, 'metadata.isPublished', 'metadata.isPublished is required.')
  const visibility = oneOf(metadataRecord?.visibility, VISIBILITIES)
  if (!visibility)
    fail(
      context,
      'metadata.visibility',
      'metadata.visibility must be public, unlisted, or private.',
    )
  const rawCanonical = asString(metadataRecord?.canonicalUrl)
  const canonicalUrl = toExternalHref(rawCanonical)
  if (rawCanonical && !canonicalUrl)
    warn(context, 'metadata.canonicalUrl', 'Ignored an unsafe canonical URL.')

  const metadata: PortfolioMetadata = {
    schemaVersion: metadataSchemaVersion ?? schemaVersion ?? '1.0.0',
    lastUpdated: lastUpdated ?? '',
    locale: locale ?? 'en',
    theme: theme ?? 'system',
    isPublished: isPublished ?? false,
    visibility: visibility ?? 'private',
    canonicalUrl,
    keywords: asStringArray(metadataRecord?.keywords),
  }

  const contact = parseContact(data.contact, context)

  const errors = context.issues.some((issue) => issue.severity === 'error')
  if (errors || !schemaVersion || !username || !firstName || !headline || !summaryIntroduction) {
    return { valid: false, issues: context.issues, portfolio: null }
  }

  const availability = parseAvailability(summaryRecord?.availability)
  const portfolio: Portfolio = {
    schemaVersion,
    username,
    firstName,
    lastName: asString(data.lastName),
    preferredName: asString(data.preferredName),
    pronouns: asString(data.pronouns),
    profileTypes: profileTypes.length > 0 ? profileTypes : undefined,
    occupation,
    industry: asStringArray(data.industry),
    profileImageUrl: toMediaSrc(asString(data.profileImageUrl)),
    coverImageUrl: toMediaSrc(asString(data.coverImageUrl)),
    introduction: asText(data.introduction),
    summary: {
      headline,
      introduction: summaryIntroduction,
      availability,
      highlights: asStringArray(summaryRecord?.highlights),
      keywords: asStringArray(summaryRecord?.keywords),
      yearsOfExperience: asNumber(summaryRecord?.yearsOfExperience),
    },
    contact,
    social: parseSocial(data.social, context),
    skills: parseSkills(data.skills, context),
    workExperience: parseWorkExperience(data.workExperience, context),
    education: parseEducation(data.education, context),
    portfolioWorks: parsePortfolioWorks(data.portfolioWorks, context),
    certifications: parseCertifications(data.certifications, context),
    awards: parseAwards(data.awards, context),
    publications: parsePublications(data.publications, context),
    speakingEngagements: parseSpeakingEngagements(data.speakingEngagements, context),
    volunteerExperience: parseVolunteerExperience(data.volunteerExperience, context),
    involvements: parseInvolvements(data.involvements, context),
    professionalMemberships: parseProfessionalMemberships(data.professionalMemberships, context),
    interests: parseInterests(data.interests),
    testimonials: parseTestimonials(data.testimonials, context),
    references: parseReferences(data.references, context),
    practice: parsePractice(data.practice, context),
    studentProfile: parseStudentProfile(data.studentProfile),
    workEligibility: parseWorkEligibility(data.workEligibility),
    metadata,
  }

  // Drop keys that ended up empty so optional UI sections never render.
  if (portfolio.industry?.length === 0) delete portfolio.industry

  return { valid: true, issues: context.issues, portfolio }
}
