export type AgamiWashingCapabilityProcess = {
  id: string
  number: string
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  tags: string[]
}

const AGAMI_WASHING_IMAGE_BASE = '/images/agami-washing'

export const agamiWashingCapabilityIntro = {
  badge: 'Wash Capability',
  titleBefore: 'Industrial ',
  titleAccent: 'Processes',
  titleAfter: ' with Fashion-Led Finishing Control',
}

export const agamiWashingCapabilityProcesses: AgamiWashingCapabilityProcess[] = [
  {
    id: 'wet',
    number: '01',
    title: 'Wet Process',
    description:
      'It support garment wash, dye treatment, bleaching, enzyme wash & color effect requirements with controlled handling and quality checks.',
    imageSrc: `${AGAMI_WASHING_IMAGE_BASE}/washing-capability-1.png`,
    imageAlt: 'Industrial wet washing machinery',
    tags: ['Garment Wash', 'Acid / Snow Wash', 'Dip Dye', 'Enzyme Finish'],
  },
  {
    id: 'dry',
    number: '02',
    title: 'Dry Process',
    description:
      'Dry process detailing adds visual character, texture and used-look expression through scraping, grinding, whisker, tacking, wrinkle and localized treatment techniques.',
    imageSrc: `${AGAMI_WASHING_IMAGE_BASE}/washing-capability-2.png`,
    imageAlt: 'Industrial dry process finishing equipment',
    tags: ['Grinding', 'Hand Whisker', 'Scraping', 'Crinkle'],
  },
]

export const agamiWashingCapabilityCta = {
  title: 'Need some help?',
  description: 'We\u2019re here to provide support and assistance.',
  buttonLabel: 'Contact us now',
  buttonHref: '/contact',
}
