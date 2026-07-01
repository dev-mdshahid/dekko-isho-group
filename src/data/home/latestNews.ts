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
    id: 'butex-career-club',
    portalName: 'TextileToday',
    portalLogo: '/images/news/portals/textile-today.png',
    portalLogoAlt: 'TextileToday',
    image: '/images/news/butex-career-club-visit.png',
    imageAlt: 'BUTEX Career Club visits LEED-Certified Dekko Garments',
    title: 'BUTEX Career Club visits LEED-Certified Dekko Garments in Gazip...',
    description:
      'On August 30, 2025, members of the BUTEX Career Club visited Dekko Garments Ltd., a LEED-certified...',
    date: '24 July, 2025',
    href: '/press',
  },
  {
    id: 'flood-support',
    portalName: 'TextileToday',
    portalLogo: '/images/news/portals/textile-today.png',
    portalLogoAlt: 'TextileToday',
    image: '/images/news/dekko-extend-support-flood.png',
    imageAlt: 'Dekko ISHO Group extends support to flood-affected communities',
    title: 'Dekko ISHO Group extends support to flood-affected communities',
    description:
      'In response to the devastating impact of recent floods that have affected countless lives across th...',
    date: '21 October, 2024',
    href: '/press',
  },
  {
    id: 'isho-furniture-outlet',
    portalName: 'The Financial Express',
    portalLogo: '/images/news/portals/financial-express.png',
    portalLogoAlt: 'The Financial Express',
    image: '/images/news/online-isho-furniture.png',
    imageAlt: 'Online based ISHO furniture opens first outlet',
    title: 'Online based ISHO furniture opens first outlet',
    description:
      'ISHO, an online based furniture store of Dekko ISHO group, has launched its first outlet in the city, aimin...',
    date: 'Nov 17, 2019',
    href: '/press',
  },
]
