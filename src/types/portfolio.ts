/**
 * Portfolio schema.
 *
 * A portfolio document is a Markdown file whose YAML frontmatter matches this
 * interface. The schema is organised in 23 sections, mirroring the product
 * requirements. Every `.md` file in `public/userData/` is one portfolio.
 *
 * `schemaVersion` and `metadata.schemaVersion` exist so future versions can
 * migrate documents without breaking existing ones.
 */

/* -------------------------------------------------------------------------- */
/* 1. Scalar / utility types                                                   */
/* -------------------------------------------------------------------------- */

export type SchemaVersion = string
export type Slug = string
export type UrlString = string
export type EmailAddress = string
export type IsoDateString = string
export type IsoDateTimeString = string

/**
 * A discriminated union describing either a closed or an ongoing period.
 * Preserved as a union so consumers can narrow on `kind`.
 */
export type DateRange =
  | { kind: 'range'; start: IsoDateString; end: IsoDateString }
  | { kind: 'ongoing'; start: IsoDateString }

export type MeasurementScale = 'percent' | 'gpa-4' | 'gpa-5' | 'grade' | 'custom'

export interface Measurement {
  value: number
  scale: MeasurementScale
  outOf?: number
  label?: string
}

export interface Organization {
  name: string
  url?: UrlString
  industry?: string
}

export interface LabeledLink {
  label: string
  url: UrlString
}

/* -------------------------------------------------------------------------- */
/* 2. Profile classification                                                   */
/* -------------------------------------------------------------------------- */

export type ProfileType =
  | 'professional'
  | 'freelancer'
  | 'student'
  | 'creative'
  | 'researcher'
  | 'entrepreneur'
  | 'consultant'
  | 'academic'
  | 'technician'
  | 'job-seeker'

export type ProfileVisibility = 'public' | 'unlisted' | 'private'
export type ThemePreference = 'light' | 'dark' | 'system'

export type EmploymentType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'freelance'
  | 'internship'
  | 'apprenticeship'
  | 'volunteer'
  | 'self-employed'

export type AvailabilityStatus = 'available' | 'open' | 'employed' | 'unavailable'

export type AvailabilityType =
  'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship' | 'volunteer'

/* -------------------------------------------------------------------------- */
/* 3. Address                                                                  */
/* -------------------------------------------------------------------------- */

export interface Address {
  street?: string
  city?: string
  region?: string
  postalCode?: string
  country?: string
  countryCode?: string
  isRemote?: boolean
}

/* -------------------------------------------------------------------------- */
/* 4. Contact                                                                  */
/* -------------------------------------------------------------------------- */

export interface EmailContact {
  address: EmailAddress
  label?: string
  isPrimary?: boolean
}

export interface PhoneContact {
  number: string
  label?: string
  isPrimary?: boolean
}

export interface WebsiteContact {
  url: UrlString
  label?: string
}

export interface Contact {
  emails?: EmailContact[]
  phones?: PhoneContact[]
  websites?: WebsiteContact[]
  address?: Address
}

/* -------------------------------------------------------------------------- */
/* 5. Social & professional profiles                                           */
/* -------------------------------------------------------------------------- */

/** `string & {}` keeps autocomplete while tolerating future platforms. */
export type SocialPlatform =
  | 'GitHub'
  | 'GitLab'
  | 'LinkedIn'
  | 'X'
  | 'Instagram'
  | 'YouTube'
  | 'Dribbble'
  | 'Behance'
  | 'Facebook'
  | 'TikTok'
  | 'Mastodon'
  | 'Threads'
  | 'Medium'
  | 'Substack'
  | 'Dev.to'
  | 'CodePen'
  | 'Stack Overflow'
  | 'ResearchGate'
  | 'Google Scholar'
  | 'ORCID'
  | 'Website'
  | (string & {})

export type SocialCategory = 'professional' | 'creative' | 'academic' | 'personal'

export interface SocialProfile {
  platform: SocialPlatform
  url: UrlString
  handle?: string
  category?: SocialCategory
}

export interface SocialLinks {
  profiles: SocialProfile[]
}

/* -------------------------------------------------------------------------- */
/* 6. Professional summary & availability                                      */
/* -------------------------------------------------------------------------- */

export interface Availability {
  status: AvailabilityStatus
  type?: AvailabilityType[]
  remote?: boolean
  timezone?: string
  noticePeriod?: string
  startDate?: IsoDateString
  location?: Address
}

export interface ProfessionalSummary {
  headline: string
  introduction: string
  availability?: Availability
  highlights?: string[]
  keywords?: string[]
  yearsOfExperience?: number
}

/* -------------------------------------------------------------------------- */
/* 7. Work experience                                                          */
/* -------------------------------------------------------------------------- */

export interface WorkExperience {
  id?: string
  role: string
  organization: Organization
  employmentType?: EmploymentType
  dateRange: DateRange
  location?: Address
  summary?: string
  highlights?: string[]
  skills?: string[]
  url?: UrlString
}

