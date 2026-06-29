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
  image: string
  imageAlt: string
}

const pillar1Image = (file: string) => `/images/sustainability/pillar-1/${file}`

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
        'Tracking and refining energy use across operations - solar, I-REC and efficiency on the path to 80% clean energy by 2030.',
      metricValue: '1.76 MWp',
      metricLabel: 'Solar capacity installed',
      image: pillar1Image('energy-management.png'),
      imageAlt: 'Solar panel array at a manufacturing facility',
    },
    {
      id: 'ghg',
      number: '02',
      title: 'GHG Emissions Performance',
      description:
        'Scope 1 & 2 monitored to international standards, SBTi-aligned and verified under ISO 14064-1 & 14064-2.',
      metricValue: '80%',
      metricLabel: 'Scope-2 reduction (2025)',
      image: pillar1Image('ghg-emission.jpg'),
      imageAlt: 'Industrial facility with emissions monitoring infrastructure',
    },
    {
      id: 'water',
      number: '03',
      title: 'Water Stewardship',
      description:
        'Rainwater harvesting plus reuse from sewage and greywater treatment plants to cut our dependency on groundwater.',
      metricValue: '766k m³',
      metricLabel: 'withdrawal tracked (2025)',
      image: pillar1Image('water-stewardship.jpg'),
      imageAlt: 'Flowing water representing water stewardship programmes',
    },
    {
      id: 'effluent',
      number: '04',
      title: 'Effluent & Wastewater Management',
      description:
        'Reducing pollution and maximising water reuse with advanced treatment to protect surrounding communities.',
      metricValue: '130 m³/hr',
      metricLabel: 'ETP capacity & ZLD by 2030',
      image: pillar1Image('wastewater-management.jpg'),
      imageAlt: 'Effluent and wastewater treatment facility',
    },
    {
      id: 'waste',
      number: '05',
      title: 'Waste Management & Circularity',
      description:
        'A circular system where resources are reused and repurposed – textiles, paper, lube oil and e-waste, via certified partners.',
      metricValue: '650T',
      metricLabel: 'Textile waste recycled',
      image: pillar1Image('waste-management.jpg'),
      imageAlt: 'Circular waste management and recycling infrastructure',
    },
    {
      id: 'chemical',
      number: '06',
      title: 'Energy Management & Climate Action',
      description:
        'System-driven control aligned to global standards – 88% Higg FEM, digital tracking via BHive & CleanChain, zero compromise.',
      metricValue: '100%',
      metricLabel: 'ZDHC Level 3 compliant',
      image: pillar1Image('energy-management-2.png'),
      imageAlt: 'Rooftop solar installation on a factory building',
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
  image: string
  imageAlt: string
}

export type GovernanceRow = {
  id: string
  title: string
  count: number
  image: string
  imageAlt: string
  policies: [string[], string[]]
}

const pillar2Image = (file: string) => `/images/sustainability/pillar-2/${file}`
const pillar2FrameworkImage = (file: string) => `/images/sustainability/pillar-2/framework/${file}`

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
      image: pillar2Image('empowering-employees.jpg'),
      imageAlt: 'Employees gathered outside the Aastha fair-price shop',
    },
    {
      id: 'wellness',
      number: '02',
      title: 'Employee Wellness',
      description:
        'Childcare facilities, nutritional support for children & pregnant employees, on-site medical care, free eye-test campaigns and celebration days.',
      metricValue: '9+',
      metricLabel: 'Welfare & wellbeing programs',
      image: pillar2Image('employee-wellness.jpg'),
      imageAlt: 'Children at an employee wellness programme',
    },
    {
      id: 'upskilling',
      number: '03',
      title: 'Upskilling',
      description:
        'P.A.C.E, WE Women, Mothers@Work and a structured orientation -> refreshment -> advanced training framework with green-skills and 5S.',
      metricValue: '20 hrs',
      metricLabel: 'Avg. training / person target',
      image: pillar2Image('upskilling.png'),
      imageAlt: 'Garment design sketches on a computer monitor',
    },
    {
      id: 'community',
      number: '04',
      title: 'Community Care',
      description:
        'Nutrition, education, healthcare and disaster support — 510 family food packages, 150,000 vegetable seeds, and aid for single mothers and children.',
      metricValue: '৳5M',
      metricLabel: 'Flood relief to government',
      image: pillar2Image('community-care.jpg'),
      imageAlt: 'Community members receiving relief supplies',
    },
    {
      id: 'governance',
      number: '05',
      title: 'Governance',
      description:
        'Strong governance is the foundation — codes of ethics, anti-corruption, risk management, supply-chain governance and grievance policies guide every decision.',
      metricValue: '23',
      metricLabel: 'Policies across E, S & G',
      image: pillar2Image('governance.png'),
      imageAlt: 'Modern corporate building representing governance',
    },
  ] satisfies SocialCard[],
  governanceBadge: 'Governance',
  governanceTitle: 'A framework for every decision',
  governanceRows: [
    {
      id: 'environmental',
      title: 'Environmental',
      count: 9,
      image: pillar2FrameworkImage('environment.png'),
      imageAlt: 'Hands holding soil with a green sprout',
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
      image: pillar2FrameworkImage('social.jpg'),
      imageAlt: 'Hand holding a miniature globe with wind turbines',
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
      image: pillar2FrameworkImage('governance.png'),
      imageAlt: 'Modern glass skyscraper at night',
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
  image: '/images/sustainability/pillar-3/0bb09de306378f3ecacb1d6d465a1012319e104e.jpg',
  imageAlt: 'Green pathway with palm trees inside a manufacturing facility',
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
  heroImage: '/images/sustainability/pillar-4/pillar-4-cover.jpg',
  heroImageAlt: 'A tree-lined pathway surrounded by lush bamboo and tropical greenery',
  reports: [
    {
      id: '2025',
      coverImage: '/images/sustainability/pillar-4/sustainability-report-2025.png',
      title: 'Sustainability Report 2025',
      description:
        'Progress against our ESG Strategy 2030 – energy transition, circularity, social impact and the deepening of supply-chain traceability.',
      variant: 'light' as const,
      comingSoon: true,
    },
    {
      id: '2024',
      coverImage: '/images/sustainability/pillar-4/sustainability-report-2024.png',
      title: 'Sustainability Report 2024',
      description:
        'Our first transparent view of the journey toward responsible and sustainable operations – structured disclosures and comprehensive data across E, S & G.',
      variant: 'dark' as const,
      pdfHref: '/documents/sustainability/sustainability-report-2024.pdf',
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
