export const sustainabilityHero = {
  title: 'Sustainability',
  description:
    'Our ESG strategy integrates environmental stewardship, social empowerment and transparent governance across every stage of the value chain — from raw materials to finished garments.',
  ctaLabel: 'Read 2025 Report',
  ctaHref: '#esg-reports',
}

export const sustainabilityHeroImage = {
  src: '/images/sustainability/forest-hero.jpg',
  fallbackSrc: '/images/about/compliance.jpg',
  quote: 'The Earth is our only home – it is our responsibility to protect it.',
  company: 'Dekko Isho Group',
  strategy: 'ESG Strategy 2023',
}

export const strategySection = {
  badge: 'Our strategy',
  title: 'A 2030 commitment across the value chain',
  description:
    'We have set measurable targets across energy, emissions, water, waste and supply-chain transparency — aligned with global standards and verified through independent audits.',
}

export type StrategyMetric = {
  id: string
  value: string
  label: string
}

export const strategyMetrics: StrategyMetric[] = [
  { id: 'renewable', value: '80%', label: 'Renewable Energy' },
  { id: 'ghg', value: '50%', label: 'GHG Scope-3 reduction' },
  { id: 'wastewater', value: '70%', label: 'Wastewater recycled' },
  { id: 'waste', value: '50%', label: 'Waste recycled' },
  { id: 'traceability', value: '100%', label: 'Supply-chain traceability' },
]

export type InitiativeCard = {
  id: string
  number: string
  title: string
  description: string
  metric: string
}

export const pillar01 = {
  number: '01',
  badge: 'Pillar 01',
  title: 'Environmental Excellence',
  description:
    'Driving measurable impact across energy, emissions, water, waste and chemical management — with transparent reporting and continuous improvement across all manufacturing sites.',
  initiatives: [
    {
      id: 'energy',
      number: '01',
      title: 'Energy Management & Climate Action',
      description: 'Solar installations and I-REC procurement to decarbonise operations.',
      metric: '1.76 MWp Solar capacity installed',
    },
    {
      id: 'ghg',
      number: '02',
      title: 'GHG Emissions Performance',
      description: 'Scope-2 emissions reduction through renewable energy transition.',
      metric: '80% Scope-2 reduction (2025)',
    },
    {
      id: 'water',
      number: '03',
      title: 'Water Stewardship',
      description: 'Comprehensive water withdrawal tracking and conservation programmes.',
      metric: '766k m³ withdrawal tracked (2025)',
    },
    {
      id: 'effluent',
      number: '04',
      title: 'Effluent & Wastewater Management',
      description: 'Advanced ETP capacity with zero liquid discharge roadmap.',
      metric: '130 m³/hr ETP capacity & ZLD by 2030',
    },
    {
      id: 'waste',
      number: '05',
      title: 'Waste Management & Circularity',
      description: 'Textile waste diversion and recycling across production lines.',
      metric: '650T Textile waste recycled',
    },
    {
      id: 'chemical',
      number: '06',
      title: 'Chemical Management & Compliance',
      description: 'Full ZDHC compliance across chemical inputs and processes.',
      metric: '100% ZDHC Level 3 compliant',
    },
  ] satisfies InitiativeCard[],
  snapshotTitle: 'Performance snapshot',
  snapshotKpis: [
    { id: 'irec', value: '13,421 MWh', label: 'I-REC' },
    { id: 'scope2', value: '80%', label: 'Scope-2 GHG reduced' },
    { id: 'textile', value: '40%', label: 'Textile waste recycling rate' },
    { id: 'chemistry', value: '65%', label: 'Chemistry screen-certified inputs' },
  ],
}

export type SocialCard = {
  id: string
  number: string
  title: string
  description: string
  metric: string
}

