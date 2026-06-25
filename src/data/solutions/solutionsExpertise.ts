const SOLUTIONS_IMAGES = '/images/solutions'

export type SolutionsExpertiseTab = {
  id: string
  label: string
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
    title: 'Design Studio',
    description:
      'Comprehensive design studio enabling innovation, material sourcing and sample production.',
    image: `${SOLUTIONS_IMAGES}/design-studio.png`,
    imageAlt: 'Fashion designer working in a design studio',
    features: [
      'Trend Research & Fashion Forecasting',
      'Fabric Library (Sourcing & R&D)',
      'Smart Design Integration',
      'Co-Design Approach',
    ],
  },
  {
    id: 'integrated-manufacturing',
    label: 'Integrated Manufacturing',
    title: 'Integrated Manufacturing',
    description:
      'End-to-end apparel manufacturing with cutting, sewing, finishing and quality control under one roof.',
    image: `${SOLUTIONS_IMAGES}/integrated-manufacturing.png`,
    imageAlt: 'Garment worker operating an industrial sewing machine',
    features: [
      'Cutting, Sewing & Finishing',
      'In-Process Quality Control',
      'Scalable Production Capacity',
      'Multi-Unit Manufacturing Network',
    ],
  },
  {
    id: 'industrial-laundry',
    label: 'Industrial laundry',
    title: 'Industrial Laundry',
    description:
      'Advanced garment washing and finishing with controlled recipes, consistency and bulk production scale.',
    image: `${SOLUTIONS_IMAGES}/industrial-laundry.png`,
    imageAlt: 'Industrial laundry machines in a washing facility',
    features: [
      'Wet & Dry Wash Processes',
      'Advanced Laundry Technology',
      'Denim Washing Capacity',
      'Sample to Bulk Wash Development',
    ],
  },
  {
    id: 'embroidery',
    label: 'Embroidery',
    title: 'Embroidery',
    description:
      'In-house embroidery capability with quality control, defect management and production-ready finishing.',
    image: `${SOLUTIONS_IMAGES}/embroidery-unit.jpg`,
    imageAlt: 'Multi-head industrial embroidery machines',
    features: [
      'Placement & Color Accuracy',
      'Stitching Consistency Across Heads',
      'In-Process Quality Control',
      'Defect Management & Correction',
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
    src: `${SOLUTIONS_IMAGES}/embroidery-unit.jpg`,
    alt: 'Industrial embroidery machines',
    className: 'solutions-expertise-decor--right-top',
  },
  {
    src: `${SOLUTIONS_IMAGES}/integrated-manufacturing.png`,
    alt: 'Garment manufacturing floor',
    className: 'solutions-expertise-decor--right-bottom',
  },
] as const
