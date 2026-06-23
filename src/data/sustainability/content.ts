export const sustainabilityHero = {
  title: 'Sustainability',
  description:
    'Driving measurable, long-term impact across environmental stewardship, social responsibility and exemplary governance — embedding Sustainable Consumption & Production into everything we make.',
  ctaLabel: 'Read 2025 Report',
  ctaHref: '#esg-reports',
}

export const sustainabilityHeroImage = {
  src: '/images/sustainability/sus.png',
  fallbackSrc: '/images/about/compliance.jpg',
  quote: 'The Earth is our only home – it is our responsibility to protect it.',
  company: 'Dekko Isho Group',
  strategy: 'ESG Strategy 2023',
}

export const strategySection = {
  badge: 'Our strategy',
  title: 'A 2030 commitment across the value chain',
  description:
    'Our strategy is built on driving measurable, long-term impact across environmental stewardship, social responsibility and exemplary governance. This commitment extends far beyond our own operations — fully embracing our entire value chain and supply network to foster sustainable excellence at every link.',
}

export type StrategyMetric = {
  id: string
  value: string
  label: string
  image: string
}

const strategyImage = (file: string) => `/images/sustainability/${file}`

export const strategyMetrics: StrategyMetric[] = [
  {
    id: 'renewable',
    value: '80%',
    label: 'Renewable Energy',
    image: strategyImage('strategy-renewable.png'),
  },
  {
    id: 'ghg',
    value: '50%',
    label: 'GHG Scope-3 reduction',
    image: strategyImage('strategy-ghg.png'),
  },
  {
    id: 'wastewater',
    value: '70%',
    label: 'Wastewater recycled',
    image: strategyImage('strategy-wastewater.png'),
  },
  {
    id: 'waste',
    value: '50%',
    label: 'Waste recycled',
    image: strategyImage('strategy-waste.png'),
  },
  {
    id: 'traceability',
    value: '100%',
    label: 'Supply-chain traceability',
    image: strategyImage('strategy-traceability.png'),
  },
]

export type InitiativeCard = {
  id: string
  number: string
  title: string
  description: string
  metricValue: string
  metricLabel: string
}

export const pillar01 = {
  number: '01',
  badge: 'Pillar 01',
  title: 'Environmental Excellence',
  description:
    'The Earth is our only home. We account for every environment-related impact and take proper measures to mitigate it – powering efficiency and driving the transition to clean energy.',
  initiatives: [
    {
      id: 'energy',
      number: '01',
      title: 'Energy Management & Climate Action',
      description:
        'Solar installations, I-REC procurement and energy-efficiency programmes across all manufacturing sites.',
      metricValue: '1.76 MWp',
      metricLabel: 'Solar capacity installed',
    },
    {
      id: 'ghg',
      number: '02',
      title: 'GHG Emissions Performance',
      description: 'Scope-2 emissions reduction through renewable energy transition and efficiency gains.',
      metricValue: '80%',
      metricLabel: 'Scope-2 reduction (2025)',
    },
    {
      id: 'water',
      number: '03',
      title: 'Water Stewardship',
      description: 'Comprehensive water withdrawal tracking and conservation programmes at every facility.',
      metricValue: '766k m³',
      metricLabel: 'withdrawal tracked (2025)',
    },
    {
      id: 'effluent',
      number: '04',
      title: 'Effluent & Wastewater Management',
      description: 'Advanced ETP capacity with zero liquid discharge roadmap by 2030.',
      metricValue: '130 m³/hr',
      metricLabel: 'ETP capacity & ZLD by 2030',
    },
    {
      id: 'waste',
      number: '05',
      title: 'Waste Management & Circularity',
      description: 'Textile waste diversion and recycling across production lines and supply partners.',
      metricValue: '650T',
      metricLabel: 'Textile waste recycled',
    },
    {
      id: 'chemical',
      number: '06',
      title: 'Energy Management & Climate Action',
      description:
        'Higg FEM, BHive and CleanChain verified chemical management with full ZDHC Level 3 compliance.',
      metricValue: '100%',
      metricLabel: 'ZDHC Level 3 compliant',
    },
  ] satisfies InitiativeCard[],
  snapshotBadge: 'Performance snapshot',
  snapshotHeadline: 'Measuring what matters, reducing what counts',
  snapshotKpis: [
    { id: 'irec', value: '13,421 MWh', label: 'I-REC purchased for 2025' },
    { id: 'scope2', value: '80%', label: 'Scope-2 GHG emissions reduced' },
    { id: 'textile', value: '40%', label: 'Textile waste recycling rate' },
    { id: 'chemistry', value: '65%', label: 'Chemistry screen-certified inputs' },
  ],
}

export type SocialCard = {
  id: string
  number: string
  title: string
  description: string
  metricValue: string
  metricLabel: string
}

export type GovernanceRow = {
  id: string
  title: string
  count: number
  policies: [string[], string[]]
}

