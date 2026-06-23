export type FactoryLocation = {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  zoom?: number
}

/** Google Maps embed iframe URL from coordinates (no API key required). */
export function getGoogleMapsEmbedFromCoords(
  lat: number,
  lng: number,
  zoom = 17,
): string {
  const params = new URLSearchParams({
    q: `${lat},${lng}`,
    z: String(zoom),
    hl: 'en',
    t: 'm',
    maptype: 'roadmap',
    output: 'embed',
  })

  return `https://maps.google.com/maps?${params.toString()}`
}

export const factoryLocations: readonly FactoryLocation[] = [
  {
    id: 'dekko-garments',
    name: 'Dekko Garments Ltd.',
    address: 'Noyanpur Bazar Road, Mawna Union, Bangladesh',
    lat: 24.25300892277917,
    lng: 90.39039284103121,
  },
  {
    id: 'globus-garments',
    name: 'Globus Garments Ltd.',
    address: 'Mouchak - Fulbaria Road, Bangladesh',
    lat: 24.024188670598328,
    lng: 90.29420846801048,
  },
  {
    id: 'agami-fashions',
    name: 'Agami Fashions Ltd.',
    address: '79/1, Chandra, Pallibidduyt, Kaliakoir, 1751, Bangladesh',
    lat: 24.037394668763575,
    lng: 90.25386207356676,
  },
  {
    id: 'agami-washing',
    name: 'Agami Washing Ltd.',
    address: '79/1, Chandra, Pallibidduyt, Kaliakoir, 1751, Bangladesh',
    lat: 24.038041363455427,
    lng: 90.25469892277476,
  },
  {
    id: 'dekko-readywears',
    name: 'Dekko Readywears Ltd.',
    address: 'Rd No. 7, Mirpur 11, Dhaka 1216, Bangladesh',
    lat: 23.820147009925993,
    lng: 90.36400458097029,
  },
  {
    id: 'dekko-apparels',
    name: 'Dekko Apparels Ltd.',
    address: 'Rd No. 7, Mirpur 11, Dhaka 1216, Bangladesh',
    lat: 23.819955623010745,
    lng: 90.3637014423463,
  },
]
