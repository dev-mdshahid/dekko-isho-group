export type FactoryLocation = {
  id: string
  name: string
  address: string
  mapsUrl?: string
}

/** Build an embeddable Google Maps iframe URL from a standard Maps link. */
export function getGoogleMapsEmbedUrl(mapsUrl: string): string {
  try {
    const url = new URL(mapsUrl.startsWith('http') ? mapsUrl : `https://${mapsUrl}`)
    const cid = url.searchParams.get('cid')
    if (cid) {
      return `https://www.google.com/maps?cid=${cid}&output=embed`
    }

    const ll = url.searchParams.get('ll')
    if (ll) {
      const z = url.searchParams.get('z') ?? '14'
      return `https://maps.google.com/maps?q=${ll}&z=${z}&output=embed`
    }

    const q = url.searchParams.get('q')
    if (q) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`
    }
  } catch {
    // fall through to generic embed suffix
  }

  return mapsUrl.includes('output=embed')
    ? mapsUrl
    : `${mapsUrl}${mapsUrl.includes('?') ? '&' : '?'}output=embed`
}

export const factoryLocations: readonly FactoryLocation[] = [
  {
    id: 'dekko-garments',
    name: 'Dekko Garments Ltd.',
    address: 'Noyanpur Bazar Road, Mawna Union, Bangladesh',
    mapsUrl:
      'https://www.google.com/maps?ll=24.253009,90.390393&z=14&t=m&hl=en-US&gl=US&mapclient=apiv3&cid=10796227562009480967',
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
