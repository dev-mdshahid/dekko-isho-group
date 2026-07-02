import type { ReactNode } from 'react'

import { globusGarmentsResponsibilityIcons } from './globusGarmentsResponsibilityIcons'

export type GlobusGarmentsResponsibilityItem = {
  id: string
  icon: ReactNode
  title: string
  description: string
}

export const globusGarmentsResponsibilityIntro = {
  badge: 'Responsibility in every stitch',
  title: 'Compliant, efficient, and built to last',
  description:
    'Globus Garments operates to the group\u2019s ESG 2030 commitments \u2014 cleaner energy, responsible water and chemical management, and verified compliance across every order.',
  imageSrc: '/images/globus-responsibility.png',
  imageAlt: 'Neutral-toned garments hanging on a rack beside pampas grass',
}

export const globusGarmentsResponsibilityItems: GlobusGarmentsResponsibilityItem[] = [
  {
    id: 'compliance',
    icon: globusGarmentsResponsibilityIcons.compliance,
    title: 'Compliance & audit readiness',
    description:
      '85% Higg FEM and a 100% RSC progress rate, with ZDHC chemical management and transparent, audit-ready operations.',
  },
  {
    id: 'energy',
    icon: globusGarmentsResponsibilityIcons.energy,
    title: 'Energy & climate',
    description:
      '2.8 MWp of rooftop solar in operation today, with a further 1.00 MWp planned by 2027 as part of the group\u2019s clean-energy roadmap.',
  },
  {
    id: 'water',
    icon: globusGarmentsResponsibilityIcons.water,
    title: 'Water stewardship',
    description:
      'A 1 m\u00B3/hr rainwater harvesting system and 5 m\u00B3/hr grey-water treatment, working toward a 40% reduction in water use.',
  },
  {
    id: 'traceability',
    icon: globusGarmentsResponsibilityIcons.traceability,
    title: 'Traceability',
    description:
      'End-to-end material tracking gives buyers quality assurance, sustainability evidence and full supply-chain visibility.',
  },
]
