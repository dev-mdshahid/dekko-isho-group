export type DekkoFashionsCategoryItem = {
  id: string
  title: string
  material: string
  meta: string
  imageSrc: string
  imageAlt: string
}

const DEKKO_FASHIONS_CATEGORIES_BASE = '/images/dekko-fashions'

export const dekkoFashionsCategoriesIntro = {
  title: 'Fashion categories shaped for modern global collections.',
  footer:
    'The unit is positioned to support woven fashion programs where construction detail, fabric behavior, finishing quality, and visual consistency are essential.',
}

export const dekkoFashionsCategoryItems: DekkoFashionsCategoryItem[] = [
  {
    id: 'tops',
    title: 'Fashion Tops',
    material: 'Material',
    meta: '01 / Apparel',
    imageSrc: `${DEKKO_FASHIONS_CATEGORIES_BASE}/fashion-tops.jpg`,
    imageAlt: 'Fashion tops category',
  },
  {
    id: 'dresses',
    title: 'Dresses & Shirts',
    material: 'Material',
    meta: '02 / Woven',
    imageSrc: `${DEKKO_FASHIONS_CATEGORIES_BASE}/dresses&skirts.png`,
    imageAlt: 'Dresses and shirts category',
  },
  {
    id: 'trend-led',
    title: 'Trend-Led Pieces',
    material: 'Material',
    meta: '03 / Collection',
    imageSrc: `${DEKKO_FASHIONS_CATEGORIES_BASE}/trend-led-pieces.png`,
    imageAlt: 'Trend-led pieces category',
  },
  {
    id: 'finished',
    title: 'Finished Garments',
    material: 'Material',
    meta: '04 / Export',
    imageSrc: `${DEKKO_FASHIONS_CATEGORIES_BASE}/finished-garments.png`,
    imageAlt: 'Finished garments category',
  },
]
