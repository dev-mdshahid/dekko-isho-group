import { solutionPath } from '../solutions/solutions'

export type ServiceFeatureGroup = {
  group: string
  items: string[]
}

export type ServiceSpeciality = {
  id: string
  linkId: string
  imageWId: string
  arrowWIds: [string, string]
  wrapperClass: 'one' | 'two' | 'three' | 'four' | 'five'
  title: string
  icon: string
  image: string
  featureLabel?: string
  features: string[] | ServiceFeatureGroup[]
  to: string
}

export const serviceSpecialities: ServiceSpeciality[] = [
  {
    id: 'bc23f244-bfd2-2ac7-1a49-5f880f92e2a4',
    linkId: 'bc23f244-bfd2-2ac7-1a49-5f880f92e2a4',
    imageWId: 'd4d290b2-cf1f-2b7c-1c15-7a88dddc2d17',
    arrowWIds: ['6c3d66a0-b420-e0a5-aade-cb7ede5a2f49', '1b0d8c68-7925-4e4c-b357-5d041e365520'],
    wrapperClass: 'one',
    title: 'Versatility at Scale',
    icon: '/images/specialities/versatility-icon.png',
    image: '/images/specialities/versatility.png',
    featureLabel: 'Manufacturing Capacity',
    features: [
      'High-quality woven and denim garments, including bottoms, tops, outerwear, and accessories for men, women, and children.',
      '3.5 million pieces/month',
      '18,000+ Skilled People',
    ],
    to: solutionPath('manufacturing'),
  },
  {
    id: '77cde797-b601-13a8-b976-f135a003b69f',
    linkId: '77cde797-b601-13a8-b976-f135a003b69f',
    imageWId: '77cde797-b601-13a8-b976-f135a003b6a3',
    arrowWIds: ['77cde797-b601-13a8-b976-f135a003b6b7', '77cde797-b601-13a8-b976-f135a003b6b8'],
    wrapperClass: 'two',
    title: 'End-to-End Transparency',
    icon: '/images/specialities/visibility-icon.png',
    image: '/images/specialities/visibility.png',
    featureLabel: 'Operational Transparency',
    features: ['Responsible Sourcing', 'End-to-End Traceability', 'Compliance Monitoring'],
    to: solutionPath('compliance-sustainability'),
  },
  {
    id: 'fd6444eb-66fc-2dbd-3d3a-042d56ad9110',
    linkId: 'fd6444eb-66fc-2dbd-3d3a-042d56ad9110',
    imageWId: 'fd6444eb-66fc-2dbd-3d3a-042d56ad9114',
    arrowWIds: ['fd6444eb-66fc-2dbd-3d3a-042d56ad9128', 'fd6444eb-66fc-2dbd-3d3a-042d56ad9129'],
    wrapperClass: 'three',
    title: 'Strategically Connected',
    icon: '/images/specialities/strategically-icon.png',
    image: '/images/specialities/strategical.png',
    featureLabel: 'Strategic Presence',
    features: [
      'Prime Manufacturing Locations in the Dhaka & Gazipur Region',
      'Liaison Offices and Display Centers in the USA and Europe',
      'Efficient Logistics and Export Network',
    ],
    to: '/contact',
  },
  {
    id: 'ea75087c-806d-fa5f-23d1-e85b71fbeb55',
    linkId: 'ea75087c-806d-fa5f-23d1-e85b71fbeb55',
    imageWId: 'ea75087c-806d-fa5f-23d1-e85b71fbeb59',
    arrowWIds: ['ea75087c-806d-fa5f-23d1-e85b71fbeb6d', 'ea75087c-806d-fa5f-23d1-e85b71fbeb6e'],
    wrapperClass: 'four',
    title: 'Responsibility in Every Step',
    icon: '/images/specialities/responsibility-icon.png',
    image: '/images/specialities/responsibility.png',
    features: [
      {
        group: 'Sustainability Impact (As of 2025)',
        items: [
          '80% Scope 2 GHG Reduction',
          '81% Sustainable Materials Used',
          '40% Textile Waste Recycled',
          '19,374 m³ Water Reused',
          '613 MWh Solar Energy Generated',
        ],
      },
      // {
      //   group: 'Creating Shared Value',
      //   items: ['Community Impact', 'Employee Well-being'],
      // },
      // {
      //   group: 'Sustainable Consumption & Production',
      //   items: ['402 Tons of Textile Waste Recycled', '80% reduction in GHG emissions'],
      // },
    ],
    to: '/sustainability',
  },
  {
    id: 'service-speciality-05',
    linkId: 'service-speciality-05',
    imageWId: 'service-speciality-05-image',
    arrowWIds: ['service-speciality-05-arrow-1', 'service-speciality-05-arrow-2'],
    wrapperClass: 'five',
    title: 'Intelligence in Every Process',
    icon: '/images/specialities/intelligence-icon.png',
    image: '/images/specialities/intelligence.png',
    features: [
      {
        group: 'Technology & Innovation',
        items: ['GPRO', 'BROWZWEAR & CLO', 'TEXTRONIC', 'Automatic Machines'],
      },
    ],
    to: solutionPath('technology-integration'),
  },
]
