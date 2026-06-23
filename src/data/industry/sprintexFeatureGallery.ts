import type { IndustryFeatureGalleryProps } from '../../components/industry'

const SPRINTEX_IMAGE_BASE = '/images/sprintex'

export const sprintexFeatureGallery: IndustryFeatureGalleryProps = {
  id: 'sprintex-feature-gallery',
  badge: 'Machine Features',
  title: 'Advanced printing technology built for speed, precision, and efficiency.',
  descriptions: [
    'Sprintex operates with 24-hour printing production, high-precision industrial print heads, variable drop size, higher ink concentration for greater economy, intelligent output, and ink consumption management — delivering consistent quality across custom textile runs.',
  ],
  primaryImage: {
    src: `${SPRINTEX_IMAGE_BASE}/sprintex-1.jpg`,
    alt: 'Large-scale digital textile printing machinery with colorful fabric rolls in production',
  },
  secondaryImages: [
    {
      src: `${SPRINTEX_IMAGE_BASE}/sprintex-2.jpg`,
      alt: 'Industrial textile printing rollers processing fabric through production equipment',
    },
    {
      src: `${SPRINTEX_IMAGE_BASE}/sprintex-3.jpg`,
      alt: 'Technician operating digital textile printing controls in a modern factory floor',
    },
  ],
}
