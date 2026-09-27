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
    id: 'agami-fashions',
    name: 'Agami Fashions Limited',
    address: 'Holding- 79/1, Chandra, Kaliakoir, Gazipur- 1751, Bangladesh.',
    lat: 24.04791688888889,
    lng: 90.238,
  },
  {
    id: 'agami-washing',
    name: 'Agami Washing Limited',
    address: 'Holding- 79/1, Chandra, Kaliakoir, Gazipur- 1751, Bangladesh.',
    lat: 24.04791688888889,
    lng: 90.238,
  },
  {
    id: 'dekko-fashions',
    name: 'Dekko Fashions Limited',
    address: 'Plot- M/4, Road- 7, Section- 7, Mirpur, Dhaka- 1216, Bangladesh.',
    lat: 23.8185,
    lng: 90.3625,
  },
  {
    id: 'dekko-garments',
    name: 'Dekko Garments Limited',
    address: 'Nayanpur, PO: Mawna-1740, PS: Sreepur, Dist: Gazipur, Bangladesh.',
    lat: 24.2206888,
    lng: 90.4122717,
  },
  {
    id: 'dekko-readywears',
    name: 'Dekko Readywears Limited',
    address: 'Plot- M/1, Road- 7, Section- 7, Mirpur, Dhaka- 1216, Bangladesh.',
    lat: 23.826012,
    lng: 90.36537,
  },
  {
    id: 'globus-embroidery',
    name: 'Globus Embroidery',
    address: 'Plot- 7, 9, 10 & 14, Road- 14, 15, Section- 12, Eastern Housing, Pallabi 2nd Phase, Mirpur, Dhaka-1216, Bangladesh.',
    lat: 23.82042,
    lng: 90.35372,
  },
  {
    id: 'globus-garments',
    name: 'Globus Garments Limited',
    address: 'K.S. Complex, Mouchak, Kaliakoir, Gazipur, Dhaka, Bangladesh.',
    lat: 24.024055,
    lng: 90.294271,
  },
]
