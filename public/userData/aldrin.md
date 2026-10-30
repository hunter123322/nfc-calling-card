---
schemaVersion: '1.0.0'
username: aldrin

firstName: Aldrin
lastName: Belardo
preferredName: Aldrin
pronouns: he/him

profileTypes:
  - freelancer
  - professional

occupation:
  - Full-Stack Developer
  - SEO Specialist
industry:
  - Technology
  - Software Development

profileImageUrl: /assets/portfolios/aldrin/profile.svg

introduction: >
  Building practical web applications and automated business solutions that
  people can actually use.

summary:
  headline: Full-Stack Developer
  introduction: >
    Software developer specialising in Vue, TypeScript, and Node.js. I build
    fast, accessible product interfaces and the data pipelines behind them,
    with a focus on measurable business outcomes.
  yearsOfExperience: 6
  highlights:
    - Shipped 20+ production applications for clients in four countries.
    - Cut a client's largest page bundle by 62% without losing features.
    - Built an automated reporting pipeline that saves 15 hours per month.
  availability:
    status: available
    type:
      - freelance
      - contract
    remote: true
    timezone: Asia/Manila
    noticePeriod: 2 weeks

contact:
  emails:
    - address: aldrin@example.com
      label: work
      isPrimary: true
  phones:
    - number: '+63 917 555 0142'
      label: mobile
  websites:
    - url: https://aldrin.example.com
      label: Personal website
  address:
    city: Cebu City
    region: Cebu
    country: Philippines
    countryCode: PH

social:
  profiles:
    - platform: GitHub
      url: https://github.com/example-aldrin
      handle: example-aldrin
      category: professional
    - platform: LinkedIn
      url: https://www.linkedin.com/in/example-aldrin
      category: professional
    - platform: X
      url: https://x.com/example_aldrin
      category: personal

skills:
  technical:
    - name: Vue
      category: technical
      proficiency: expert
      yearsOfExperience: 5
    - name: TypeScript
      category: technical
      proficiency: advanced
      yearsOfExperience: 4
    - name: Node.js
      category: technical
      proficiency: advanced
      yearsOfExperience: 6
    - name: PostgreSQL
      category: technical
      proficiency: intermediate
    - name: CSS
      category: technical
      proficiency: expert
  tools:
    - name: Git
      category: tool
    - name: Docker
      category: tool
    - name: Vite
      category: tool
    - name: Figma
      category: tool
  soft:
    - name: Communication
      category: soft
    - name: Mentoring
      category: soft
  languages:
    - name: English
      category: language
      proficiency: native
    - name: Filipino
      category: language
      proficiency: native

workExperience:
  - id: work-001
    role: Senior Full-Stack Developer
    organization:
      name: Northwind Studio
      url: https://example.com/northwind
      industry: Digital agency
    employmentType: full-time
    dateRange:
      kind: ongoing
      start: '2024-10-01'
    location:
      city: Cebu City
      country: Philippines
      isRemote: true
    summary: Lead developer for client web platforms and internal tooling.
    highlights:
      - Rebuilt the design system used by six client products.
      - Introduced end-to-end tests that reduced release regressions by 40%.
      - Mentored two junior developers through their first production launches.
    skills:
      - Vue
      - TypeScript
      - Node.js
  - id: work-002
    role: Web Developer
    organization:
      name: Brightline Digital
      industry: Marketing technology
    employmentType: full-time
    dateRange:
      kind: range
      start: '2021-03-01'
      end: '2024-09-30'
    location:
      city: Cebu City
      country: Philippines
    summary: Built marketing sites and analytics dashboards for regional brands.
    highlights:
      - Migrated 14 legacy sites to a shared Vue component library.
      - Raised average Lighthouse performance from 61 to 94.
    skills:
      - Vue
      - SEO
      - Analytics

education:
  - id: education-001
    institution:
      name: University of San Carlos
      url: https://example.com/usc
    degree: BS Computer Science
    fieldOfStudy: Computer Science
    dateRange:
      kind: range
      start: '2015-06-01'
      end: '2019-03-31'
    location:
      city: Cebu City
      country: Philippines
    grade:
      value: 1.6
      scale: gpa-5
      label: Cumulative
    highlights:
      - Dean's Lister, four consecutive semesters.

