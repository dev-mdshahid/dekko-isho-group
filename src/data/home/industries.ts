export type Industry = {
  tab: string
  tabLabel: string
  name: string
  description: string
  image: string
  imageSrcSet: string
  icon: string
  features: string[]
}

export const homeIndustries: Industry[] = [
  {
    tab: 'Tab 1',
    tabLabel: 'Aerospace industry',
    name: 'Aerospace',
    description:
      'Certified aerospace components built for mission-critical performance and full traceability.',
    image: '3930.jpg',
    imageSrcSet: '/legacy/images/3930-p-500.jpg 500w, /legacy/images/3930.jpg 533w',
    icon: 'Industry-icon.svg',
    features: [
      'Full material traceability',
      'NADCAP special process approval',
      'Critical safety component expertise',
    ],
  },
  {
    tab: 'Tab 2',
    tabLabel: 'Automotive',
    name: 'Automotive',
    description:
      'Precision automotive components engineered for peak performance and complete reliability.',
    image: '3-3.jpg',
    imageSrcSet: '/legacy/images/3-3-p-500.jpg 500w, /legacy/images/3-3.jpg 533w',
    icon: 'Automotive.svg',
    features: ['Precision engine parts', 'Reliable transmission components', 'Durable structural elements'],
  },
  {
    tab: 'Tab 3',
    tabLabel: 'Medical devices',
    name: 'Medical devices',
    description:
      'High-precision medical devices for safer, more effective patient care and diagnostics.',
    image: '3-1.jpg',
    imageSrcSet: '/legacy/images/3-1-p-500.jpg 500w, /legacy/images/3-1.jpg 533w',
    icon: 'Medical-devices.svg',
    features: ['Enhanced Patient Care', 'Safety and Reliability', 'Operational Efficiency'],
  },
  {
    tab: 'Tab 4',
    tabLabel: 'Energy & Power',
    name: 'Energy & Power',
    description: 'Innovative energy systems delivering reliable, efficient, and sustainable performance.',
    image: '3-2.jpg',
    imageSrcSet: '/legacy/images/3-2-p-500.jpg 500w, /legacy/images/3-2.jpg 533w',
    icon: 'Energy--Power.svg',
    features: ['Reliable Energy Supply', 'Efficiency Optimization', 'Sustainability Focused'],
  },
  {
    tab: 'Tab 5',
    tabLabel: 'Industrial equipment',
    name: 'Industrial equipment',
    description:
      'High-performance industrial machinery designed for productivity, durability, and efficient operations.',
    image: '2_12.webp',
    imageSrcSet: '/legacy/images/2_1-p-500.webp 500w, /legacy/images/2_12.webp 533w',
    icon: 'Industrial-equipment.svg',
    features: ['Enhanced Productivity', 'Durable and Reliable', 'Versatile Applications'],
  },
]

export const industryBackgrounds = [
  { id: '68a88700-03b2-b1ae-401e-bd7fd327a74c', image: 'Industry-image-bg-2.png', className: 'one' },
  { id: 'bb1d146f-3020-9314-d86a-8b5d20f602bd', image: 'Industry-image-bg-5_1Industry-image-bg-5.png', className: 'two' },
  { id: 'ec80440d-ee55-273b-2ae9-ce265c3afa17', image: 'Industry-image-bg-1.png', className: 'three' },
  { id: '17719652-441a-8e4d-6709-ab16c3504a7d', image: 'Industry-image-bg-3_1Industry-image-bg-3.png', className: 'four' },
  { id: '67adcfec-de99-018d-1042-48952abe5b3f', image: 'Industry-image-bg-4.png', className: 'five' },
]
