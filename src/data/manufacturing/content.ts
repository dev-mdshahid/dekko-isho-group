import { legacyDoc } from '../../lib/assets'

export const manufacturingHero = {
  title: 'Manufacturing',
  description: 'We Are A One-Stop Custom Apparel Manufacturer',
  ctaLabel: 'Learn More',
  ctaHref: '#mfg-expertise',
  video: '/videos/Person_People_1280x720.mp4',
  videoPoster: '/images/manufacturing/hero-fabric.webp',
  videoAlt: 'Apparel manufacturing — person working with fabric',
}

export const manufacturingExpertise = {
  id: 'mfg-expertise',
  badge: 'One-Stop Apparel Partner',
  title: 'Sustainable apparel manufacturing for growing fashion brands.',
  paragraphs: [
    'Dekko ISHO Group supports fashion brands as an apparel manufacturing partner with sustainable, organic, and production-ready solutions across the apparel development journey.',
    'From idea planning and technical design to fabric sourcing, pattern making, sampling, and eco-friendly production, the manufacturing system is built to help brands stop worrying about production and focus on growing.',
  ],
  features: [
    {
      id: 'sustainable',
      icon: '/images/manufacturing/feature-icon-sustainable.svg',
      title: 'Sustainable Apparel Manufacturing',
      description:
        "We're an apparel manufacturer partner providing sustainable and organic one stop shop solutions for all things apparel production.",
    },
    {
      id: 'quality',
      icon: '/images/manufacturing/feature-icon-quality.svg',
      title: 'Quality Apparel Manufacturer',
      description:
        'Our garment factory has a simple approach to apparel and fabric manufacturing: Top-Quality.',
    },
    {
      id: 'fashion-forward',
      icon: '/images/manufacturing/feature-icon-fashion.svg',
      title: 'Fashion Forward Apparel Manufacturer',
      description:
        'An apparel production partner that gets communication! Our customer service is first class.',
    },
  ],
}

export const manufacturingProcess = {
  badge: 'How It Works',
  title: 'From concept to finished garment',
  steps: [
    {
      id: 'design',
      title: 'Design',
      description:
        'Collaborative design development with trend research, tech packs and sampling to align every collection with brand vision and market demand.',
    },
    {
      id: 'sourcing',
      title: 'Sourcing',
      description:
        'Ethical material sourcing with full traceability — fabrics, trims and accessories procured through audited suppliers across our global network.',
    },
    {
      id: 'production',
      title: 'Production',
      description:
        'High-volume cut-and-sew, knitting and finishing across our Gazipur facilities — optimised lines, lean workflows and real-time production tracking.',
    },
    {
      id: 'quality',
      title: 'Quality Control',
      description:
        'Inline and end-line inspection at every stage. AQL standards, lab testing and third-party audits ensure consistent quality on every shipment.',
    },
    {
      id: 'logistics',
      title: 'Logistics',
      description:
        'On-time delivery through integrated logistics — from factory floor to port, with full documentation and shipment visibility for every order.',
    },
  ],
}

export const manufacturingCapacity = {
  badge: 'Full Capacity Details',
  titleBefore: 'Manufacturing',
  titleAccent: 'Capacity',
  titleAfter: 'at Scale',
  ctaLabel: 'Download Brochure',
  ctaHref: legacyDoc('PDF.pdf'),
  stats: [
    {
      id: 'machining',
      value: '3.5M',
      label: 'Precision machining',
      variant: 'dark' as const,
    },
    {
      id: 'woven-tops',
      value: '2.5M',
      label: 'Woven Tops',
      variant: 'light' as const,
    },
    {
      id: 'woven-bottoms',
      value: '1.0M',
      label: 'Woven Bottoms',
      variant: 'blue' as const,
    },
  ],
}

export const manufacturingCapacityDetails = {
  badge: 'Capabilities & Features',
  title: 'Full Capacity Details',
  columnLabels: { left: 'Category', right: 'Details' },
  items: [
    {
      id: 'knitwear',
      category: 'Knitwear',
      details: [
        'Circular knitting, flat knitting and seamless production',
        'Jerseys, polos, sweaters and performance wear',
        'In-house dyeing and finishing programmes',
      ],
    },
    {
      id: 'woven',
      category: 'Woven Garments',
      details: [
        'Shirts, trousers, jackets and formal wear',
        'Precision cutting, fusing and assembly at scale',
        'Export-ready finishing and packing',
      ],
    },
    {
      id: 'denim',
      category: 'Denim & Casual',
      details: [
        'Full denim wash and distressing programmes',
        'Jeans, jackets and casual collections',
        'Consistent shade and fit across bulk runs',
      ],
    },
    {
      id: 'accessories',
      category: 'Accessories & Trims',
      details: [
        'Embroidery, printing, labelling and packaging',
        'Complete product finishing under one roof',
        'Brand-aligned trim and packaging solutions',
      ],
    },
    {
      id: 'finishing',
      category: 'Finishing & Packing',
      details: [
        'Steam pressing and quality finishing',
        'Barcoding and export-ready packing',
        'Global distribution documentation',
      ],
    },
    {
      id: 'sampling',
      category: 'Sampling & Development',
      details: [
        'Rapid proto sampling and fit sessions',
        'Bulk approval workflows',
        'Accelerated time-to-market support',
      ],
      last: true,
    },
  ],
}

