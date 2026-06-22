export type DekkoFashionsCapabilityItem = {
  id: string
  number: string
  title: string
  description: string
}

export const dekkoFashionsCapabilityIntro = {
  badge: 'Core Capability',
  title: 'Built for woven apparel programs that demand precision.',
  description:
    'Dekko Fashions Ltd. supports global buyers with design-aware manufacturing, quality-focused execution, and reliable production coordination across modern woven fashion categories.',
}

export const dekkoFashionsCapabilityItems: DekkoFashionsCapabilityItem[] = [
  {
    id: 'woven',
    number: '01',
    title: 'Woven Apparel Expertise',
    description:
      'Specialized manufacturing support for woven fashion products with attention to fit, construction, finishing, and detail consistency.',
  },
  {
    id: 'design-production',
    number: '02',
    title: 'Design-to-Production Support',
    description:
      'Clear coordination between development, technical approval, production planning, and bulk execution for fashion collections.',
  },
  {
    id: 'quality',
    number: '03',
    title: 'Quality-Focused Execution',
    description:
      'Controlled inspection, workmanship consistency, and disciplined production monitoring support export-ready apparel quality.',
  },
  {
    id: 'delivery',
    number: '04',
    title: 'Reliable Delivery Control',
    description:
      'Structured planning and shipment preparation help buyers manage seasonal timelines and dependable delivery expectations.',
  },
]
