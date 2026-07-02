export type AwardLogo = {
  id: string
  src: string
  alt: string
}

const logoSrc = (assetNumber: number) =>
  `/images/awards/logos/Asset%20${assetNumber}Logo.png`

export const awardsGridContent = {
  tag: 'Global Certifications',
  title: 'Certified for responsible excellence',
  description:
    'Our certifications reflect our unwavering commitment to safety, sustainability and transparency across every fiber, process and partnership.',
} as const

export const awardLogos: AwardLogo[] = [
  { id: 'logo-leed-gold', src: logoSrc(3), alt: 'U.S. Green Building Council LEED Gold' },
  { id: 'logo-iso-14001', src: logoSrc(4), alt: 'ISO 14001:2015' },
  { id: 'logo-ocs-100', src: logoSrc(5), alt: 'Organic 100 Content Standard' },
  { id: 'logo-wrap', src: logoSrc(6), alt: 'WRAP' },
  { id: 'logo-rcs-100', src: logoSrc(7), alt: 'Recycled 100 Claim Standard' },
  { id: 'logo-bhive', src: logoSrc(8), alt: 'The BHive' },
  { id: 'logo-gots', src: logoSrc(9), alt: 'Global Organic Textile Standard (GOTS)' },
  { id: 'logo-rws', src: logoSrc(10), alt: 'Responsible Wool Standard (RWS)' },
  { id: 'logo-better-cotton', src: logoSrc(11), alt: 'Better Cotton' },
  { id: 'logo-amfori-bepi', src: logoSrc(12), alt: 'amfori BEPI' },
  { id: 'logo-oeko-tex-100', src: logoSrc(13), alt: 'OEKO-TEX Standard 100' },
  { id: 'logo-betterwork', src: logoSrc(14), alt: 'BetterWork' },
  { id: 'logo-sedex', src: logoSrc(15), alt: 'Sedex' },
  { id: 'logo-slcp', src: logoSrc(16), alt: 'Social and Labor Convergence Program (SLCP)' },
  { id: 'logo-rsc', src: logoSrc(17), alt: 'RMG Sustainability Council (RSC)' },
  { id: 'logo-clean-chain', src: logoSrc(18), alt: 'CLEAN CHAIN' },
  { id: 'logo-zdhc', src: logoSrc(19), alt: 'ZDHC' },
  { id: 'logo-worldly', src: logoSrc(20), alt: 'worldly' },
  { id: 'logo-grs', src: logoSrc(21), alt: 'Global Recycled Standard' },
  { id: 'logo-sbt', src: logoSrc(22), alt: 'Science Based Targets' },
  { id: 'logo-scan', src: logoSrc(23), alt: 'SCAN' },
  { id: 'logo-cotton-trust', src: logoSrc(24), alt: 'U.S. Cotton Trust Protocol' },
  { id: 'logo-supplier-to-zero', src: logoSrc(25), alt: 'Supplier to Zero' },
  { id: 'logo-european-flax', src: logoSrc(26), alt: 'European Flax' },
  { id: 'logo-fsc', src: logoSrc(27), alt: 'FSC' },
  { id: 'logo-gsv', src: logoSrc(28), alt: 'Global Security Verification' },
  { id: 'logo-oeko-tex-step', src: logoSrc(29), alt: 'OEKO-TEX STeP' },
  { id: 'logo-regenagri', src: logoSrc(30), alt: 'Regenagri' },
  { id: 'logo-ics', src: logoSrc(31), alt: 'ICS' },
  { id: 'logo-32', src: logoSrc(32), alt: 'Certification partner' },
  { id: 'logo-33', src: logoSrc(33), alt: 'Certification partner' },
]
