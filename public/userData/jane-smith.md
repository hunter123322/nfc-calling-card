---
schemaVersion: '1.0.0'
username: jane-smith

firstName: Jane
lastName: Smith
preferredName: Jane Smith

profileTypes:
  - student
  - researcher

occupation:
  - Graduate Researcher
  - Data Analyst
industry:
  - Research
  - Higher Education

profileImageUrl: /assets/portfolios/jane-smith/profile.svg

introduction: >
  Studying how small teams make decisions with messy data.

summary:
  headline: MSc Candidate in Data Science
  introduction: >
    Graduate researcher at the University of Edinburgh working on decision
    support for public-sector teams. Comfortable across survey design,
    statistical analysis, and the reporting layer that makes findings usable.
  highlights:
    - Two peer-reviewed papers on small-sample survey methods.
    - Teaching assistant for an introductory statistics course.
    - Open-source contributor to two R packages.
  availability:
    status: open
    type:
      - internship
      - part-time
    remote: true
    timezone: Europe/London
    startDate: '2027-01-15'

contact:
  emails:
    - address: jane.smith@example.edu
      label: university
      isPrimary: true
    - address: hello@janesmith.example.com
      label: personal
  websites:
    - url: https://janesmith.example.com
      label: Personal site
  address:
    city: Edinburgh
    country: United Kingdom
    countryCode: GB

social:
  profiles:
    - platform: ORCID
      url: https://orcid.org/0000-0000-0000-0000
      category: academic
    - platform: Google Scholar
      url: https://scholar.google.com
      category: academic
    - platform: GitHub
      url: https://github.com/example-janesmith
      category: professional
    - platform: LinkedIn
      url: https://www.linkedin.com/in/example-janesmith
      category: professional

skills:
  technical:
    - name: R
      category: technical
      proficiency: advanced
    - name: Python
      category: technical
      proficiency: intermediate
    - name: SQL
      category: technical
      proficiency: intermediate
  domain:
    - name: Survey methodology
      category: domain
      proficiency: advanced
    - name: Causal inference
      category: domain
      proficiency: intermediate
  tools:
    - name: Quarto
      category: tool
    - name: Git
      category: tool
  soft:
    - name: Science communication
      category: soft
    - name: Teaching
      category: soft

workExperience:
  - id: work-001
    role: Graduate Teaching Assistant
    organization:
      name: University of Edinburgh
      url: https://example.edu
      industry: Higher education
    employmentType: part-time
    dateRange:
      kind: ongoing
      start: '2025-09-15'
    location:
      city: Edinburgh
      country: United Kingdom
    summary: Teaching assistant for Introduction to Statistical Methods.
    highlights:
      - Leads weekly tutorials for 40 undergraduate students.
      - Rewrote the R workshop used by the 2025 cohort.
    skills:
      - R
      - Teaching
  - id: work-002
    role: Data Analyst Intern
    organization:
      name: Civic Data Unit
      industry: Public sector
    employmentType: internship
    dateRange:
      kind: range
      start: '2025-06-02'
      end: '2025-08-22'
    location:
      city: Manchester
      country: United Kingdom
      isRemote: true
    summary: Built dashboards for a local housing survey.
    highlights:
      - Reduced survey cleaning time by half with a reproducible pipeline.
    skills:
      - R
      - SQL

education:
  - id: education-001
    institution:
      name: University of Edinburgh
      url: https://example.edu
    degree: MSc Data Science
    fieldOfStudy: Data Science
    dateRange:
      kind: ongoing
      start: '2025-09-01'
    location:
      city: Edinburgh
      country: United Kingdom
    grade:
      value: 72
      scale: percent
      label: Current average
    highlights:
      - Dissertation on decision support for small public-sector teams.
  - id: education-002
    institution:
      name: University of Manchester
    degree: BSc Statistics
    fieldOfStudy: Statistics
    dateRange:
      kind: range
      start: '2021-09-20'
      end: '2024-06-28'
    location:
      city: Manchester
      country: United Kingdom
    grade:
      value: 3.8
      scale: gpa-4
    highlights:
      - Graduated first class with honours.

studentProfile:
  school: University of Edinburgh
  program: MSc Data Science
  academicLevel: graduate
  expectedGraduation:
    kind: range
    start: '2025-09-01'
    end: '2026-09-01'
  gpa:
    value: 72
    scale: percent
    label: Current average
  coursework:
    - Applied statistical modelling
    - Data engineering
    - Research design
  honors:
    - School of Informatics scholarship
  activities:
    - Data Society reading group organiser