portfolioWorks:
  - id: project-001
    slug: atlas-analytics
    kind: case-study
    title: Atlas Analytics
    subtitle: Client reporting, rebuilt around the questions people actually ask.
    summary: A self-serve analytics workspace that replaced 40+ manual client reports.
    role: Lead developer and product designer
    status: completed
    isFeatured: true
    dateRange:
      kind: range
      start: '2025-01-10'
      end: '2025-04-18'
    tags:
      - Product design
      - Data visualisation
    skills:
      - Vue
      - TypeScript
      - PostgreSQL
    links:
      primary: https://example.com/work/atlas
      liveDemo: https://example.com/atlas-demo
      repository: https://github.com/example-aldrin/atlas
    media:
      - type: image
        url: /assets/portfolios/aldrin/work-atlas.svg
        altText: Atlas Analytics dashboard preview
      - type: image
        url: /assets/portfolios/aldrin/work-atlas-2.svg
        altText: Atlas Analytics report builder
    outcomes:
      - Replace 40+ monthly client reports with one shared dashboard.
      - Reduce reporting turnaround from five days to under an hour.

  - id: project-002
    slug: ledger-sync
    kind: project
    title: Ledger Sync
    summary: A small tool that reconciles payments between two accounting systems.
    role: Independent developer
    status: ongoing
    isFeatured: true
    dateRange:
      kind: ongoing
      start: '2025-02-01'
    tags:
      - Automation
      - Finance
    links:
      primary: https://example.com/work/ledger-sync
      repository: https://github.com/example-aldrin/ledger-sync
    media:
      - type: image
        url: /assets/portfolios/aldrin/work-ledger.svg
        altText: Ledger Sync interface
    outcomes:
      - Saves an estimated 15 hours of manual reconciliation each month.

  - id: project-003
    slug: schema-notes
    kind: writing
    title: Schema Notes
    summary: A compact reference for modelling content without a database.
    status: completed
    tags:
      - Writing
      - Documentation
    links:
      primary: https://example.com/writing/schema-notes
    media:
      - type: image
        url: /assets/portfolios/aldrin/work-schema.svg
        altText: Schema Notes cover

certifications:
  - id: cert-001
    name: AWS Certified Developer — Associate
    issuer:
      name: Amazon Web Services
      url: https://aws.amazon.com
    issueDate: '2024-02-14'
    credentialId: AWS-DEV-000123
    url: https://www.credly.com
    skills:
      - AWS
      - Serverless
  - id: cert-002
    name: Professional Scrum Master I
    issuer:
      name: Scrum.org
      url: https://www.scrum.org
    issueDate: '2022-08-05'

awards:
  - id: award-001
    title: Client Choice Award
    issuer:
      name: Northwind Studio
    date: '2025-06-12'
    description: Recognised for the Atlas Analytics engagement.

volunteerExperience:
  - id: volunteer-001
    role: Mentor
    organization:
      name: Cebu Developers Community
      url: https://example.com/cebu-dev
    dateRange:
      kind: ongoing
      start: '2023-01-01'
    highlights:
      - Mentor two early-career developers each year.

involvements:
  - id: involvement-001
    title: Organiser, quarterly front-end meetup
    organization:
      name: Cebu Developers Community
    role: Volunteer organiser
    dateRange:
      kind: ongoing
      start: '2023-06-01'
    description: Runs a 60-person meetup focused on practical front-end work.

professionalMemberships:
  - id: membership-001
    organization:
      name: Philippine Computer Society
      url: https://example.com/pcs
    role: Member
    since: '2021-01-01'

interests:
  - name: Typography
    category: Design
  - name: Trail running
    category: Outdoors
  - name: Mechanical keyboards
    category: Making

testimonials:
  - id: testimonial-001
    quote: Aldrin turned a vague reporting problem into a product our clients open every morning.
    authorName: Maya Santos
    authorRole: Head of Client Success
    authorOrganization: Northwind Studio
    date: '2025-05-20'
  - id: testimonial-002
    quote: Clear communication, careful engineering, and no drama. We shipped two weeks early.
    authorName: Daniel Reyes
    authorRole: Founder
    authorOrganization: Brightline Digital

references:
  - id: reference-001
    name: Maya Santos
    role: Head of Client Success
    organization: Northwind Studio
    relationship: Former manager
    isAvailableOnRequest: true

practice:
  businessName: Belardo Studio
  tagline: Small, deliberate software.
  description: Independent practice focused on web products and reporting tools.
  foundedYear: 2022
  services:
    - name: Web application development
      description: End-to-end product delivery with Vue and Node.js.
      priceLabel: From $4,000
      deliverables:
        - Discovery and scope
        - Design implementation
        - Production deployment
    - name: Performance and SEO audit
      description: A measured review of speed, accessibility, and crawlability.
      priceLabel: $900 fixed
    - name: Reporting automation
      description: Replace recurring spreadsheets with reliable pipelines.
  serviceArea:
    - Worldwide (remote)
  url: https://aldrin.example.com
  availability:
    status: available
    type:
      - freelance
    remote: true

workEligibility:
  authorizedCountries:
    - Philippines
  requiresSponsorship: true
  remote: true
  relocation: false
  visaStatus: Open to remote contracts

metadata:
  schemaVersion: '1.0.0'
  lastUpdated: '2026-10-28T09:00:00Z'
  locale: en-PH
  theme: dark
  isPublished: true
  visibility: public
  canonicalUrl: https://aldrin.example.com
  keywords:
    - full-stack developer
    - Vue
    - TypeScript
    - SEO
---

Aldrin Belardo is a full-stack developer based in Cebu City. This Markdown body is
kept for future long-form content; the portfolio UI renders validated frontmatter
only, so no raw HTML from this file is ever injected into the page.
