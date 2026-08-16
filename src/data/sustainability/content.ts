export { certificationLogos } from '../certifications/content'

export const sustainabilityHero = {
  titleParts: [
    { text: 'People.', tone: 'primary' as const },
    { text: 'Planet.', tone: 'green' as const },
    { text: 'Prosperity.', tone: 'amaranth' as const },
  ],
  description:
    'Advancing responsible growth by balancing business performance with environmental stewardship, social responsibility, and ethical governance.',
  ctaLabel: 'Read 2025 Report',
  ctaHref: '#esg-reports',
}

export const sustainabilityHeroImage = {
  quoteLines: [
    'Weaving a more sustainable future',
    'through responsible manufacturing.',
  ],
  strategy: 'ESG Strategy 2023',
}

export const strategySection = {
  titlePrefix: 'Our Strategic',
  titleHighlight: 'Sustainability',
  titleSuffix: 'Goals — 2030',
  description:
    'Our strategy is built on driving measurable, long-term impact across environmental stewardship, social responsibility and exemplary governance — extending beyond our own operations to our entire value chain.',
  backgroundImage: '/images/sustainability/goals/sdg-section-bg.png',
}

export type SdgStat = {
  value: string
  label: string
}

export type SdgInteractiveGoal = {
  number: number
  color: string
  title: string
  stats: SdgStat[]
  stillSrc: string
  animSrc: string
}

const sdgAsset = (file: string) => `/images/sustainability/goals/${file}`

