export type AgamiFashionsShowcaseCategory = {
  id: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
}

const AGAMI_FASHIONS_IMAGE_BASE = '/images/agami-fashions'

export const agamiFashionsShowcaseBanner = {
  eyebrow: 'RMG / Fashion Apparel',
  title: 'Agami Fashions Ltd.',
  description:
    'A forward-looking apparel unit focused on fashion-ready woven products, agile development, and dependable export execution.',
  imageSrc: `${AGAMI_FASHIONS_IMAGE_BASE}/agami-fashions.jpg`,
  imageAlt: 'Woman with shopping bags representing fashion apparel retail',
}

export const agamiFashionsShowcaseIntro = {
  badge: 'Agami Fashions Ltd.',
  title: 'Future-ready fashion manufacturing for modern buyers.',
}

export const agamiFashionsShowcaseCategories: AgamiFashionsShowcaseCategory[] = [
  {
    id: 'kid',
    title: 'Kid',
    description:
      'Supports buyer concepts through sampling, fit refinement, fabric coordination, and production-ready planning.',
    imageSrc: `${AGAMI_FASHIONS_IMAGE_BASE}/agami-kids.png`,
    imageAlt: 'Children representing kidswear category',
  },
  {
    id: 'man',
    title: 'Man',
    description:
      'Focused on structured woven fashion categories for seasonal collections and retail programs.',
    imageSrc: `${AGAMI_FASHIONS_IMAGE_BASE}/agami-man.png`,
    imageAlt: 'Man representing menswear category',
  },
  {
    id: 'women',
    title: 'Women',
    description:
      'Designed for efficient production movement from sample approval to cutting, sewing, finishing, and packing.',
    imageSrc: `${AGAMI_FASHIONS_IMAGE_BASE}/agami-women.png`,
    imageAlt: 'Women representing womenswear category',
  },
]

export const agamiFashionsShowcaseFooter = [
  'Agami Fashions Ltd. can be presented as a progressive apparel manufacturing unit within the Dekko ISHO ecosystem, combining fashion sensitivity with practical production capability. The section should feel modern, confident, and aligned with buyer-facing garment business communication.',
  'The content direction highlights a full product journey: concept understanding, sample development, material handling, production execution, quality checking, finishing, packing, and delivery preparation.',
]
