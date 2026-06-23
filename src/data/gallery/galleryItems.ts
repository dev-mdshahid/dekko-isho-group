export type GalleryItem = {
  id: string
  src: string
  alt: string
}

const DESIGN_PRODUCT_BASE = '/images/design%20and%20product'
const PACKING_BASE = '/images/packing'

export const galleryItems: GalleryItem[] = [
  {
    id: 'design-primary',
    src: `${DESIGN_PRODUCT_BASE}/gallery-primary.png`,
    alt: 'Model in contemporary fashion styling',
  },
  {
    id: 'design-1',
    src: `${DESIGN_PRODUCT_BASE}/gallery-1.png`,
    alt: 'Craft supplies for design development',
  },
  {
    id: 'design-2',
    src: `${DESIGN_PRODUCT_BASE}/gallery-2.png`,
    alt: 'Retail showroom interior',
  },
  {
    id: 'design-3',
    src: `${DESIGN_PRODUCT_BASE}/gallery-3.png`,
    alt: 'Mannequins in summer collection display',
  },
  {
    id: 'design-4',
    src: `${DESIGN_PRODUCT_BASE}/gallery-4.png`,
    alt: 'Fashion styling in a tropical setting',
  },
  {
    id: 'design-banner',
    src: `${DESIGN_PRODUCT_BASE}/gallery-banner.png`,
    alt: 'Fabric rolls in a design workshop',
  },
  {
    id: 'packing-primary',
    src: `${PACKING_BASE}/gallery-item.png`,
    alt: 'Metal detection machine on the packing line',
  },
  {
    id: 'packing-1',
    src: `${PACKING_BASE}/gallery-item%20(1).png`,
    alt: 'Workers at packing tables',
  },
  {
    id: 'packing-2',
    src: `${PACKING_BASE}/gallery-item%20(2).png`,
    alt: 'Quality check at packing station',
  },
  {
    id: 'packing-3',
    src: `${PACKING_BASE}/gallery-item%20(3).png`,
    alt: 'Moisture inspection with handheld device',
  },
  {
    id: 'packing-4',
    src: `${PACKING_BASE}/gallery-item%20(4).png`,
    alt: 'Finished garments in storage aisle',
  },
  {
    id: 'packing-5',
    src: `${PACKING_BASE}/gallery-item%20(5).png`,
    alt: 'Warehouse with stacked cartons ready for dispatch',
  },
]
