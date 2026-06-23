export type Solution = {
  slug: string
  title: string
  description: string
  image: string
  imageAlt: string
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

export function solutionPath(slug: string): string {
  return `/solutions/${slug}`
}

export function getSolutionBySlug(slug: string): Solution | undefined {
  return solutions.find((solution) => solution.slug === slug)
}
