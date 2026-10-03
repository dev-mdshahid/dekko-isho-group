export type Solution = {
  slug: string
  title: string
  description: string
  image: string
  imageAlt: string
}

export type SolutionLink = {
  slug: string
  to: string
  label: string
}

export const solutions: Solution[] = [
  {
    slug: 'manufacturing',
    title: 'Manufacturing',
    description:
      'Innovation to advance fashion sustainably. Customer satisfaction through true partnership.',
    image: '/images/about/manufacturing.jpg',
    imageAlt: 'Manufacturing facility',
  },
  {
    slug: 'embroidery',
    title: 'Embroidery Unit',
    description:
      'Precision embroidery and applied decoration, kept in-house with high-capacity Barudan and Maya machines.',
    image: '/images/solutions/embroidery-unit.png',
    imageAlt: 'Industrial embroidery machines',
  },
  {
    slug: 'industrial-laundry',
    title: 'Industrial Laundry',
    description:
      'Innovation to advance fashion sustainably. Customer satisfaction through true partnership.',
    image: '/images/about/laundry.jpg',
    imageAlt: 'Industrial laundry',
  },
  {
    slug: 'compliance-sustainability',
    title: 'Compliance & Sustainability',
    description:
      'Innovation to advance fashion sustainably. Customer satisfaction through true partnership.',
    image: '/images/about/compliance.jpg',
    imageAlt: 'Compliance and sustainability',
  },
  {
    slug: 'design-product-development',
    title: 'Design & Product Development',
    description:
      'Innovation to advance fashion sustainably. Customer satisfaction through true partnership.',
    image: '/images/about/design.jpg',
    imageAlt: 'Design and product development',
  },
  {
    slug: 'technology-integration',
    title: 'Technology Integration',
    description:
      'Innovation to advance fashion sustainably. Customer satisfaction through true partnership.',
    image: '/images/about/integration.jpg',
    imageAlt: 'Technology integration',
  },
]

export const FOOTER_SOLUTIONS_LINKS: SolutionLink[] = [
  {
    slug: 'design-product-development',
    to: '/solutions/design-product-development',
    label: 'Design Studio'
  },
  {
    slug: 'manufacturing',
    to: '/solutions/manufacturing',
    label: 'Integrated Manufacturing'
  },
  {
    slug: 'industrial-laundry',
    to: '/solutions/industrial-laundry',
    label: 'Industrial Laundry'
  },
  {
    slug: 'embroidery',
    to: '/solutions/embroidery',
    label: 'Embroidery Unit'
  },
]

export function solutionPath(slug: string): string {
  return `/solutions/${slug}`
}

export function getSolutionBySlug(slug: string): Solution | undefined {
  return solutions.find((solution) => solution.slug === slug)
}