/* -------------------------------------------------------------------------- */
/* 8. Education                                                                */
/* -------------------------------------------------------------------------- */

export interface Education {
  id?: string
  institution: Organization
  degree: string
  fieldOfStudy?: string
  dateRange: DateRange
  location?: Address
  grade?: Measurement
  highlights?: string[]
  url?: UrlString
}

/* -------------------------------------------------------------------------- */
/* 9. Skills                                                                   */
/* -------------------------------------------------------------------------- */

export type SkillCategory = 'technical' | 'tool' | 'soft' | 'language' | 'domain' | 'creative'

export type SkillProficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'native'

export interface Skill {
  name: string
  category: SkillCategory
  proficiency?: SkillProficiency
  yearsOfExperience?: number
  keywords?: string[]
}

export interface Skills {
  technical?: Skill[]
  tools?: Skill[]
  soft?: Skill[]
  languages?: Skill[]
  domain?: Skill[]
  creative?: Skill[]
}

/* -------------------------------------------------------------------------- */
/* 10. Portfolio works                                                         */
/* -------------------------------------------------------------------------- */

export type PortfolioWorkKind =
  | 'project'
  | 'case-study'
  | 'design'
  | 'artwork'
  | 'photography'
  | 'writing'
  | 'publication'
  | 'research'
  | 'talk'
  | 'video'
  | 'audio'
  | 'product'
  | 'service'
  | 'event'
  | 'course'
  | 'experiment'
  | 'other'

export type PortfolioWorkStatus = 'completed' | 'in-progress' | 'planned' | 'ongoing' | 'archived'

export type PortfolioMediaType = 'image' | 'video' | 'audio' | 'embed'

export interface PortfolioMedia {
  type: PortfolioMediaType
  url: UrlString
  altText?: string
  caption?: string
  posterUrl?: UrlString
  thumbnailUrl?: UrlString
  width?: number
  height?: number
}

export interface PortfolioWorkLinks {
  primary?: UrlString
  repository?: UrlString
  liveDemo?: UrlString
  external?: LabeledLink[]
}

export interface Collaborator {
  name: string
  role?: string
  url?: UrlString
}

export interface PortfolioWork {
  id: string
  slug: Slug
  kind: PortfolioWorkKind
  title: string
  subtitle?: string
  summary: string
  description?: string
  role?: string
  status?: PortfolioWorkStatus
  isFeatured?: boolean
  dateRange?: DateRange
  organizations?: Organization[]
  tags?: string[]
  skills?: string[]
  links?: PortfolioWorkLinks
  media?: PortfolioMedia[]
  outcomes?: string[]
  collaborators?: Collaborator[]
}

/* -------------------------------------------------------------------------- */
/* 11. Certifications                                                          */
/* -------------------------------------------------------------------------- */

export interface Certification {
  id?: string
  name: string
  issuer: Organization
  issueDate: IsoDateString
  expiryDate?: IsoDateString
  credentialId?: string
  url?: UrlString
  skills?: string[]
}

/* -------------------------------------------------------------------------- */
/* 12. Awards & honors                                                         */
/* -------------------------------------------------------------------------- */

export interface Award {
  id?: string
  title: string
  issuer?: Organization
  date: IsoDateString
  description?: string
  url?: UrlString
}

/* -------------------------------------------------------------------------- */
/* 13. Publications & speaking engagements                                     */
/* -------------------------------------------------------------------------- */

export type PublicationType =
  | 'article'
  | 'paper'
  | 'journal'
  | 'conference-paper'
  | 'book'
  | 'chapter'
  | 'preprint'
  | 'poster'
  | 'podcast'
  | 'report'
  | 'other'

export interface Publication {
  id?: string
  type: PublicationType
  title: string
  venue?: string
  publisher?: string
  date: IsoDateString
  authors?: string[]
  abstract?: string
  url?: UrlString
  doi?: string
  citations?: number
}

export type SpeakingType =
  'keynote' | 'talk' | 'panel' | 'workshop' | 'webinar' | 'lecture' | 'podcast' | 'other'

export interface SpeakingEngagement {
  id?: string
  title: string
  event: string
  type?: SpeakingType
  date: IsoDateString
  location?: Address
  url?: UrlString
  description?: string
}

/* -------------------------------------------------------------------------- */
/* 14. Volunteer experience                                                    */
/* -------------------------------------------------------------------------- */

export interface VolunteerExperience {
  id?: string
  role: string
  organization: Organization
  dateRange: DateRange
  location?: Address
  summary?: string
  highlights?: string[]
  url?: UrlString
}

/* -------------------------------------------------------------------------- */
/* 15. Involvements                                                            */
/* -------------------------------------------------------------------------- */

