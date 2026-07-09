import { awardLogos, type AwardLogo } from '../awards/logoGrid'

const certificationLogoSrc = (assetNumber: number) =>
  `/images/awards/certifications/Asset%20${assetNumber}Logo%201.png`

const assetNumberFromLogoSrc = (src: string) => {
  const match = src.match(/Asset%20(\d+)Logo/)
  return match ? Number(match[1]) : null
}

const missingCertificationAssets = new Set([9, 16, 21])

export const certificationLogos: AwardLogo[] = awardLogos
  .filter((logo) => {
    const assetNumber = assetNumberFromLogoSrc(logo.src)
    return assetNumber !== null && !missingCertificationAssets.has(assetNumber)
  })
  .map((logo) => ({
    ...logo,
    src: certificationLogoSrc(assetNumberFromLogoSrc(logo.src)!),
  }))

export const certifications = {
  title: 'Certifications',
  description:
    'Our certifications demonstrate our commitment to sustainable practices, ensuring quality and responsibility across all operations.',
} as const

export type AffiliationLogo = {
  id: string
  src: string
  alt: string
}

export const externalAffiliations = {
  title: 'External Affiliations',
  description:
    'We proudly collaborate with leading global organizations to uphold the highest standards in sustainability and ethical business conduct.',
  logos: [
    {
      id: 'reverse-resources',
      src: '/images/awards/affilications/reverse-resources.png',
      alt: 'Reverse Resources',
    },
    {
      id: 'jr-recycling',
      src: '/images/awards/affilications/jr-recycling.png',
      alt: 'JR Recycling Solutions LTD.',
    },
    {
      id: 'lub-ref',
      src: '/images/awards/affilications/lub-ref.png',
      alt: 'Lub-rref (Bangladesh) Ltd.',
    },
    {
      id: 'solidaridad',
      src: '/images/awards/affilications/solidaridad.png',
      alt: 'Solidaridad',
    },
    {
      id: 'base-papers',
      src: '/images/awards/affilications/base-papers.png',
      alt: 'BASE PAPERS LTD',
    },
    {
      id: 'eri',
      src: '/images/awards/affilications/eri.png',
      alt: 'ERI',
    },
  ] satisfies readonly AffiliationLogo[],
} as const
