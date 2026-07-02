import type { IndustryFeatureGalleryProps } from '../../components/industry'

const KLUBHAUS_IMAGE_BASE = '/images/klubhaus'

export const klubhausFeatureGallery: IndustryFeatureGalleryProps = {
  id: 'klubhaus-feature-gallery',
  badge: 'Identity & Values',
  title: 'A fashion identity shaped by optimism, culture, and bold ethics.',
  descriptions: [
    'Klubhaus seamlessly blends the warmth of home with contemporary fashion. Its unique designs convey messages of positivity, self-confidence, and cultural significance, all while remaining attuned to the trends of modern retail. Each piece reflects a commitment to uplifting the spirit and embracing a lifestyle that resonates with today\u2019s consumers.',
  ],
  primaryImage: {
    src: `${KLUBHAUS_IMAGE_BASE}/klubhaus-1.png`,
    alt: 'Klubhaus store interior with concrete stairs and display niche',
  },
  secondaryImages: [
    {
      src: `${KLUBHAUS_IMAGE_BASE}/klubhaus-2.png`,
      alt: 'Klubhaus retail floor with clothing racks and mannequins',
    },
    {
      src: `${KLUBHAUS_IMAGE_BASE}/klubhaus-3.png`,
      alt: 'Klubhaus storefront exterior at night with illuminated facade',
    },
  ],
}