export const pillar02 = {
  number: '02',
  badge: 'Pillar 02',
  title: 'Social Empowerment',
  description:
    'Investing in people, communities and ethical governance — ensuring every employee and partner across our supply chain is treated with dignity, safety and opportunity.',
  cards: [
    {
      id: 'employees',
      number: '01',
      title: 'Empowering Employees',
      description: 'A diverse workforce powering global apparel production.',
      metric: '16,815 People behind every stitch',
    },
    {
      id: 'wellness',
      number: '02',
      title: 'Employee Wellness',
      description: 'Comprehensive welfare and wellbeing programmes for all staff.',
      metric: '9+ Welfare & wellbeing programs',
    },
    {
      id: 'upskilling',
      number: '03',
      title: 'Upskilling',
      description: 'Continuous learning and skills development for career growth.',
      metric: '20 hrs Avg. training / person target',
    },
    {
      id: 'community',
      number: '04',
      title: 'Community Care',
      description: 'Supporting communities through disaster relief and local initiatives.',
      metric: '৳5M Flood relief to government',
    },
    {
      id: 'governance',
      number: '05',
      title: 'Governance',
      description: 'Comprehensive policy framework covering E, S and G dimensions.',
      metric: '23 Policies across E, S & G',
    },
  ] satisfies SocialCard[],
  governanceTitle: 'Governance Framework',
  governanceColumns: [
    {
      id: 'environmental',
      title: 'Environmental',
      count: 9,
      policies: [
        'Environmental Policy',
        'Energy Management Policy',
        'GHG Emissions & Climate Action Policy',
        'Water Stewardship Policy',
        'Effluent & Wastewater Management Policy',
        'Waste Management & Circularity Policy',
        'Chemical Management Policy',
        'Biodiversity Protection Policy',
        'Environmental Compliance Policy',
      ],
    },
    {
      id: 'social',
      title: 'Social',
      count: 7,
      policies: [
        'Human Rights Policy',
        'Labour Standards Policy',
        'Health & Safety Policy',
        'Employee Welfare Policy',
        'Training & Development Policy',
        'Community Engagement Policy',
        'Diversity & Inclusion Policy',
      ],
    },
    {
      id: 'governance',
      title: 'Governance',
      count: 7,
      policies: [
        'Corporate Governance Policy',
        'Business Ethics Policy',
        'ESG Disclosure Policy',
        'Supply Chain Due Diligence Policy',
        'Data Privacy Policy',
        'Risk Management Policy',
        'Stakeholder Engagement Policy',
      ],
    },
  ],
}

export type MaterialBar = {
  id: string
  name: string
  percentage: number
}

export const pillar03 = {
  number: '03',
  badge: 'Pillar 03',
  title: 'Material Sustainability',
  description:
    'Transitioning to certified sustainable materials with full traceability — from farm and fibre to finished garment.',
  sustainablePercentage: 61,
  sustainableLabel: 'sustainable materials',
  materials: [
    { id: 'bci', name: 'BCI Cotton', percentage: 17.23 },
    { id: 'flax', name: 'European Flax', percentage: 16.51 },
    { id: 'organic', name: 'Organic Cotton', percentage: 13.33 },
    { id: 'us-cotton', name: 'US Cotton', percentage: 5.05 },
    { id: 'poly', name: 'Recycled Polyester', percentage: 1.78 },
  ] satisfies MaterialBar[],
  traceabilityTitle: 'Traceability platforms',
  traceabilityPlatforms: [
    'TextileGenesis',
    'Better Cotton Platform',
    'Retraced',
    'TrusTrace',
    'Reverse Resources',
    'Chain of Custody',
  ],
  standardsTitle: 'Certified standards',
  standards: ['GOTS', '13,421 MWh', 'OEKO-TEX Standard 100', 'REACH', 'Regenagri'],
}

export const pillar04 = {
  number: '04',
  badge: 'Pillar 04',
  title: 'ESG Disclosure',
  description:
    'Transparent reporting on our environmental, social and governance performance — published annually and aligned with international frameworks.',
  reports: [
    {
      id: '2024',
      year: '2024',
      title: 'Sustainability Report 2024',
      description: 'Annual ESG performance overview and progress against 2030 targets.',
      variant: 'light' as const,
      pdfHref: '#',
    },
    {
      id: '2025',
      year: '2025',
      title: 'Sustainability Report 2025',
      description: 'Latest disclosures on climate, social impact and governance milestones.',
      variant: 'dark' as const,
      pdfHref: '#',
    },
  ],
  ctaTitle: 'Talk to our ESG team',
  ctaDescription: 'Connect with our sustainability team for partnership enquiries, audits or reporting.',
  ctaHref: '/contact',
}

export const sustainabilityCta = {
  title: "Let's Connect",
  subtitle: "And build what's next, together",
  buttonLabel: 'Schedule consultation',
  buttonHref: '/contact',
  email: 'hello@dekkoisho.com',
  emailHref: 'mailto:hello@dekkoisho.com',
}
