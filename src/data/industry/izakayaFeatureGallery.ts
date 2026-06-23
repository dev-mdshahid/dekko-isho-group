import type { IndustryFeatureGalleryProps } from '../../components/industry'

const IZAKAYA_IMAGE_BASE = '/images/izakaya'

export const izakayaFeatureGallery: IndustryFeatureGalleryProps = {
  id: 'izakaya-feature-gallery',
  badge: 'Dining Experience',
  title: 'A warm atmosphere where Japanese flavors meet modern fusion.',
  descriptions: [
    'From sushi and ramen to grilled small plates and fusion creations, IZAKAYA brings together the spirit of Japanese casual dining with a contemporary setting designed for sharing, conversation, and memorable meals.',
  ],
  primaryImage: {
    src: `${IZAKAYA_IMAGE_BASE}/izakaya-1.jpg`,
    alt: 'IZAKAYA restaurant interior with warm lighting and contemporary decor',
  },
  secondaryImages: [
    {
      src: `${IZAKAYA_IMAGE_BASE}/izakaya-2.jpg`,
      alt: 'Japanese-inspired dishes and small plates served at IZAKAYA',
    },
    {
      src: `${IZAKAYA_IMAGE_BASE}/izakaya-3.png`,
      alt: 'IZAKAYA dining space with modern presentation and relaxed atmosphere',
    },
  ],
}
