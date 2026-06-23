import type { IndustryLocationProps } from '../../components/industry'

export const izakayaLocations: IndustryLocationProps = {
  id: 'izakaya-locations',
  badge: 'Restaurants',
  title: 'Visit IZAKAYA across Dhaka.',
  description:
    "Experience IZAKAYA's Japanese-inspired dining across Dhaka, where sushi, ramen, small plates, and fusion flavors come together in a warm, modern restaurant atmosphere.",
  locations: [
    {
      id: 'dhanmondi',
      number: '01',
      title: 'Dhanmondi',
      subtitle:
        'Green Rawshanara Tower [Level 9], 755 Satmasjid Road, Dhanmondi C/A (Opposite Abahani Math, in the Miniso/BFC building)',
    },
    {
      id: 'uttara',
      number: '02',
      title: 'Uttara',
      subtitle: 'House# 26, Rabindra Sarani, Uttara (Sector-7)',
    },
    {
      id: 'gulshan',
      number: '03',
      title: 'Gulshan',
      subtitle: 'Level 5, Meher Nibas, House-12/B, Road 55, Gulshan-2',
    },
  ],
}
