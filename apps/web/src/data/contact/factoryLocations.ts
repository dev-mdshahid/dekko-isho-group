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
    name: 'Agami Fashions Ltd.',
    address: 'Holding- 79/1, Chandra, Kaliakoir, Gazipur- 1751, Bangladesh.',
    lat: 24.03752945984343,
    lng: 90.25400908501797,
  },
  {
    id: 'agami-washing',
    name: 'Agami Washing Ltd.',
    address: 'Holding- 79/1, Chandra, Kaliakoir, Gazipur- 1751, Bangladesh.',
    lat: 24.03792406905431,
    lng: 90.25364980105337,
  },
  {
    id: 'dekko-fashions',
    name: 'Dekko Fashions Ltd.',
    address: 'Plot- M/4, Road- 7, Section- 7, Mirpur, Dhaka- 1216, Bangladesh.',
    lat: 23.819710518242815,
    lng: 90.36298501616145,
  },
  {
    id: 'dekko-garments',
    name: 'Dekko Garments Ltd.',
    address: 'Nayanpur, PO: Mawna-1740, PS: Sreepur, Dist: Gazipur, Bangladesh.',
    lat: 24.25320238997783,
    lng: 90.39156690332553,
  },
  {
    id: 'dekko-readywears',
    name: 'Dekko Readywears Ltd.',
    address: 'Plot- M/1, Road- 7, Section- 7, Mirpur, Dhaka- 1216, Bangladesh.',
    lat: 23.819947182136488,
    lng: 90.36353377368027,
  },
  {
    id: 'globus-embroidery',
    name: 'Globus Embroidery',
    address: 'Plot- 7, 9, 10 & 14, Road- 14, 15, Section- 12, Eastern Housing, Pallabi 2nd Phase, Mirpur, Dhaka-1216, Bangladesh.',
    lat: 23.83549012102632,
    lng: 90.35078444132728,
  },
  {
    id: 'globus-garments',
    name: 'Globus Garments Ltd.',
    address: 'K.S. Complex, Mouchak, Kaliakoir, Gazipur, Dhaka, Bangladesh.',
    lat: 24.02388663353319,
    lng: 90.29422557949931,
  },
]
