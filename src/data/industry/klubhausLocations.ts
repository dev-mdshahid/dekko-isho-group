import type { IndustryLocationProps } from '../../components/industry'

export const klubhausLocations: IndustryLocationProps = {
  id: 'klubhaus-locations',
  badge: 'Stores',
  title: 'Visit Klubhaus across Dhaka.',
  description:
    'Feel free to visit the Klubhaus store with your family and friends, and enjoy our wide selection of high-quality products.',
  locations: [
    {
      id: 'bashundhara',
      number: '01',
      title: 'Bashundhara City',
      subtitle: 'Level 7, Block B',
    },
    {
      id: 'mirpur',
      number: '02',
      title: 'Mirpur 2',
      subtitle: 'RP Tower, Chiriakhana Road, Block D',
    },
    {
      id: 'jamuna',
      number: '03',
      title: 'Jamuna Future Park',
      subtitle: 'West Court, Ground Floor, Shop #015-017B',
    },
  ],
}
