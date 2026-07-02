export type RoadmapPointerDirection = 'up' | 'down'
export type RoadmapTextSide = 'left' | 'right'

export type RoadmapItem = {
  id: string
  number: string
  title: string
  description: string
  color: string
  pointerDirection: RoadmapPointerDirection
  textSide: RoadmapTextSide
  /** Pointer tip anchor in street SVG coordinates (1920×771). */
  anchorX: number
  anchorY: number
}

export const ROADMAP_STREET_IMAGE = '/images/roadmap/street-illustration.svg'
export const ROADMAP_VIEWBOX_WIDTH = 1920
export const ROADMAP_VIEWBOX_HEIGHT = 771

/**
 * Road edge Y positions from street-illustration.svg (#404950 path).
 * Down pointers anchor just inside the top edge; up pointers just inside the bottom edge.
 */
const ROAD_EDGE_Y = {
  level1: { top: 0, bottom: 104 },
  level2: { top: 244.5, bottom: 348.5 },
  level3: { top: 489, bottom: 593 },
  level4: { top: 641.5, bottom: 745.5 },
} as const

/** How far pointer tips sit inside the road from the nearest edge (SVG px). */
const ROAD_ANCHOR_INSET = 22

function roadAnchorY(
  level: keyof typeof ROAD_EDGE_Y,
  direction: RoadmapPointerDirection,
): number {
  const edge = ROAD_EDGE_Y[level]
  return direction === 'down'
    ? edge.top + ROAD_ANCHOR_INSET
    : edge.bottom - ROAD_ANCHOR_INSET
}

export const roadmapItems: RoadmapItem[] = [
  {
    id: 'about-roadmap-portfolio',
    number: '01',
    title: 'Portfolio Expansion',
    description: 'Dedicated facility for dress shirts and premium formalwear.',
    color: '#2595D5',
    pointerDirection: 'down',
    textSide: 'right',
    anchorX: 150,
    anchorY: roadAnchorY('level1', 'down'),
  },
  {
    id: 'about-roadmap-outerwear',
    number: '03',
    title: 'Outerwear Excellence',
    description: 'Specialized unit for performance apparel and advanced outerwear.',
    color: '#F3215D',
    pointerDirection: 'down',
    textSide: 'right',
    anchorX: 760,
    anchorY: roadAnchorY('level2', 'down'),
  },
  {
    id: 'about-roadmap-global-growth',
    number: '02',
    title: 'Global Growth',
    description: 'Overseas manufacturing expansion planned by 2030.',
    color: '#5ABE8C',
    pointerDirection: 'up',
    textSide: 'left',
    anchorX: 500,
    anchorY: roadAnchorY('level2', 'up'),
  },
  {
    id: 'about-roadmap-partnerships',
    number: '04',
    title: 'Strategic Partnerships',
    description: 'Collaborating with industry leaders to accelerate innovation and growth.',
    color: '#1B3F6F',
    pointerDirection: 'down',
    textSide: 'right',
    anchorX: 1100,
    anchorY: roadAnchorY('level3', 'down'),
  },
  {
    id: 'about-roadmap-sustainability',
    number: '05',
    title: 'Sustainability Leadership',
    description: 'Driving measurable progress toward our 2030 commitments.',
    color: '#29704E',
    pointerDirection: 'up',
    textSide: 'left',
    anchorX: 1300,
    anchorY: roadAnchorY('level3', 'up'),
  },
]
