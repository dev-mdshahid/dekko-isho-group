import type { IndustryFeatureGalleryProps } from '../../components/industry'

const DEKKO_ISHO_IMAGE_BASE = '/images/dekko-isho'

export const dekkoIshoFeatureGallery: IndustryFeatureGalleryProps = {
  id: 'dekko-isho-feature-gallery',
  badge: 'Cybersecurity Solutions',
  title: 'Risk-aware protection for modern enterprise environments.',
  descriptions: [
    'DITECH focuses on infrastructure security, network security, risk management, cloud security, cybersecurity services, and managed support — helping organizations keep business continuity and operational confidence.',
  ],
  primaryImage: {
    src: `${DEKKO_ISHO_IMAGE_BASE}/dekko-isho-1.png`,
    alt: 'Server racks with dense networking cables in a data center',
  },
  secondaryImages: [
    {
      src: `${DEKKO_ISHO_IMAGE_BASE}/dekko-isho-2.png`,
      alt: 'Hands typing on a laptop displaying code in a dimly lit environment',
    },
    {
      src: `${DEKKO_ISHO_IMAGE_BASE}/dekko-isho-3.png`,
      alt: 'Aisle between rows of server cabinets in a modern data center',
    },
  ],
}
