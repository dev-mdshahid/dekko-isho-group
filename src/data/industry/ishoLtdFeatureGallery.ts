import type { IndustryFeatureGalleryProps } from '../../components/industry'

const ISHO_LTD_IMAGE_BASE = '/images/isho-ltd'

export const ishoLtdFeatureGallery: IndustryFeatureGalleryProps = {
  id: 'isho-ltd-feature-gallery',
  badge: 'Commitment',
  title: 'Unlocking the potential of space through functional design.',
  descriptions: [
    'From pushing boundaries to create sustainable designs, to our concept studio, and innovation lab, we love nothing more than unlocking the potential of space. Our commitment is steadfast in ensuring our designs are functional and efficient whilst never undermining aesthetics.',
    'Our goal is a simple one and that is to bridge the gap between what is desired in modern living and what is available in the market.',
    'ISHO Furniture shop offers a unique selection of stylish furniture. Our furniture range includes beds, sofa sets, dining tables, chair, dressing tables, sofa cum bed. ISHO is one of the leading Furniture Manufacturers in Bangladesh.',
    'Discover ISHO, an emporium of a wide range of furniture and homeware for your home & office. ISHO creates affordable, well-designed & functional designs that reflect your style; from sofa to bed and lighting to dining table create your space with ISHO\u2019s globally inspired designs.',
  ],
  primaryImage: {
    src: `${ISHO_LTD_IMAGE_BASE}/isho-1.png`,
    alt: 'Modern dining set with patterned chairs in a bright interior',
  },
  secondaryImages: [
    {
      src: `${ISHO_LTD_IMAGE_BASE}/isho-2.png`,
      alt: 'Dining set in a minimalist industrial room',
    },
    {
      src: `${ISHO_LTD_IMAGE_BASE}/isho-3.png`,
      alt: 'Blue velvet armchair in a living room setting',
    },
  ],
}
