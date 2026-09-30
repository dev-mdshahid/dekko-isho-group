export type JourneyEntry = {
  title: string
  description?: string,
  companyLogo?: string
}

export type JourneyEra = 1 | 2 | 3

export type JourneyMilestone = {
  id: string
  year: string
  era: JourneyEra
  entries: JourneyEntry[]
}

export const journeyEraColors: Record<JourneyEra, string> = {
  1: '#2595d5',
  2: '#ef2d67',
  3: '#3fbf7f',
}

export const journeyMilestones: JourneyMilestone[] = [
  {
    id: 'about-journey-1953',
    year: '1953',
    era: 1,
    entries: [
      {
        title: 'Roxy Paints Ltd.',
        description:
          "Three young entrepreneurs invest in a new idea. Bangladesh’s first color paint manufacturer is born—and a 70-year legacy of innovation begins.",
        companyLogo: "/images/about/company-logo/roxy-paints3.svg",
      },
    ],
  },
  {
    id: 'about-journey-1983',
    year: '1983',
    era: 1,
    entries: [
      {
        title: 'Dekko Garments Ltd. (Old Factory)',
        description:
          'Our apparel manufacturing journey started with just 3 production lines—eventually expanding to over 130+.',
      },
    ],
  },
  {
    id: 'about-journey-1992',
    year: '1992',
    era: 1,
    entries: [
      {
        title: 'Dekko Fashions Ltd.',
        description:
          'Formerly Dekko Apparels Ltd.—a 100% export-oriented woven garments concern.',
      },
    ],
  },
  {
    id: 'about-journey-2006',
    year: '2006',
    era: 1,
    entries: [
      {
        title: 'Dekko Readywears Ltd.',
        description: 'A sister concern specializing in woven garments, fully export-oriented.',
      },
    ],
  },
  {
    id: 'about-journey-2013',
    year: '2013',
    era: 2,
    entries: [
      {
        title: 'Globus Garments Ltd.',
        description: '19 production lines. 300K garments produced per month.',
      },
    ],
  },
  {
    id: 'about-journey-2015',
    year: '2015',
    era: 2,
    entries: [
      {
        title: 'Agami Fashions',
        description:
          'An export-oriented woven garments factory based in Chandra, Gazipur.',
      },
      {
        title: 'Agami Washing Ltd.',
        description:
          'Advanced washing facility supporting the group’s denim and woven production.',
      },
    ],
  },
  {
    id: 'about-journey-2017',
    year: '2017',
    era: 2,
    entries: [
      {
        title: 'Dekko Garments Ltd.',
        description:
          'A LEED Gold-certified apparel manufacturing facility built on sustainable design and environmentally responsible practices.',
      },
    ],
  },
  {
    id: 'about-journey-2018',
    year: '2018',
    era: 2,
    entries: [
      {
        title: 'Globus Embroidery',
        description:
          'A state-of-the-art embroidery facility delivering precision, quality, and versatility.',
      },
      {
        title: 'IZAKAYA',
        description:
          'Contemporary Japanese dining—authentic flavors with a modern culinary experience.',
        companyLogo: "/images/about/company-logo/izakaya3.svg",
      },
      {
        title: 'KLUBHAUS',
        description:
          'A fashion & lifestyle brand blending global influences with local culture to shape style beyond trends.',
        companyLogo: "/images/about/company-logo/klubhaus3.svg",
      },
    ],
  },
  {
    id: 'about-journey-2019',
    year: '2019',
    era: 3,
    entries: [
      {
        title: 'ISHO',
        description:
          'A furniture and lifestyle brand, redefining modern living through contemporary design and innovation.',
        companyLogo: "/images/about/company-logo/isho3.svg",
      },
    ],
  },
  {
    id: 'about-journey-2020',
    year: '2020',
    era: 3,
    entries: [
      {
        title: 'Ecovia',
        description:
          'A sustainability-driven business transforming textile waste into compostable packaging solutions.',
        companyLogo: "/images/about/company-logo/ecovia3.svg",
      },
    ],
  },
  {
    id: 'about-journey-2021',
    year: '2021',
    era: 3,
    entries: [
      {
        title: 'Dekko ISHO Technologies Ltd. (DITECH)',
        description:
          'A strategic technology solutions partner delivering integrated digital infrastructure.',
        companyLogo: "/images/about/company-logo/ditech3.svg",
      },
    ],
  },
  {
    id: 'about-journey-2022',
    year: '2022',
    era: 3,
    entries: [
      {
        title: 'Dekko ISHO Venture Capital',
        description:
          'A venture capital firm investing in and nurturing high-potential startups and emerging businesses.',
        companyLogo: "/images/about/company-logo/divc3.svg",
      },
    ],
  },
  {
    id: 'about-journey-2026',
    year: '2026',
    era: 3,
    entries: [
      {
        title: 'Dekko Garments Limited (Unit 2)',
        description: 'The next chapter of sustainable, large-scale apparel manufacturing.',
      },
    ],
  },
]