export const sdgInteractiveGoals: SdgInteractiveGoal[] = [
  {
    number: 1,
    color: '#ea1c2d',
    title: 'No Poverty',
    stillSrc: sdgAsset('sdg-1.svg'),
    animSrc: sdgAsset('sdg-1.gif'),
    stats: [
      { value: 'Fair', label: 'Living Wages' },
      { value: '100%', label: 'Timely Payroll' },
      { value: 'Financial', label: 'Employee Support' },
      { value: 'Livelihood', label: 'Community Programs' },
      { value: 'Emergency', label: 'Relief Fund' },
      { value: 'Income', label: 'Enhancement Programs' },
    ],
  },
  {
    number: 3,
    color: '#2c9947',
    title: 'Good Health and Well-being',
    stillSrc: sdgAsset('sdg-3.svg'),
    animSrc: sdgAsset('sdg-3.gif'),
    stats: [
      { value: '100%', label: 'Healthcare Access' },
      { value: 'Free', label: 'Sanitary Napkins' },
      { value: '0', label: 'Work-related Illness' },
      { value: '100%', label: 'Harassment Protection' },
    ],
  },
  {
    number: 4,
    color: '#c22033',
    title: 'Quality Education',
    stillSrc: sdgAsset('sdg-4.svg'),
    animSrc: sdgAsset('sdg-4.gif'),
    stats: [
      { value: 'Primary', label: 'Education Centers' },
      { value: '20 hrs', label: 'Annual Training' },
      { value: '100%', label: 'Supplier Training' },
    ],
  },
  {
    number: 5,
    color: '#ee402a',
    title: 'Gender Equality',
    stillSrc: sdgAsset('sdg-5.svg'),
    animSrc: sdgAsset('sdg-5.gif'),
    stats: [
      { value: '100%', label: 'Sexual Harassment Protection' },
      { value: '40%', label: 'Female in Management for Gender Parity' },
    ],
  },
  {
    number: 6,
    color: '#00acd7',
    title: 'Clean Water and Sanitation',
    stillSrc: sdgAsset('sdg-6.svg'),
    animSrc: sdgAsset('sdg-6.gif'),
    stats: [
      { value: '40%', label: 'Blue Water Reduction' },
      { value: '20%', label: 'Water Efficiency' },
      { value: '70%', label: 'Wastewater Recycling' },
      { value: '100%', label: 'Community Clean Water' },
    ],
  },
  {
    number: 7,
    color: '#fcb614',
    title: 'Affordable and Clean Energy',
    stillSrc: sdgAsset('sdg-7.svg'),
    animSrc: sdgAsset('sdg-7.gif'),
    stats: [
      { value: '80%', label: 'Renewable Energy' },
      { value: '20%', label: 'Energy Efficiency' },
    ],
  },
  {
    number: 8,
    color: '#8e1837',
    title: 'Decent Work and Economic Growth',
    stillSrc: sdgAsset('sdg-8.svg'),
    animSrc: sdgAsset('sdg-8.gif'),
    stats: [
      { value: '0', label: 'Human Rights Violations' },
      { value: 'Low Risk', label: 'HRDD Assessment' },
      { value: '20 hrs', label: 'Employee Training' },
      { value: '80%', label: 'Employee Engagement' },
      { value: '<10%', label: 'Annual Attrition' },
      { value: '<4%', label: 'High Performer Attrition' },
      { value: '0', label: 'Workplace Accidents' },
    ],
  },
  {
    number: 9,
    color: '#f26e24',
    title: 'Industry, Innovation and Infrastructure',
    stillSrc: sdgAsset('sdg-9.svg'),
    animSrc: sdgAsset('sdg-9.gif'),
    stats: [
      { value: '100%', label: 'Brand CoC Completion' },
      { value: '5+', label: 'Process Improvements' },
      { value: '25%', label: 'Faster Processes' },
      { value: 'Innovation', label: 'Cross-team Collaboration' },
      { value: 'Digital', label: 'Product Passport' },
    ],
  },
  {
    number: 10,
    color: '#df1a82',
    title: 'Reduced Inequalities',
    stillSrc: sdgAsset('sdg-10.svg'),
    animSrc: sdgAsset('sdg-10.gif'),
    stats: [
      { value: 'Inclusive', label: 'Workplace Culture' },
      { value: '40%', label: 'Women Leaders' },
      { value: '100%', label: 'Harassment Protection' },
      { value: 'Equal', label: 'Growth Opportunities' },
    ],
  },
  {
    number: 11,
    color: '#f89c25',
    title: 'Sustainable Cities and Communities',
    stillSrc: sdgAsset('sdg-11.svg'),
    animSrc: sdgAsset('sdg-11.gif'),
    stats: [
      { value: '15%', label: 'Green Landscaping' },
      { value: '10K', label: 'Trees Planted' },
      { value: '100%', label: 'Community Healthcare' },
      { value: 'Primary', label: 'Education Centers' },
      { value: '100%', label: 'Community Clean Water' },
    ],
  },
  {
    number: 12,
    color: '#cc8b2a',
    title: 'Responsible Consumption and Production',
    stillSrc: sdgAsset('sdg-12.svg'),
    animSrc: sdgAsset('sdg-12.gif'),
    stats: [
      { value: '40%', label: 'Waste Recycling' },
      { value: '70%', label: 'Wastewater Recycling' },
      { value: '100%', label: 'ZDHC Level 3' },
      { value: 'Plastic-Free', label: 'Offices' },
      { value: 'Paperless', label: 'Operations' },
      { value: 'Digital', label: 'Product Passport' },
      { value: '100%', label: 'Supplier Training' },
      { value: '5+', label: 'Kaizen Improvements' },
      { value: '25%', label: 'Faster Processes' },
    ],
  },
  {
    number: 13,
    color: '#48773c',
    title: 'Climate Action',
    stillSrc: sdgAsset('sdg-13.svg'),
    animSrc: sdgAsset('sdg-13.gif'),
    stats: [
      { value: '50%', label: 'Scope 3 Reduction' },
      { value: '80%', label: 'Renewable Energy' },
      { value: '20%', label: 'Energy Efficiency' },
      { value: '10K', label: 'Trees Planted' },
      { value: '15%', label: 'Green Landscaping' },
      { value: 'Climate', label: 'Awareness Programs' },
    ],
  },
  {
    number: 15,
    color: '#3ead49',
    title: 'Life on Land',
    stillSrc: sdgAsset('sdg-15.svg'),
    animSrc: sdgAsset('sdg-15.gif'),
    stats: [
      { value: '10K', label: 'Trees Planted' },
      { value: '15%', label: 'Green Landscaping' },
    ],
  },
  {
    number: 16,
    color: '#005589',
    title: 'Peace, Justice and Strong Institutions',
    stillSrc: sdgAsset('sdg-16.svg'),
    animSrc: sdgAsset('sdg-16.gif'),
    stats: [
      { value: '100%', label: 'Supplier CoC' },
      { value: '100%', label: 'Brand CoC Completion' },
      { value: '0', label: 'Human Rights Violations' },
      { value: 'Low Risk', label: 'HRDD Assessment' },
      { value: 'Business', label: 'Ethics Training' },
      { value: 'Anti-Corruption', label: 'Training Across all the Units' },
      { value: '100%', label: 'Harassment Protection' },
    ],
  },
  {
    number: 17,
    color: '#1b3668',
    title: 'Partnerships for the Goals',
    stillSrc: sdgAsset('sdg-17.svg'),
    animSrc: sdgAsset('sdg-17.gif'),
    stats: [
      { value: '100%', label: 'Supply Chain Traceability' },
      { value: 'Digital', label: 'Product Passport' },
      { value: 'Innovation', label: 'Strategic Partnerships' },
      { value: '100%', label: 'Supplier Training' },
      { value: '100%', label: 'Supplier CoC' },
    ],
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

const pillar1Image = (...parts: string[]) =>
  `/images/sustainability/pillar-1/${parts.map(encodeURIComponent).join('/')}`

export type FocusAreaImage = {
  src: string
  alt: string
}

export type FocusAreaCard = {
  id: string
  title: string
  images: FocusAreaImage[]
}

export const pillar01FocusAreas: FocusAreaCard[] = [
  {
    id: 'renewable-energy',
    title: 'Renewable Energy',
    images: [
      {
        src: pillar1Image('1. Renewable Energy', '1. Renewable-Energy.png'),
        alt: 'Solar panels installed on a factory rooftop',
      },
      {
        src: pillar1Image('1. Renewable Energy', 'DJI_0047.JPG'),
        alt: 'Aerial view of solar panel arrays',
      },
      {
        src: pillar1Image('1. Renewable Energy', 'DJI_0081.JPG'),
        alt: 'Wide aerial view of renewable energy installation',
      },
      {
        src: pillar1Image('1. Renewable Energy', 'DJI_0091.JPG'),
        alt: 'Solar farm under clear skies',
      },
      {
        src: pillar1Image('1. Renewable Energy', 'Solar Panel.png'),
        alt: 'Close-up of photovoltaic solar panels',
      },
    ],
  },
  {
    id: 'energy-monitoring',
    title: 'Energy Monitoring',
    images: [
      {
        src: pillar1Image('2. Energy Monitoring', '2. Energy-Monitoring.png'),
        alt: 'Digital energy monitoring control panel',
      },
    ],
  },
  {
    id: 'biomass-boiler',
    title: 'Biomass Boiler',
    images: [
      {
        src: pillar1Image('3. Biomass Boiler', '3. Biomass-Boiler.png'),
        alt: 'Biomass boiler facility with workers in protective gear',
      },
      {
        src: pillar1Image('3. Biomass Boiler', 'AWL 28202601.jpeg'),
        alt: 'Biomass boiler operation in progress',
      },
    ],
  },
  {
    id: 'steam-recovery',
    title: 'Steam Recovery',
    images: [
      {
        src: pillar1Image('4. Steam Recovery', '4. Steam-Recovery.png'),
        alt: 'Industrial steam recovery piping system',
      },
    ],
  },
  {
    id: 'rainwater-harvesting',
    title: 'Rainwater Harvesting',
    images: [
      {
        src: pillar1Image('5. Rainwater Harvesting', '5.-Rainwater-Harvesting.png'),
        alt: 'Rainwater harvesting infrastructure on a building exterior',
      },
      {
        src: pillar1Image('5. Rainwater Harvesting', '5.-Rainwater-Harvesting-2.png'),
        alt: 'Rainwater collection system detail',
      },
      {
        src: pillar1Image('5. Rainwater Harvesting', 'WhatsApp Image 2026-06-23 at 3.18.13 PM.jpeg'),
        alt: 'Rainwater harvesting installation on site',
      },
    ],
  },
  {
    id: 'stp',
    title: 'Sewerage Treatment Plan (STP)',
    images: [
      {
        src: pillar1Image('6. Sewerage Treatment Plan (STP)', '6.-Sewerage-Treatment-Plan-(STP).png'),
        alt: 'Sewerage treatment plant water sample testing',
      },
    ],
  },
  {
    id: 'etp',
    title: 'Effluent Treatment Plant (ETP)',
    images: [
      {
        src: pillar1Image('7. Effluent Treatment Plant (ETP)', '7.-Effluent-Treatment-Plant-(ETP).png'),
        alt: 'Effluent treatment plant tanks and processing area',
      },
    ],
  },
  {
    id: 'grey-water',
    title: 'Grey Water Treatment Plant',
    images: [
      {
        src: pillar1Image('8. Grey Water Treatment Plant', '8.-Grey-Water-Treatment-Plant.png'),
        alt: 'Grey water treatment plant equipment and storage',
      },
    ],
  },
  {
    id: 'textile-waste',
    title: 'Textile Waste Recycling',
    images: [
      {
        src: pillar1Image('9. Textile Waste Recycling', '9.-Textile-Waste-Recycling.png'),
        alt: 'Textile waste recycling facility',
      },
    ],
  },
  {
    id: 'lube-oil',
    title: 'Used Lube Oil Recycling',
    images: [
      {
        src: pillar1Image('10. Used Lube Oil Recycling', '10.-Used-Lube-Oil-Recycling.png'),
        alt: 'Used lube oil recycling tanker at facility',
      },
      {
        src: pillar1Image('10. Used Lube Oil Recycling', 'WhatsApp Image 2026-06-22 at 4.06.25 PM (1).jpeg'),
        alt: 'Lube oil recycling operation on site',
      },
    ],
  },
  {
    id: 'water-efficient-machines',
    title: 'Water Efficient Machines',
    images: [
      {
        src: pillar1Image('11. Water Efficient Machines', '11.-Water-Efficient-Machines.png'),
        alt: 'Row of water-efficient industrial washing machines',
      },
    ],
  },
  {
    id: 'conveyor-dryer',
    title: 'Conveyor Dryer',
    images: [
      {
        src: pillar1Image('12. Conveyor Dryer', '12.-Conveyor-Dryer.png'),
        alt: 'Garments on a conveyor dryer line in production',
      },
    ],
  },
  {
    id: 'chemical-management',
    title: 'Chemical Management',
    images: [
      {
        src: pillar1Image('13. Chemical Management', '13.-Chemical-Management.png'),
        alt: 'Chemical drums stored on industrial shelving',
      },
    ],
  },
]

export type SnapshotKpi =
  | {
      id: string
      type: 'stat'
      value: string
      suffix: string
      labelLines: [string, string]
    }
  | {
      id: string
      type: 'gauge'
      percentage: number
      labelLines: [string, string]
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
  snapshotHeadline: 'Measuring What Matters, Reducing What Counts',
  snapshotKpis: [
    {
      id: 'irec',
      type: 'stat',
      value: '13,421',
      suffix: ' MWh',
      labelLines: ['I-REC purchased', 'for 2025'],
    },
    {
      id: 'scope2',
      type: 'gauge',
      percentage: 80,
      labelLines: ['Scope-2 GHG', 'emissions reduced'],
    },
    {
      id: 'textile',
      type: 'gauge',
      percentage: 40,
      labelLines: ['Textile waste', 'recycling rate'],
    },
    {
      id: 'chemistry',
      type: 'gauge',
      percentage: 65,
      labelLines: ['Chemistry screen-', 'certified inputs'],
    },
  ] satisfies SnapshotKpi[],
}

export type PerformanceSnapshotStat = {
  value: string
  unit?: string
  label: string
  lead?: boolean
}

export type PerformanceSnapshotFooterItem = {
  title: string
  text: string
}

export type PerformanceSnapshotCard = {
  id: string
  theme: 'energy' | 'waste' | 'water'
  category: string
  title: string
  description: string
  /** Large decorative value shown behind the left-panel title copy */
  watermark?: string
  statsColumns: 2 | 3 | 4
  stats: PerformanceSnapshotStat[]
  footer?: PerformanceSnapshotFooterItem[]
}

export const performanceSnapshot = {
  badge: 'Our Progress',
  headline: 'Measuring What Matters, Reducing What Counts',
  cards: [
    {
      id: 'energy',
      theme: 'energy',
      category: 'Energy',
      title: 'Renewable Electricity & Energy Efficiency',
      description: 'Clean electricity milestones and solar expansion across all units.',
      watermark: '80%',
      statsColumns: 2,
      stats: [
        {
          value: '80%',
          label: 'Scope-2 GHG reduced',
          lead: true,
        },
        {
          value: '5.07%',
          label: 'Renewable energy share',
        },
        {
          value: '1.861',
          unit: 'MWp',
          label: 'Current solar capacity',
        },
        {
          value: '2.324',
          unit: 'MWp',
          label: 'Planned solar capacity by 2026',
        },
      ],
    },
    {
      id: 'waste',
      theme: 'waste',
      category: 'Waste',
      title: 'Waste Accountability',
      description: 'Closed-loop recycling with verified partners across every waste stream.',
      statsColumns: 2,
      stats: [
        {
          value: '405',
          unit: 'Tons',
          label: 'Textile waste recycled',
          lead: true,
        },
        {
          value: '27%',
          label: 'Waste recycling rate',
        },
      ],
      footer: [
        { title: 'Base Paper Ltd.', text: 'Paper recycling initiative' },
        { title: 'Lub-rref BD Ltd.', text: 'Lube Oil recycling initiative' },
        { title: 'JR Recycling', text: 'E-waste recycling initiative' },
        { title: 'By 2026', text: 'Thread cone & plastic recycling' },
      ],
    },
    {
      id: 'water',
      theme: 'water',
      category: 'Water',
      title: 'Water Management',
      description:
        'Reduction, treatment and reuse across the entire production footprint. With Rainwater Harvesting & Push taps & Awareness across all units',
      statsColumns: 2,
      stats: [
        {
          value: '9%',
          label: 'Groundwater withdrawal reduction',
          lead: true,
        },
        {
          value: '2%',
          label: 'Water recycled',
        },
      ],
      footer: [
        { title: 'STP Capacity', text: '40 m³/hr across all units' },
        { title: 'GWTP Capacity', text: '15 m³/hr across all units' },
        { title: 'Blue Water', text: 'Rainwater harvesting across all units' },
        { title: 'Practices', text: 'Push taps and awareness at all units' },
      ],
    },
  ] satisfies PerformanceSnapshotCard[],
}

export type SocialCard = {
  id: string
  number: string
  title: string
  description: string
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
      title: 'Employee Support & Inclusion',
      description:
        'Meaningful benefits and continuous support – performance & festival bonuses, maternity benefits, loan facilities and the Aastha fair-price shop.',
      image: pillar2Image('empowering-employees.jpg'),
      imageAlt: 'Employees gathered outside the Aastha fair-price shop',
    },
    {
      id: 'wellness',
      number: '02',
      title: 'Health, Safety & Wellbeing',
      description:
        'Childcare facilities, nutritional support for children & pregnant employees, on-site medical care, free eye-test campaigns and celebration days.',
      image: pillar2Image('employee-wellness.jpg'),
      imageAlt: 'Children at an employee wellness programme',
    },
    {
      id: 'upskilling',
      number: '03',
      title: 'Learning & Development',
      description:
        'P.A.C.E., WE Women, Mothers@Work and a structured orientation → refreshment → advanced training framework with green-skills and 5S.',
      image: pillar2Image('upskilling.jpg'),
      imageAlt: 'Garment design sketches on a computer monitor',
    },
    {
      id: 'community',
      number: '04',
      title: 'Community Impact',
      description:
        'Nutrition, education, healthcare and disaster support — 510 family food packages, 150,000 vegetable seeds, and aid for single mothers and children.',
      image: pillar2Image('community-care.png'),
      imageAlt: 'Community members receiving relief supplies',
    },
  ] satisfies SocialCard[],
  governanceBadge: 'Governance',
  governanceTitle: 'A Framework for Every Decision',
  governanceRows: [
    // {
    //   id: 'environmental',
    //   title: 'Environmental',
    //   count: 9,
    //   image: pillar2FrameworkImage('environment.png'),
    //   imageAlt: 'Hands holding soil with a green sprout',
    //   policies: [
    //     [
    //       'Environmental Management System',
    //       'Water Policy',
    //       'Waste Management',
    //       'Chemical Purchase',
    //       'MRSL & RSL Management',
    //     ],
    //     ['Energy Policy', 'Air Policy', 'Chemical Management', 'GHG Management'],
    //   ],
    // },
    // {
    //   id: 'social',
    //   title: 'Social',
    //   count: 7,
    //   image: pillar2FrameworkImage('social.jpg'),
    //   imageAlt: 'Hand holding a miniature globe with wind turbines',
    //   policies: [
    //     [
    //       'Human Rights Policy',
    //       'Diversity, Equity & Inclusion',
    //       'Training & Development',
    //       'Child & Forced Labor',
    //     ],
    //     ['Labor Practices & Welfare', 'Health & Safety Policy', 'Talent Acquisition'],
    //   ],
    // },
    {
      id: 'governance',
      title: 'Governance',
      count: 7,
      image: pillar2FrameworkImage('governance.png'),
      imageAlt: 'Professional reviewing anti-corruption collective action framework',
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

export type SustainabilityLogo = {
  id: string
  src: string
  alt: string
}

export const pillar03 = {
  number: '03',
  badge: 'Pillar 03',
  title: 'Material Sustainability',
  description:
    'Responsible sourcing, environmental stewardship and full supply-chain transparency – every garment powered by verified, end-to-end traceable data, from fibre to retail.',
  image: '/images/sustainability/pillar-3/sustainability-pillar03-cover.png',
  imageAlt:
    'Watercolor illustration of green trees blending into a sustainable manufacturing facility',
  sustainablePercentage: 81,
  sustainableLabel:
    'of our material mix is now sustainably sourced – up across cotton, flax and circular fibres.',
  materialsChartTitle: 'Top 5 Sustainable Materials Uptake',
  materials: [
    { id: 'bci', name: 'BCI Cotton', percentage: 37 },
    { id: 'flax', name: 'European Flax (Linen)', percentage: 13 },
    { id: 'organic', name: 'Organic Cotton', percentage: 16 },
    { id: 'us-cotton', name: 'US Cotton', percentage: 5 },
    { id: 'regen-agri', name: 'Regen Agri Cotton', percentage: 5 },
  ] satisfies MaterialBar[],
  traceabilityTitle: 'Traceability Platforms',
  traceabilityLogos: [
    {
      id: 'textile-genesis',
      src: '/images/sustainability/pillar-3/traceability-platforms/textile-genesis.png',
      alt: 'TextileGenesis, a LECTRA company',
    },
    {
      id: 'bci',
      src: '/images/sustainability/pillar-3/traceability-platforms/bci.png',
      alt: 'Better Cotton Initiative',
    },
    {
      id: 'retraced',
      src: '/images/sustainability/pillar-3/traceability-platforms/retraced.png',
      alt: 'retraced',
    },
    {
      id: 'trustrace',
      src: '/images/sustainability/pillar-3/traceability-platforms/trustrace.png',
      alt: 'trustrace',
    },
    {
      id: 'chain-of-custody',
      src: '/images/sustainability/pillar-3/traceability-platforms/chain-of-custody.png',
      alt: 'Chain of Custody',
    },
    {
      id: 'extranet',
      src: '/images/sustainability/pillar-3/traceability-platforms/extranet.png',
      alt: 'Extranet',
    },
  ] satisfies SustainabilityLogo[],
  standardsTitle: 'Certified to Global Standards',
  standardsLogos: [
    {
      id: 'regenagri',
      src: '/images/sustainability/pillar-3/logos/regenagri.png',
      alt: 'regenagri',
    },
    {
      id: 'gots',
      src: '/images/sustainability/pillar-3/logos/gots.png',
      alt: 'GOTS — Global Organic Textile Standard',
    },
    {
      id: 'reach',
      src: '/images/sustainability/pillar-3/logos/reach.png',
      alt: 'REACH',
    },
  ] satisfies SustainabilityLogo[],
}

export type GovernanceTopic = {
  id: string
  title: string
  description: string
  icon: string
  iconAlt: string
}

const pillar4Image = (file: string) => `/images/sustainability/pillar-4/${file}`

export const pillar04 = {
  number: '04',
  badge: 'Pillar 04',
  title: 'Governance',
  description:
    'Ethics, compliance and accountability embedded into daily operations – governing how we work with people, partners and the planet.',
  heroImage: pillar4Image('pillar-4-cover.png'),
  heroImageAlt: 'Team member presenting anti-corruption collective action frameworks',
  topics: [
    {
      id: 'code-of-ethics',
      title: 'Code of Ethics & Conduct',
      description: 'Binding standard for all employees and suppliers.',
      icon: pillar4Image('icon-code-of-ethics.png'),
      iconAlt: 'Code of Ethics & Conduct',
    },
    {
      id: 'risk-management',
      title: 'Risk Management',
      description: 'Systematic identification and mitigation.',
      icon: pillar4Image('icon-risk-management.png'),
      iconAlt: 'Risk Management',
    },
    {
      id: 'supply-chain-governance',
      title: 'Supply Chain Governance',
      description: 'Accountability across every tier.',
      icon: pillar4Image('icon-supply-chain-governance.png'),
      iconAlt: 'Supply Chain Governance',
    },
    {
      id: 'anti-corruption',
      title: 'Anti-Corruption',
      description: 'Zero tolerance, mandatory training.',
      icon: pillar4Image('icon-anti-corruption.png'),
      iconAlt: 'Anti-Corruption',
    },
    {
      id: 'grievance-policy',
      title: 'Grievance Policy',
      description: 'Protected channels for concerns.',
      icon: pillar4Image('icon-grievance-policy.png'),
      iconAlt: 'Grievance Policy',
    },
    {
      id: 'compliance-engagement',
      title: 'Compliance & Engagement',
      description: 'Alignment with brand and legal requirements.',
      icon: pillar4Image('icon-compliance-engagement.png'),
      iconAlt: 'Compliance & Engagement',
    },
    {
      id: 'quality-policy',
      title: 'Quality Policy',
      description: 'Consistent standards end to end.',
      icon: pillar4Image('icon-quality-policy.png'),
      iconAlt: 'Quality Policy',
    },
  ] satisfies GovernanceTopic[],
}

export const pillar05 = {
  number: '05',
  badge: 'Pillar 05',
  title: 'ESG Disclosure',
  description:
    'In accordance with Global Reporting Initiative (GRI) standards, our sustainability reports communicate our goals, progress, challenges and impact across every ESG area.',
  heroImage: '/images/sustainability/pillar-5/pillar-5-cover.png',
  heroImageAlt: 'A tree-lined pathway surrounded by lush bamboo and tropical greenery',
  reports: [
    {
      id: '2024',
      coverImage: '/images/sustainability/pillar-5/sustainability-report-2024.png',
      title: 'Sustainability Report 2024',
      description:
        'Our first transparent view of the journey toward responsible and sustainable operations – structured disclosures and comprehensive data across E, S & G.',
      variant: 'light' as const,
      pdfHref: '/documents/sustainability/sustainability-report-2024.pdf',
    },
    {
      id: '2025',
      coverImage: '/images/sustainability/pillar-5/sustainability-report-2025.png',
      title: 'Sustainability Report 2025',
      description:
        'Progress against our ESG Strategy 2030 – energy transition, circularity, social impact and the deepening of supply-chain traceability.',
      variant: 'dark' as const,
      pdfHref: '/sustainability-report-2025',
    },
  ],
  ctaText: 'Reporting since 2024 — aligned to GRI standards, with continuous year-on-year disclosure.',
  ctaButtonLabel: 'Talk to our ESG team',
  ctaHref: '/contact',
}

export { certifications, externalAffiliations } from '../certifications/content'

export const sustainabilityCta = {
  badge: "Let's Connect",
  heading: "And Build What's Next, Together",
  description:
    'Get in touch with our team for partnership, sourcing, careers or general inquiries. We will get back to you with answers.',
  buttonLabel: 'Schedule consultation',
  buttonHref: '/contact',
}
