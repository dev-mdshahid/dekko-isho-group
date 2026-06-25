export type RoadmapItem = {
  id: string
  title: string
  description: string
  icon: string
  iconAlt: string
  wide?: boolean
}

const ROADMAP_ICONS = '/images/roadmap'

export const roadmapItems: RoadmapItem[] = [
  {
    id: 'about-roadmap-portfolio',
    title: 'Portfolio Expansion',
    description: 'Dedicated facility for dress shirts and premium formalwear.',
    icon: `${ROADMAP_ICONS}/portfolio.png`,
    iconAlt: 'Portfolio expansion icon',
    wide: true,
  },
  {
    id: 'about-roadmap-outerwear',
    title: 'Outerwear Excellence',
    description: 'Specialized unit for performance apparel and advanced outerwear.',
    icon: `${ROADMAP_ICONS}/outwear.png`,
    iconAlt: 'Outerwear excellence icon',
  },
  {
    id: 'about-roadmap-global-growth',
    title: 'Global Growth',
    description: 'Overseas manufacturing expansion planned by 2030.',
    icon: `${ROADMAP_ICONS}/global-growth.png`,
    iconAlt: 'Global growth icon',
  },
  {
    id: 'about-roadmap-partnerships',
    title: 'Strategic Partnerships',
    description:
      'Collaborating with industry leaders to accelerate innovation and growth.',
    icon: `${ROADMAP_ICONS}/strategic-partnership.png`,
    iconAlt: 'Strategic partnerships icon',
  },
  {
    id: 'about-roadmap-sustainability',
    title: 'Sustainability Leadership',
    description: 'Driving measurable progress toward our 2030 commitments.',
    icon: `${ROADMAP_ICONS}/sustainability-leadership.png`,
    iconAlt: 'Sustainability leadership icon',
  },
]
