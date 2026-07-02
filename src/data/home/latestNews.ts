export type LatestNewsItem = {
  id: string
  portalName: string
  portalLogo: string
  portalLogoAlt: string
  image: string
  imageAlt: string
  title: string
  description: string
  date: string
  href: string
}

export const latestNewsItems: LatestNewsItem[] = [
  {
    id: 'isho-design-challenge',
    portalName: 'The Daily Star',
    portalLogo: '/images/news/portals/the-daily-star.png',
    portalLogoAlt: 'The Daily Star',
    image: '/images/news/isho-launches-national-design.png',
    imageAlt: "ISHO Launches National Design Challenge to Rethink Women's Safety in Cities",
    title: "ISHO Launches National Design Challenge to Rethink Women's Safety in Cities",
    description:
      "This International Women's Day, ISHO has launched the Women's Day 2026 Design Challenge: Designing Safer Cities for Women, a nationwide design comp...",
    date: 'March 8, 2026',
    href: '/press',
  },
  {
    id: 'butex-career-club',
    portalName: 'TextileToday',
    portalLogo: '/images/news/portals/textile-today.png',
    portalLogoAlt: 'TextileToday',
    image: '/images/news/butex-career-club-visit.png',
    imageAlt: 'BUTEX Career Club visits LEED-Certified Dekko Garments in Gazipur',
    title: 'BUTEX Career Club visits LEED-Certified Dekko Garments in Gazipur',
    description:
      'On August 30, 2025, members of the BUTEX Career Club visited Dekko Garments Ltd., a LEED-certified green factory located in Mawna, Gazipur. The initia...',
    date: 'July 24, 2025',
    href: '/press',
  },
  {
    id: 'jr-recycling-partnership',
    portalName: 'Textile Focus',
    portalLogo: '/images/news/portals/textile-focus.png',
    portalLogoAlt: 'Textile Focus',
    image: '/images/news/dekko-partner-with-recycling.png',
    imageAlt:
      'Dekko ISHO Group Partners with JR Recycling Solutions Ltd. to Strengthen Sustainable E-Waste Management',
    title:
      'Dekko ISHO Group Partners with JR Recycling Solutions Ltd. to Strengthen Sustainable E-Waste M...',
    description:
      'In a significant step toward advancing environmental sustainability and responsible business practices, Dekko ISHO Group has entere...',
    date: 'May 13, 2026',
    href: '/press',
  },
]
