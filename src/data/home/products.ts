export type ProductSpec = {
  label: string
  value: string
}

export type Product = {
  id: string
  name: string
  description: string
  image: string
  imageSrcSet: string
  specs: ProductSpec[]
}

export const homeProducts: Product[] = [
  {
    id: '65983724-c324-f214-e8de-a17118ba2ece',
    name: 'Aluminum gear housing',
    description: 'Precision CNC machined aluminum housings for gear systems and machinery.',
    image: 'Product-Image-3.webp',
    imageSrcSet: '/legacy/images/Product-Image-3-p-500.webp 500w, /legacy/images/Product-Image-3.webp 525w',
    specs: [
      { label: 'Material', value: 'Aluminum 6061 / 7075' },
      { label: 'Capability', value: 'CNC Machining' },
      { label: 'Size Range', value: 'Custom dimensions up to 500mm' },
    ],
  },
  {
    id: 'c2ba7395-3c61-880b-0e5d-db3be41b693c',
    name: 'Custom plastic enclosures',
    description: 'Injection molded enclosures for electronics and telecom applications.',
    image: 'Product-Image-2.png',
    imageSrcSet: '/legacy/images/Product-Image-2-p-500.png 500w, /legacy/images/Product-Image-2.png 525w',
    specs: [
      { label: 'Material', value: 'ABS, Polycarbonate, Nylon' },
      { label: 'Capability', value: 'Injection Molding' },
      { label: 'Size Range', value: 'Varies – custom moldable' },
    ],
  },
  {
    id: 'b4c6cb8c-3886-37a5-d547-a30a7ddfc4d3',
    name: 'Electrical control panels',
    description: 'Weather-resistant control panels for industrial automation systems.',
    image: 'Product-Image-1.webp',
    imageSrcSet: '/legacy/images/Product-Image-1-p-500.webp 500w, /legacy/images/Product-Image-1.webp 525w',
    specs: [
      { label: 'Material', value: 'Mild Steel, Stainless Steel' },
      { label: 'Capability', value: 'Sheet Metal Fabrication & Assembly' },
      { label: 'Size Range', value: 'Small to full-scale cabinets' },
    ],
  },
  {
    id: '46341948-216a-2f1c-951e-bce2e4a353f8',
    name: 'Precision Shaft Assemblies',
    description: 'High-precision steel shafts for automotive and industrial equipment.',
    image: 'Product-Image-4.webp',
    imageSrcSet: '/legacy/images/Product-Image-4-p-500.webp 500w, /legacy/images/Product-Image-4.webp 525w',
    specs: [
      { label: 'Material', value: 'Alloy Steel, Stainless Steel' },
      { label: 'Capability', value: 'Turning & Grinding' },
      { label: 'Size Range', value: 'Up to 1200mm' },
    ],
  },
]
