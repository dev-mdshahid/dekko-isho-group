export type GalleryItem = {
  id: string
  src: string
  alt: string
}

const GALLERY_BASE = '/images/gallery'

export const galleryItems: GalleryItem[] = [
  {
    id: 'dekko-garments-building',
    src: `${GALLERY_BASE}/d096aef6dde3603820514ac8d2e4df5bd980aa52.png`,
    alt: 'Exterior of Dekko Garments Ltd building with wave-shaped awning',
  },
  {
    id: 'industrial-complex-aerial',
    src: `${GALLERY_BASE}/dc4447a7d89a5e89fb2432d30d4fb57780a2cd68.png`,
    alt: 'Aerial view of industrial complex with solar-panelled roofs',
  },
  {
    id: 'retail-store-interior',
    src: `${GALLERY_BASE}/03bb6a338b122912dec023c5c9153e6a46fbfbb2.png`,
    alt: 'Modern retail store interior with staircase and mannequin display',
  },
  {
    id: 'clothing-rack-color-coordinated',
    src: `${GALLERY_BASE}/0916d3f968a337b78a29e22964659fe09a307c03.png`,
    alt: 'Color-coordinated clothing rack in a boutique',
  },
  {
    id: 'boutique-clothing-rack',
    src: `${GALLERY_BASE}/70b73c240b33bfbbffdb547d143b433823b66d14.png`,
    alt: 'Neutral-toned garments on a boutique clothing rack',
  },
  {
    id: 'pashmina-shawls-display',
    src: `${GALLERY_BASE}/df622af65e78a2609972eb1de4e81eb03460ca29.png`,
    alt: 'Patterned pashmina shawls displayed in a retail corner',
  },
  {
    id: 'isho-showroom',
    src: `${GALLERY_BASE}/ad9b8f1575042db607ce812ecfd259192bcce312.png`,
    alt: 'ISHO furniture showroom storefront with interior displays',
  },
  {
    id: 'roxy-paints-living-room',
    src: `${GALLERY_BASE}/ddb50cd54d42743b12772ed7bafc90a22ffcfe58.png`,
    alt: 'Teal living room interior featuring Roxy Paints product line',
  },
  {
    id: 'ecovia-compostable-bag',
    src: `${GALLERY_BASE}/54c535ad86c69db85e21948738b0711ad0ea67f6.png`,
    alt: 'Ecovia compostable bag on moss in a sunlit forest',
  },
  {
    id: 'izakaya-catering',
    src: `${GALLERY_BASE}/733b1675fd5bef291c17ed72752ce5ef8cc0ea4b.png`,
    alt: 'Izakaya Catering bao buns with tempura filling',
  },
  {
    id: 'industrial-washing-machines',
    src: `${GALLERY_BASE}/9fcea9d5668b70cdc3eb2eab94453a7245fe1cfa.png`,
    alt: 'Row of industrial washing machines with open doors',
  },
  {
    id: 'city-connectivity',
    src: `${GALLERY_BASE}/427b5e6dd6cdf6bd45971b4273907cab84422bb0.png`,
    alt: 'City panorama at dusk with glowing connectivity arcs',
  },
  {
    id: 'sunset-hillside',
    src: `${GALLERY_BASE}/5ef804fc493700dd9f361e81aa890a0afcc07c90.png`,
    alt: 'Sunset over a rolling green hillside by the sea',
  },
]
