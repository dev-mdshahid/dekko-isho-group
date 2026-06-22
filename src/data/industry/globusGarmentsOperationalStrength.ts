export type GlobusGarmentsOperationalStrengthItem = {
  id: string
  value: string
  description: string
}

export const globusGarmentsOperationalStrengthIntro = {
  badge: 'Operational Strength',
  title: 'Production reliability backed by planning, people, and process control.',
}

export const globusGarmentsOperationalStrengthItems: GlobusGarmentsOperationalStrengthItem[] = [
  {
    id: 'export',
    value: '100%',
    description:
      'Export-oriented apparel manufacturing focus for international buyer programs.',
  },
  {
    id: 'stages',
    value: '04',
    description:
      'Core stages: material preparation, sewing, finishing, and shipment readiness.',
  },
  {
    id: 'support',
    value: '360°',
    description:
      'Support across technical alignment, production planning, quality, and delivery.',
  },
  {
    id: 'quality',
    value: 'QC',
    description:
      'Quality-focused monitoring across production and final export preparation.',
  },
]