export interface Involvement {
  id?: string
  title: string
  organization?: Organization
  role?: string
  dateRange?: DateRange
  description?: string
  url?: UrlString
}

/* -------------------------------------------------------------------------- */
/* 16. Professional memberships                                                */
/* -------------------------------------------------------------------------- */

export interface ProfessionalMembership {
  id?: string
  organization: Organization
  role?: string
  since?: IsoDateString
  url?: UrlString
  description?: string
}

/* -------------------------------------------------------------------------- */
/* 17. Interests & hobbies                                                     */
/* -------------------------------------------------------------------------- */

export interface Interest {
  name: string
  category?: string
  description?: string
}

/* -------------------------------------------------------------------------- */
/* 18. Testimonials                                                            */
/* -------------------------------------------------------------------------- */

export interface Testimonial {
  id?: string
  quote: string
  authorName: string
  authorRole?: string
  authorOrganization?: string
  authorAvatarUrl?: UrlString
  date?: IsoDateString
  sourceUrl?: UrlString
}

/* -------------------------------------------------------------------------- */
/* 19. References                                                              */
/* -------------------------------------------------------------------------- */

export interface Reference {
  id?: string
  name: string
  role?: string
  organization?: string
  relationship?: string
  email?: EmailAddress
  phone?: string
  isAvailableOnRequest?: boolean
}

/* -------------------------------------------------------------------------- */
/* 20. Practice / business profile                                             */
/* -------------------------------------------------------------------------- */

export interface ServiceOffering {
  name: string
  description?: string
  priceLabel?: string
  url?: UrlString
  deliverables?: string[]
}

export interface PracticeProfile {
  businessName: string
  legalName?: string
  tagline?: string
  description?: string
  foundedYear?: number
  services?: ServiceOffering[]
  serviceArea?: string[]
  registrationNumber?: string
  url?: UrlString
  availability?: Availability
}

/* -------------------------------------------------------------------------- */
/* 21. Student profile                                                         */
/* -------------------------------------------------------------------------- */

export type AcademicLevel =
  'high-school' | 'undergraduate' | 'graduate' | 'postgraduate' | 'doctorate' | 'bootcamp' | 'other'

export interface StudentProfile {
  school?: string
  program?: string
  academicLevel?: AcademicLevel
  expectedGraduation?: DateRange
  gpa?: Measurement
  coursework?: string[]
  honors?: string[]
  activities?: string[]
}

/* -------------------------------------------------------------------------- */
/* 22. Work eligibility                                                        */
/* -------------------------------------------------------------------------- */

export interface WorkEligibility {
  authorizedCountries?: string[]
  requiresSponsorship?: boolean
  remote?: boolean
  relocation?: boolean
  visaStatus?: string
  notes?: string
}

/* -------------------------------------------------------------------------- */
/* 23. Metadata                                                                */
/* -------------------------------------------------------------------------- */

export interface PortfolioMetadata {
  schemaVersion: SchemaVersion
  lastUpdated: IsoDateTimeString
  locale: string
  theme: ThemePreference
  isPublished: boolean
  visibility: ProfileVisibility
  /** Absolute canonical URL. When set, it is used for canonical + Open Graph. */
  canonicalUrl?: UrlString
  keywords?: string[]
}

/* -------------------------------------------------------------------------- */
/* Root document                                                               */
/* -------------------------------------------------------------------------- */

export interface Portfolio {
  schemaVersion: SchemaVersion
  username: Slug

  firstName: string
  lastName?: string
  preferredName?: string
  pronouns?: string

  profileTypes?: ProfileType[]
  occupation: string[]
  industry?: string[]

  profileImageUrl?: UrlString
  coverImageUrl?: UrlString

  introduction?: string
  summary: ProfessionalSummary

  contact: Contact
  social?: SocialLinks

  skills?: Skills

  workExperience?: WorkExperience[]
  education?: Education[]
  portfolioWorks?: PortfolioWork[]

  certifications?: Certification[]
  awards?: Award[]
  publications?: Publication[]
  speakingEngagements?: SpeakingEngagement[]
  volunteerExperience?: VolunteerExperience[]
  involvements?: Involvement[]
  professionalMemberships?: ProfessionalMembership[]

  interests?: Interest[]
  testimonials?: Testimonial[]
  references?: Reference[]

  practice?: PracticeProfile
  studentProfile?: StudentProfile
  workEligibility?: WorkEligibility

  metadata: PortfolioMetadata

  /** Markdown body next to the frontmatter. Kept for future use. */
  body?: string
}

/* -------------------------------------------------------------------------- */
/* Derived helpers                                                             */
/* -------------------------------------------------------------------------- */

export type PortfolioSectionId =
  | 'about'
  | 'works'
  | 'experience'
  | 'skills'
  | 'education'
  | 'certifications'
  | 'publications'
  | 'awards'
  | 'services'
  | 'testimonials'
  | 'involvement'
  | 'interests'
