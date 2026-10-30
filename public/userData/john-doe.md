---
schemaVersion: '1.0.0'
username: john-doe

firstName: John
lastName: Doe
preferredName: John Doe

profileTypes:
  - creative
  - freelancer

occupation:
  - Brand Designer
  - Art Director
industry:
  - Design
  - Creative Direction

profileImageUrl: /assets/portfolios/john-doe/profile.svg

introduction: >
  Identity systems, editorial layouts, and interfaces with a point of view.

summary:
  headline: Brand Designer & Art Director
  introduction: >
    I design identities and interfaces for studios, small teams, and people
    launching something they care about. Most of my work starts with a page of
    type and ends with a system someone else can run.
  highlights:
    - Ten identities shipped for independent studios and cultural programmes.
    - Work featured in two regional design annuals.
  availability:
    status: open
    type:
      - freelance
    remote: true
    timezone: Europe/London

contact:
  emails:
    - address: hello@johndoe.example.com
      label: studio
      isPrimary: true
  websites:
    - url: https://johndoe.example.com
      label: Studio
  address:
    city: Bristol
    country: United Kingdom
    countryCode: GB

social:
  profiles:
    - platform: Dribbble
      url: https://dribbble.com/example-johndoe
      category: creative
    - platform: Behance
      url: https://www.behance.net/example-johndoe
      category: creative
    - platform: Instagram
      url: https://www.instagram.com/example.johndoe
      category: personal
    - platform: LinkedIn
      url: https://www.linkedin.com/in/example-johndoe
      category: professional

skills:
  creative:
    - name: Brand identity
      category: creative
      proficiency: expert
    - name: Art direction
      category: creative
      proficiency: advanced
    - name: Editorial layout
      category: creative
      proficiency: advanced
  tools:
    - name: Figma
      category: tool
    - name: InDesign
      category: tool
    - name: Illustrator
      category: tool
  soft:
    - name: Workshop facilitation
      category: soft

workExperience:
  - id: work-001
    role: Independent Designer
    organization:
      name: Self-employed
    employmentType: freelance
    dateRange:
      kind: ongoing
      start: '2021-02-01'
    location:
      city: Bristol
      country: United Kingdom
      isRemote: true
    summary: Identity and editorial work for studios, galleries, and founders.
    highlights:
      - Built a shared type system used across print and web for a gallery programme.
  - id: work-002
    role: Designer
    organization:
      name: Field Notes Studio
      industry: Design
    employmentType: full-time
    dateRange:
      kind: range
      start: '2018-05-01'
      end: '2021-01-31'
    location:
      city: London
      country: United Kingdom

education:
  - id: education-001
    institution:
      name: University of the West of England
    degree: BA Graphic Design
    fieldOfStudy: Graphic Design
    dateRange:
      kind: range
      start: '2014-09-01'
      end: '2017-06-30'
    location:
      city: Bristol
      country: United Kingdom

portfolioWorks:
  - id: work-001
    slug: north-gallery-identity
    kind: design
    title: North Gallery
    subtitle: A quiet identity for a loud programme.
    summary: Identity, signage, and print for a contemporary gallery's reopening season.
    role: Identity design and art direction
    status: completed
    isFeatured: true
    dateRange:
      kind: range
      start: '2025-03-01'
      end: '2025-06-30'
    tags:
      - Identity
      - Print
      - Signage
    links:
      primary: https://example.com/work/north-gallery
    media:
      - type: image
        url: /assets/portfolios/john-doe/work-north-01.svg
        altText: North Gallery poster series
      - type: image
        url: /assets/portfolios/john-doe/work-north-02.svg
        altText: North Gallery signage detail
      - type: image
        url: /assets/portfolios/john-doe/work-north-03.svg
        altText: North Gallery wayfinding
    outcomes:
      - Attendance rose 34% during the opening season.
      - The identity now runs in-house without a design retainer.

  - id: work-002
    slug: paper-trail
    kind: artwork
    title: Paper Trail
    subtitle: A self-published study of receipts, tickets, and lists.
    summary: A 64-page risograph book collecting found paper ephemera.
    role: Author and designer
    status: completed
    isFeatured: true
    dateRange:
      kind: range
      start: '2024-04-01'
      end: '2024-11-30'
    tags:
      - Editorial
      - Publication
    links:
      primary: https://example.com/work/paper-trail
    media:
      - type: image
        url: /assets/portfolios/john-doe/work-paper-01.svg
        altText: Paper Trail book spread
      - type: image
        url: /assets/portfolios/john-doe/work-paper-02.svg
        altText: Paper Trail cover

  - id: work-003
    slug: studio-notes
    kind: writing
    title: Studio Notes
    summary: A short essay series about the unglamorous parts of running a design practice.
    status: ongoing
    tags:
      - Writing
    links:
      primary: https://example.com/writing/studio-notes

awards:
  - id: award-001
    title: Regional Design Annual — Selected Work
    issuer:
      name: Design Review
    date: '2025-09-01'
    description: North Gallery identity included in the annual.
  - id: award-002
    title: Independent Publishing Prize
    issuer:
      name: Small Press Fair
    date: '2024-11-15'

testimonials:
  - id: testimonial-001
    quote: John gave us a system, not a logo. Six months on, our team still uses it without asking.
    authorName: Priya Nair
    authorRole: Director
    authorOrganization: North Gallery
    date: '2025-07-04'
  - id: testimonial-002
    quote: Careful, funny, and completely unbothered by scope changes.
    authorName: Tom Ellis
    authorRole: Founder
    authorOrganization: Field Notes Studio

interests:
  - name: Riso printing
    category: Making
  - name: Bookshops
    category: Outdoors
  - name: Analog photography
    category: Image making

practice:
  businessName: John Doe Studio
  tagline: Identity systems for people who care about details.
  description: A one-person studio working across identity, editorial, and interface design.
  foundedYear: 2021
  services:
    - name: Brand identity
      description: Naming support, type systems, and a practical set of assets.
      priceLabel: From £3,500
      deliverables:
        - Discovery workshop
        - Visual direction
        - Brand guidelines
    - name: Editorial and print
      description: Books, reports, and programmes designed to be read.
    - name: Art direction
      description: Photoshoot and campaign direction for small teams.
  serviceArea:
    - United Kingdom
    - Remote worldwide
  url: https://johndoe.example.com

workEligibility:
  authorizedCountries:
    - United Kingdom
  remote: true
  relocation: true

metadata:
  schemaVersion: '1.0.0'
  lastUpdated: '2026-10-20T14:30:00Z'
  locale: en-GB
  theme: light
  isPublished: true
  visibility: public
  canonicalUrl: https://johndoe.example.com
  keywords:
    - brand identity
    - art direction
    - editorial design
---