portfolioWorks:
  - id: project-001
    slug: household-survey-toolkit
    kind: research
    title: Household Survey Toolkit
    subtitle: Reproducible analysis for small, messy samples.
    summary: An open R toolkit for cleaning and weighting household survey data.
    role: Lead researcher
    status: in-progress
    isFeatured: true
    dateRange:
      kind: ongoing
      start: '2026-01-15'
    tags:
      - Research
      - Open source
    skills:
      - R
      - Survey methodology
    links:
      primary: https://example.com/research/survey-toolkit
      repository: https://github.com/example-janesmith/survey-toolkit
    media:
      - type: image
        url: /assets/portfolios/jane-smith/work-survey.svg
        altText: Household Survey Toolkit documentation page
    outcomes:
      - Adopted by two local authority research teams in pilot testing.

  - id: project-002
    slug: housing-dashboard
    kind: project
    title: Housing Dashboard
    summary: A public dashboard showing housing survey results by neighbourhood.
    status: completed
    dateRange:
      kind: range
      start: '2025-06-02'
      end: '2025-08-22'
    tags:
      - Data visualisation
      - Public sector
    links:
      primary: https://example.com/work/housing-dashboard

publications:
  - id: publication-001
    type: conference-paper
    title: Weighting small household samples without auxiliary data
    venue: Symposium on Survey Methods
    publisher: Example Press
    date: '2026-04-10'
    authors:
      - Jane Smith
      - A. Macdonald
    abstract: >
      A practical comparison of weighting strategies for small, non-probability
      household samples.
    url: https://example.com/publications/weighting-small-samples
    doi: 10.0000/example.2026.001
  - id: publication-002
    type: journal
    title: Teaching reproducible analysis with Quarto
    venue: Journal of Data Education
    date: '2025-11-02'
    authors:
      - Jane Smith
    url: https://example.com/publications/teaching-quarto
    citations: 4

speakingEngagements:
  - id: talk-001
    title: What small samples can still tell us
    event: Edinburgh Data Society
    type: talk
    date: '2026-02-19'
    location:
      city: Edinburgh
      country: United Kingdom
  - id: talk-002
    title: Reproducible reporting for public teams
    event: Civic Data Meetup
    type: workshop
    date: '2025-08-14'
    url: https://example.com/talks/reproducible-reporting

certifications:
  - id: cert-001
    name: RStudio Certified Tidyverse Instructor
    issuer:
      name: Posit
      url: https://posit.co
    issueDate: '2025-03-20'
    skills:
      - R

awards:
  - id: award-001
    title: Best Student Paper
    issuer:
      name: Symposium on Survey Methods
    date: '2026-04-10'
    description: Awarded for the paper on weighting small household samples.
  - id: award-002
    title: School of Informatics Scholarship
    issuer:
      name: University of Edinburgh
    date: '2025-08-01'

volunteerExperience:
  - id: volunteer-001
    role: Data volunteer
    organization:
      name: Open City Data Collective
      url: https://example.com/open-city
    dateRange:
      kind: range
      start: '2024-10-01'
      end: '2025-05-30'
    highlights:
      - Cleaned and documented three open datasets used by local journalists.

professionalMemberships:
  - id: membership-001
    organization:
      name: Royal Statistical Society
      url: https://rss.org.uk
    role: Student member
    since: '2025-10-01'

interests:
  - name: Long-distance cycling
    category: Outdoors
  - name: Public data
    category: Research
  - name: Baking
    category: Making

testimonials:
  - id: testimonial-001
    quote: Jane makes statistical decisions legible to people who do not work in statistics.
    authorName: Dr. A. Macdonald
    authorRole: Supervisor
    authorOrganization: University of Edinburgh

workEligibility:
  authorizedCountries:
    - United Kingdom
  requiresSponsorship: false
  remote: true
  relocation: true
  notes: Available for part-time work alongside study until late 2026.

metadata:
  schemaVersion: '1.0.0'
  lastUpdated: '2026-10-15T11:05:00Z'
  locale: en-GB
  theme: system
  isPublished: true
  visibility: public
  canonicalUrl: https://janesmith.example.com
  keywords:
    - data science
    - survey methodology
    - research
---
