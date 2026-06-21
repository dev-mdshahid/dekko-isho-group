export type FactoryLocation = {
  id: string
  name: string
  address: string
}

export const factoryLocations: readonly FactoryLocation[] = [
  {
    id: 'dekko-garments',
    name: 'Dekko Garments Ltd.',
    address: 'Noyanpur Bazar Road, Mawna Union, Bangladesh',
  },
  {
    id: 'global-garments',
    name: 'Global Garments Ltd.',
    address: 'Mouchak - Fulbaria Road, Bangladesh',
  },
  {
    id: 'agami-fashions',
    name: 'Agami Fashions Ltd.',
    address: '79/1, Chandra, Pallibidduyt, Kaliakoir, 1751, Bangladesh',
  },
  {
    id: 'agami-washing',
    name: 'Agami Washing Ltd.',
    address: '79/1, Chandra, Pallibidduyt, Kaliakoir, 1751, Bangladesh',
  },
  {
    id: 'dekko-readywears',
    name: 'Dekko Readywears Ltd.',
    address: 'Rd No. 7, Mirpur 11, Dhaka 1216, Bangladesh',
  },
  {
    id: 'dekko-apparels',
    name: 'Dekko Apparels Ltd.',
    address: 'Rd No. 7, Mirpur 11, Dhaka 1216, Bangladesh',
  },
]

/** Shared placeholder map used for all factory cards. */
export const FACTORY_DUMMY_MAP_IMAGE = '/images/contact/factory-map.svg'
