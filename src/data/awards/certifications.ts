export type Certification = {
  id: string
  title: string
  subtitle: string
  logos: { src: string; alt: string }[]
  previewUrl?: string
}

export const awardsHeroSubtitle =
  'We communicate our safety, social and environmental measures externally in a credible and transparent way.'

export const certifications: Certification[] = [
  {
    id: 'cert-grs',
    title: 'GRS',
    subtitle: 'Global Recycled Standard (GRS) v 4.0',
    logos: [{ src: '/images/awards/grs.png', alt: 'Global Recycled Standard (GRS)' }],
  },
  {
    id: 'cert-accord',
    title: 'ACCORD',
    subtitle: 'ACCORD Fire and Building Safety',
    logos: [{ src: '/images/awards/accord.png', alt: 'ACCORD Fire and Building Safety' }],
  },
  {
    id: 'cert-ocs',
    title: 'OCS',
    subtitle: 'Organic Content Standard (OCS) v.3',
    logos: [{ src: '/images/awards/ocs.png', alt: 'Organic Content Standard (OCS)' }],
  },
  {
    id: 'cert-oeko-tex',
    title: 'OEKO-TEX',
    subtitle: 'OEKO-TEX STANDARD 100',
    logos: [{ src: '/images/awards/oeko-tex.png', alt: 'OEKO-TEX STANDARD 100' }],
  },
  {
    id: 'cert-sedex',
    title: 'Sedex',
    subtitle: 'Sedex Members Ethical Trade Audit (SMETA)',
    logos: [{ src: '/images/awards/sedex.png', alt: 'Sedex SMETA' }],
  },
  {
    id: 'cert-bsci',
    title: 'BSCI',
    subtitle: 'amfori BSCI Business Social Compliance Initiative',
    logos: [{ src: '/images/awards/amfori.png', alt: 'amfori BSCI' }],
  },
  {
    id: 'cert-gots',
    title: 'GOTS',
    subtitle: 'Global Organic Textile Standard (GOTS)',
    logos: [{ src: '/images/awards/gots.png', alt: 'Global Organic Textile Standard (GOTS)' }],
  },
  {
    id: 'cert-rcs',
    title: 'RCS',
    subtitle: 'Recycled Claim Standard (RCS)',
    logos: [{ src: '/images/awards/rcs.png', alt: 'Recycled Claim Standard (RCS)' }],
  },
  {
    id: 'cert-wrap',
    title: 'WRAP',
    subtitle: 'Worldwide Responsible Accredited Production',
    logos: [{ src: '/images/awards/wrap.png', alt: 'WRAP' }],
  },
  {
    id: 'cert-leed-gold',
    title: 'LEED | GOLD',
    subtitle: 'LEED Gold Certification',
    logos: [{ src: '/images/awards/eed-gold.png', alt: 'LEED Gold Certification' }],
  },
  {
    id: 'cert-gsv',
    title: 'GSV',
    subtitle: 'Global Security Verification (GSV)',
    logos: [{ src: '/images/awards/gsv.png', alt: 'Global Security Verification (GSV)' }],
  },
  {
    id: 'cert-european-flax',
    title: 'EUROPEAN FLAX',
    subtitle: 'European Flax Certification',
    logos: [{ src: '/images/awards/european-flax.png', alt: 'European Flax Certification' }],
  },
  {
    id: 'cert-sac',
    title: 'SUSTAINABLE APPAREL COALITION',
    subtitle: 'Higg Index / Sustainable Apparel Coalition',
    logos: [{ src: '/images/awards/higg-index.png', alt: 'Higg Index' }],
  },
]
