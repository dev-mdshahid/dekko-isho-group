export type JourneyMilestone = {
  id: string
  year: string
  title: string
  description: string
  imageAlt: string
  image: string
}

const JOURNEY_IMAGE = '/images/dekko-companies'

export const journeyMilestones: JourneyMilestone[] = [
  {
    id: 'about-journey-1953',
    year: '1953',
    title: 'Roxy Paints Ltd.',
    description:
      "Bangladesh's first color paint manufacturer — three entrepreneurs, one bold idea that sparked a legacy of innovation.",
    imageAlt: 'Roxy Paints Ltd. logo',
    image: `${JOURNEY_IMAGE}/roxy-paints.png`,
  },
  {
    id: 'about-journey-1983',
    year: '1983',
    title: 'Dekko Garments Ltd.',
    description:
      'Entry into the apparel industry with three production lines, eventually expanding to 108+ lines across the group.',
    imageAlt: 'Dekko Garments Ltd. factory',
    image: `${JOURNEY_IMAGE}/dekko-graments.png`,
  },
  {
    id: 'about-journey-1992',
    year: '1992',
    title: 'Dekko Apparels Ltd.',
    description:
      'A 100% export-oriented woven garments concern, strengthening the group\u2019s global manufacturing footprint.',
    imageAlt: 'Dekko Apparels Ltd. production floor',
    image: `${JOURNEY_IMAGE}/dekko-apparels.png`,
  },
  {
    id: 'about-journey-2006',
    year: '2006',
    title: 'Dekko Readywears Ltd.',
    description:
      'A sister concern specializing in woven garments, further diversifying the group\u2019s apparel capabilities.',
    imageAlt: 'Dekko Readywears Ltd. facility',
    image: `${JOURNEY_IMAGE}/dekko-readywears.png`,
  },
  {
    id: 'about-journey-2013',
    year: '2013',
    title: 'Globus Garments Ltd.',
    description:
      '18 production lines, 1,319 machines, and 300k+ garments per month — scaling capacity at industrial pace.',
    imageAlt: 'Globus Garments Ltd. building',
    image: `${JOURNEY_IMAGE}/globus-graments.png`,
  },
  {
    id: 'about-journey-2015-agami-fashions',
    year: '2015',
    title: 'Agami Fashions',
    description:
      'An export-oriented factory in Gazipur, expanding the group\u2019s reach in woven garment production.',
    imageAlt: 'Agami Fashions factory floor',
    image: `${JOURNEY_IMAGE}/agami-fashions.png`,
  },
  {
    id: 'about-journey-2015-agami-washing',
    year: '2015',
    title: 'Agami Washing',
    description:
      'Partnered with top buyers to deliver high-quality washing and processing for export-ready garments.',
    imageAlt: 'Agami Washing facility',
    image: `${JOURNEY_IMAGE}/agami-washing.png`,
  },
  {
    id: 'about-journey-2017',
    year: '2017',
    title: 'Dekko Garments — Green Factory',
    description:
      'A sustainable RMG factory built from the ground up — setting new standards for environmentally conscious manufacturing.',
    imageAlt: 'Dekko Garments green factory',
    image: `${JOURNEY_IMAGE}/dekko-garments.png`,
  },
  {
    id: 'about-journey-2021-divc',
    year: '2021',
    title: 'DIVC — Dekko ISHO Venture Capital',
    description:
      'Helping early-stage startups scale with capital, mentorship, and the backing of a multi-industry group.',
    imageAlt: 'DIVC logo',
    image: `${JOURNEY_IMAGE}/divc.png`,
  },
  {
    id: 'about-journey-2021-ditech',
    year: '2021',
    title: 'DITECH — Dekko ISHO Technologies',
    description:
      'A deep-tech initiative spanning cybersecurity, AI, and enterprise solutions for the digital age.',
    imageAlt: 'DITECH logo',
    image: `${JOURNEY_IMAGE}/ditech.png`,
  },
]

export const journeySummary =
  'From a single paint factory to a multi-industry group spanning RMG, furniture, fashion retail, restaurants, paints, fintech, deep tech and green tech.'
