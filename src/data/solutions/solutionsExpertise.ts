const SOLUTIONS_IMAGES = '/images/solutions'

export type SolutionsExpertiseTab = {
  id: string
  label: string
  tag: string
  title: string
  description: string
  image: string
  imageAlt: string
  features: string[]
}

export const solutionsExpertiseTabs: SolutionsExpertiseTab[] = [
  {
    id: 'design-studio',
    label: 'Design Studio',
    tag: 'From Concept',
    title: 'Design Studio',
    description:
      'Comprehensive design studio enabling innovation, material sourcing and sample production.',
    image: `${SOLUTIONS_IMAGES}/design-studio.png`,
    imageAlt: 'Fashion designer working in a design studio',
    features: [
      'Trend Research & Fashion Forecasting',
      'Fabric Library (Sourcing & R&D)',
      'Digital Integration',
      'Co-Design Approach',
    ],
  },
  {
    id: 'integrated-manufacturing',
    label: 'Integrated Manufacturing',
    tag: 'At Scale',
    title: 'Integrated Manufacturing',
    description:
      'End-to-end apparel manufacturing with cutting, sewing, finishing and quality control under one roof.',
    image: `${SOLUTIONS_IMAGES}/integrated-manufacturing.png`,
    imageAlt: 'Garment worker operating an industrial sewing machine',
    features: [
      "Increasing use of automated machines",
      "Focus on energy conservation",
      "Quality-focused production process",
      "Multiproduct capabilities",
    ]
  },
  {
    id: 'industrial-laundry',
    label: 'Industrial Laundry',
    tag: 'Sustainable Finish',
    title: 'Industrial Laundry',
    description:
      'Advanced garment washing and finishing with controlled recipes, consistency and bulk production scale.',
    image: `${SOLUTIONS_IMAGES}/industrial-laundry.png`,
    imageAlt: 'Industrial laundry machines in a washing facility',
    features: [
      "Advanced garment washing and finishing",
      "Ensuring a sustainable process",
      "State-of-the-art European machine setup",
      "Garment dye and denim washing facility",
      "Sustainable dyeing and finishing facilities",
    ]
  },
  {
    id: 'embroidery',
    label: 'Embroidery',
    tag: 'Detail Craft',
    title: 'Embroidery',
    description:
      'In-house embroidery capability with quality control, defect management and production-ready finishing.',
    image: `${SOLUTIONS_IMAGES}/embroidery-unit.png`,
    imageAlt: 'Multi-head industrial embroidery machines',
    features: [
      '16 Color embroidery head',
      'Schiffli new machine',
    ],
  },
]

export const solutionsExpertiseDecorImages = [
  {
    src: `${SOLUTIONS_IMAGES}/design-studio.png`,
    alt: 'Fashion design studio workspace',
    className: 'solutions-expertise-decor--left-top',
  },
  {
    src: `${SOLUTIONS_IMAGES}/industrial-laundry.png`,
    alt: 'Industrial laundry facility',
    className: 'solutions-expertise-decor--left-bottom',
  },
  {
    src: `${SOLUTIONS_IMAGES}/embroidery-unit.png`,
    alt: 'Industrial embroidery machines',
    className: 'solutions-expertise-decor--right-top',
  },
  {
    src: `${SOLUTIONS_IMAGES}/integrated-manufacturing.png`,
    alt: 'Garment manufacturing floor',
    className: 'solutions-expertise-decor--right-bottom',
  },
] as const
