export type DekkoReadywaresGalleryItem = {
  id: string
  src: string
  alt: string
  grayscale?: boolean
}

const READYWARES_GALLERY_BASE = '/images/dekko-readywares'

export const dekkoReadywaresGalleryImages: DekkoReadywaresGalleryItem[] = [
  {
    id: 'tall',
    src: `${READYWARES_GALLERY_BASE}/readywares-1.png`,
    alt: 'Fabric swatches and patterns on a design table',
  },
  {
    id: 'stripes',
    src: `${READYWARES_GALLERY_BASE}/readywares-2.png`,
    alt: 'Colorful striped textiles',
  },
  {
    id: 'rack',
    src: `${READYWARES_GALLERY_BASE}/readywares-3.png`,
    alt: 'Garments hanging on a rack',
  },
  {
    id: 'sewing',
    src: `${READYWARES_GALLERY_BASE}/readywares-4.png`,
    alt: 'Close-up of an industrial sewing machine',
    grayscale: true,
  },
  {
    id: 'production',
    src: `${READYWARES_GALLERY_BASE}/readywares-5.png`,
    alt: 'Workers inspecting fabric at a production table',
  },
  {
    id: 'floor',
    src: `${READYWARES_GALLERY_BASE}/readywares-5.png`,
    alt: 'Production floor with workers at sewing stations',
  },
  {
    id: 'jeans',
    src: `${READYWARES_GALLERY_BASE}/readywares-6.png`,
    alt: 'Finished jeans hanging with leather brand patches',
  },
]
