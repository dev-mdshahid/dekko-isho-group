import type { IndustryFeatureGalleryProps } from '../../components/industry'

const ROXY_PAINTS_IMAGE_BASE = '/images/roxy-paints'

export const roxyPaintsFeatureGallery: IndustryFeatureGalleryProps = {
  id: 'roxy-paints-feature-gallery',
  badge: 'History',
  title: 'The history of paint industry in Bangladesh is tied to Roxy.',
  descriptions: [
    'The history of paint industry in Bangladesh, in other words is Roxy Paints Ltd. It is not only because of its uninterrupted manufacturing of quality paints since 1953, it is more so because of Roxy\u2019s being the pioneering national entity. Roxy survived the protracted battle for existence. But its success was manifest not only just in survival; it won the hearts of the millions with world class consistent quality and proper customer service. Our users bear ample testimony of a national paint being international in quality and again at an affordable cost per unit of surface coating area.',
  ],
  primaryImage: {
    src: `${ROXY_PAINTS_IMAGE_BASE}/roxy-paints-1.png`,
    alt: 'Interior room with deep purple textured wall paint and modern furniture',
  },
  secondaryImages: [
    {
      src: `${ROXY_PAINTS_IMAGE_BASE}/roxy-paints-2.jpg`,
      alt: 'Living room with peach-colored wall paint and contemporary decor',
    },
    {
      src: `${ROXY_PAINTS_IMAGE_BASE}/roxy-paints-3.jpg`,
      alt: 'Room with light blue-grey textured wall paint and teal armchair',
    },
  ],
}