export const pillar02 = {
  number: '02',
  badge: 'Pillar 02',
  title: 'Social Empowerment',
  description:
    'We place our people at the centre of everything we do – nurturing wellbeing, safety and growth, then extending that responsibility outward through CSR for the communities where we operate.',
  cards: [
    {
      id: 'employees',
      number: '01',
      title: 'Empowering Employees',
      description:
        'Meaningful benefits and continuous support – performance & festival bonuses, maternity benefits, loan facilities and the Aastha fair-price shop.',
      metricValue: '16,815',
      metricLabel: 'People behind every stitch',
    },
    {
      id: 'wellness',
      number: '02',
      title: 'Employee Wellness',
      description:
        'Childcare facilities, nutritional support for children & pregnant employees, on-site medical care, free eye-test campaigns and celebration days.',
      metricValue: '9+',
      metricLabel: 'Welfare & wellbeing programs',
    },
    {
      id: 'upskilling',
      number: '03',
      title: 'Upskilling',
      description:
        'P.A.C.E, WE Women, Mothers@Work and a structured orientation + refreshment → advanced training framework with green-skills and 5S.',
      metricValue: '20 hrs',
      metricLabel: 'Avg. training / person target',
    },
    {
      id: 'community',
      number: '04',
      title: 'Community Care',
      description:
        'Nutrition, education, healthcare and disaster support — 510 family food packages, 150,000 vegetable seeds, and aid for single mothers and children.',
      metricValue: '৳5M',
      metricLabel: 'Flood relief to government',
    },
    {
      id: 'governance',
      number: '05',
      title: 'Governance',
      description:
        'Strong governance is the foundation — codes of ethics, anti-corruption, risk management, supply-chain governance and grievance policies guide every decision.',
      metricValue: '23',
      metricLabel: 'Policies across E, S & G',
    },
  ] satisfies SocialCard[],
  governanceBadge: 'Governance',
  governanceTitle: 'A framework for every decision',
  governanceRows: [
    {
      id: 'environmental',
      title: 'Environmental',
      count: 9,
      policies: [
        [
          'Environmental Management System',
          'Water Policy',
          'Waste Management',
          'Chemical Purchase',
          'MRSL & RSL Management',
        ],
        ['Energy Policy', 'Air Policy', 'Chemical Management', 'GHG Management'],
      ],
    },
    {
      id: 'social',
      title: 'Social',
      count: 7,
      policies: [
        [
          'Human Rights Policy',
          'Diversity, Equity & Inclusion',
          'Training & Development',
          'Child & Forced Labor',
        ],
        ['Labor Practices & Welfare', 'Health & Safety Policy', 'Talent Acquisition'],
      ],
    },
    {
      id: 'governance',
      title: 'Governance',
      count: 7,
      policies: [
        [
          'Code of Ethics & Conduct',
          'Compliance & Engagement',
          'Grievance Policy',
          'Anti-Corruption',
        ],
        ['Risk Management', 'Supply Chain Governance', 'Quality Policy'],
      ],
    },
  ] satisfies GovernanceRow[],
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
    'Responsible sourcing, environmental stewardship and full supply-chain transparency – every garment powered by verified, end-to-end traceable data, from fibre to retail.',
  sustainablePercentage: 61,
  sustainableLabel:
    'of our material mix is now sustainably sourced – up across cotton, flax and circular fibres.',
  materialsChartTitle: 'Top 5 Sustainable Materials Uptake',
  materials: [
    { id: 'bci', name: 'BCI Cotton', percentage: 17.23 },
    { id: 'flax', name: 'European Flax (Linen)', percentage: 16.51 },
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
  standardsTitle: 'Certified to global standards',
  standards: ['GOTS', '13,421 MWh', 'OEKO-TEX Standard 100', 'REACH', 'Regenagri'],
}

export const pillar04 = {
  number: '04',
  badge: 'Pillar 04',
  title: 'ESG Disclosure',
  description:
    'In accordance with Global Reporting Initiative (GRI) standards, our sustainability reports communicate our goals, progress, challenges and impact across every ESG area.',
  reports: [
    {
      id: '2024',
      year: '2024',
      title: 'Sustainability Report 2024',
      description: 'Annual ESG performance overview and progress against 2030 targets.',
      variant: 'light' as const,
      pdfHref: '/documents/sustainability/sustainability-report-2024.pdf',
    },
    {
      id: '2025',
      year: '2025',
      title: 'Sustainability Report 2025',
      description: 'Latest disclosures on climate, social impact and governance milestones.',
      variant: 'dark' as const,
      comingSoon: true,
    },
  ],
  ctaText: 'Reporting since 2024 — aligned to GRI standards, with continuous year-on-year disclosure.',
  ctaButtonLabel: 'Talk to our ESG team',
  ctaHref: '/contact',
}

export const sustainabilityCta = {
  eyebrow: "Let's Connect",
  heading: "And build what's next, together",
  description:
    "Get in touch with our team for partnership, sourcing, careers or general inquiries - we'll get back to you with answers.",
  buttonLabel: 'Schedule consultation',
  buttonHref: '/contact',
  email: 'hello@dekkoisho.com',
  emailHref: 'mailto:hello@dekkoisho.com',
}