export const manufacturingQuality = {
  badge: 'Quality & Compliance',
  title: 'Built on standards you can trust',
  description:
    'Every facility operates under internationally recognised certifications — from social compliance to environmental management.',
  items: [
    {
      id: 'q1',
      number: '01',
      title: 'Social Compliance',
      description: 'BSCI, WRAP and ethical audit programmes across all manufacturing units.',
      image: '/images/about/compliance.jpg',
      imageAlt: 'Social compliance audit',
    },
    {
      id: 'q2',
      number: '02',
      title: 'Environmental Standards',
      description: 'ISO 14001, ZDHC and wastewater treatment systems at every production site.',
      image: '/images/corporate-building.png',
      imageAlt: 'Sustainable manufacturing facility',
    },
    {
      id: 'q3',
      number: '03',
      title: 'Product Testing',
      description: 'In-house and third-party lab testing for colour fastness, shrinkage and safety.',
      image: '/images/about/design.jpg',
      imageAlt: 'Product testing laboratory',
    },
    {
      id: 'q4',
      number: '04',
      title: 'Traceability',
      description: 'Full material and production traceability from yarn to finished garment.',
      image: '/images/about/integration.jpg',
      imageAlt: 'Production traceability systems',
    },
    {
      id: 'q5',
      number: '05',
      title: 'Fire & Building Safety',
      description: 'Structural assessments, fire safety systems and worker evacuation protocols.',
      image: '/images/skyview-company.png',
      imageAlt: 'Factory building safety',
    },
    {
      id: 'q6',
      number: '06',
      title: 'Chemical Management',
      description: 'Restricted substances lists, chemical inventory and MRSL compliance programmes.',
      image: '/images/about/laundry.jpg',
      imageAlt: 'Chemical management in laundry',
    },
  ],
}

export const manufacturingSewing = {
  badge: 'Sewing & Assembly',
  title: 'Precision at every station',
  description:
    'Our sewing floors combine skilled craftsmanship with modern equipment — automated cutting, intelligent line balancing and real-time efficiency monitoring keep production flowing at scale without compromising quality.',
  images: [
    { src: '/images/about/manufacturing.jpg', alt: 'Sewing line production' },
    { src: '/images/fashion-outlet.png', alt: 'Garment assembly floor' },
    { src: '/images/about/design.jpg', alt: 'Quality inspection station' },
    { src: '/images/about/compliance.jpg', alt: 'Finishing and pressing' },
  ],
}

export const manufacturingFactories = {
  badge: 'Our Factories',
  title: 'Our Factories in Gazipur',
  factories: [
    {
      id: 'knitwears',
      title: 'Dekko Isho Knitwears Ltd.',
      description:
        'Dedicated knitwear facility with circular and flat knitting lines, dyeing and finishing — serving leading global brands.',
      image: '/images/skyview-company.png',
      imageAlt: 'Dekko Isho Knitwears factory interior',
      href: '/contact',
    },
    {
      id: 'garments',
      title: 'Dekko Isho Garments Ltd.',
      description:
        'High-volume woven garment production with cutting, sewing, washing and export-ready finishing under one roof.',
      image: '/images/corporate-building.png',
      imageAlt: 'Dekko Isho Garments factory',
      href: '/contact',
    },
  ],
}

export const manufacturingProjects = {
  badge: 'Portfolio',
  title: 'Past Projects We Love',
  projects: [
    {
      id: 'mens-outerwear',
      title: "Men's Outerwear",
      image: '/images/fashion-outlet.png',
      imageAlt: "Men's outerwear collection",
      href: '/case-studies',
    },
    {
      id: 'womens-wear',
      title: "Women's Wear",
      image: '/images/about/design.jpg',
      imageAlt: "Women's wear collection",
      href: '/case-studies',
    },
    {
      id: 'denim',
      title: 'Denim Collections',
      image: '/images/about/manufacturing.jpg',
      imageAlt: 'Denim collection',
      href: '/case-studies',
    },
    {
      id: 'knitwear',
      title: 'Knitwear Lines',
      image: '/images/about/laundry.jpg',
      imageAlt: 'Knitwear production line',
      href: '/case-studies',
    },
  ],
}

export const manufacturingCta = {
  badge: 'Get in touch',
  heading: "Let's build what's next, together.",
  buttonLabel: 'Get in Touch',
  buttonHref: '/contact',
}
