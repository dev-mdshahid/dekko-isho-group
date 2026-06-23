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

export const manufacturingHowItWorks = {
  badge: 'Process',
  title: 'How It Works',
  columnLabels: { category: 'Category', details: 'Details' },
  items: [
    {
      id: 'idea',
      category: 'Idea & Strategy',
      details:
        'We help define ideas and plan a strategic journey so brands can begin creating great quality garments.',
    },
    {
      id: 'design',
      category: 'Design',
      details: 'The fashion design team helps bring a vision to life through technical design.',
    },
    {
      id: 'fabric',
      category: 'Fabric',
      details:
        'Sourcing teams and textile engineers help choose the right fabric, trims, and findings for garments.',
    },
    {
      id: 'pattern',
      category: 'Pattern Making',
      details:
        'Award-winning pattern makers help turn designs into production-ready garment structures.',
    },
    {
      id: 'sampling',
      category: 'Sampling',
      details:
        'Samples are created and reviewed so garments can be refined until the result meets your expectations.',
    },
    {
      id: 'production',
      category: 'Production',
      details:
        'Large quantities are produced in eco-friendly factories once the product is ready for scale.',
    },
  ],
}

export const manufacturingCuttingPreparation = {
  badge: 'Production Floor Process',
  title: 'Cutting & Preparation',
  description:
    'Cutting and preparation form the technical foundation of bulk manufacturing. Each stage is executed with close process control to protect fabric behavior, marker accuracy, component quality and organized line input.',
  items: [
    {
      id: 'fabric-relaxation',
      number: '01',
      title: 'Fabric Relaxation & Preparation',
      description:
        'Before spreading, fabrics are prepared according to material behavior, technical requirements and production standards. This helps stabilize shrinkage, reduce distortion and ensure that the cutting process begins with properly conditioned raw material.',
      image: '/images/manufacturing/cutting/01-fabric-relaxation.png',
      imageAlt: 'Worker preparing fabric on a spreading table',
    },
    {
      id: 'spreading',
      number: '02',
      title: 'Spreading Accuracy',
      description:
        'Fabric spreading is carried out with close attention to ply alignment, grain direction, shade control and marker requirements. Consistent spreading helps improve measurement accuracy and supports better garment balance during assembly.',
      image: '/images/manufacturing/cutting/02-spreading.png',
      imageAlt: 'Industrial fabric spreading machine',
    },
    {
      id: 'marker',
      number: '03',
      title: 'Marker & Pattern Control',
      description:
        'Approved markers and patterns are followed to optimize fabric usage while maintaining product specifications. The process supports efficient material consumption, accurate component shape and consistent size execution.',
      image: '/images/manufacturing/cutting/03-marker.png',
      imageAlt: 'Cutting tables in a production facility',
    },
    {
      id: 'cutting',
      number: '04',
      title: 'Cutting Precision',
      description:
        'Cutting is performed with controlled handling to maintain panel accuracy across sizes and styles. Cut parts are checked against technical specifications to reduce defects before sewing begins.',
      image: '/images/manufacturing/cutting/04-cutting.png',
      imageAlt: 'Workers handling cut fabric panels',
    },
    {
      id: 'fusing',
      number: '05',
      title: 'Fusing Stage',
      description:
        'Fusing is applied where required to strengthen garment components such as collars, cuffs, plackets, waistbands and other structured areas. Temperature, pressure and timing are monitored to ensure bonding quality and long-term product durability.',
      image: '/images/manufacturing/cutting/05-fusing.png',
      imageAlt: 'Industrial fusing machine on the production floor',
    },
    {
      id: 'bundling',
      number: '06',
      title: 'Cut-Part Bundling',
      description:
        'Cut components are numbered, bundled and prepared for line input with clear identification. This improves traceability, reduces mixing risk and allows sewing teams to begin assembly with organized production inputs.',
      image: '/images/manufacturing/cutting/06-bundling.png',
      imageAlt: 'Cut-part bundling equipment',
    },
  ],
}

export const manufacturingCapacity = {
  badge: 'Full Capacity Details',
  titleBefore: 'Manufacturing',
  titleAccent: 'Capacity',
  titleAfter: 'at Scale',
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
  badge: 'Detailed Insight',
  title: 'Full Capacity Details',
  items: [
    {
      id: 'sms',
      number: '01',
      title: 'Salesman Sample Production',
      description: '3 dedicated SMS lines to support SMS production',
    },
    {
      id: 'laundry',
      number: '04',
      title: 'Industrial Laundry Facility',
      description:
        'Specializes in versatile types of washes for woven tops. Equipped with sustainable washing technology, including E-Flow machines, laser processes, and ozone wash facilities. Uses EIM software to measure and score sustainability.',
    },
    {
      id: 'embroidery',
      number: '02',
      title: 'State-of-the-Art Embroidery Unit',
      description:
        'Equipped with advanced embroidery machines from Barudan and Maya, known for their precision and durability. High stitch capacity supports efficient daily production. In-house printing, embroidery, and finishing enhance quality control.',
    },
    {
      id: 'testing',
      number: '05',
      title: 'Physical Testing Lab',
      description: 'Fully equipped with advanced European machinery for rigorous testing',
    },
    {
      id: 'accessories',
      number: '03',
      title: 'Accessories Unit',
      description:
        'Capable of producing buttons, labeling, and packaging materials in-house. Ensures better control over production with in-house printing and embroidery facilities.',
    },
    {
      id: 'versatile',
      number: '06',
      title: 'Versatile Manufacturing Capability',
      description:
        'Capable of producing a wide range of products, including both formal and casual shirts, pants, ladies\' blouses, dresses, denim and twill jackets, shackets, quilted shirts and jackets.',
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
  badge: 'Manufacturing Excellence',
  title: 'Sewing & Assembly Process',
  description:
    "The sewing and assembly stage brings design, material and technical planning together on the production floor. Dekko ISHO's sewing operations are structured to maintain construction accuracy, line efficiency and consistent workmanship across product categories. Each garment moves through a controlled workflow supported by operator skill, inline supervision and quality checkpoints.",
  images: [
    {
      src: '/images/manufacturing/sewing/01-production-line.png',
      alt: 'Wide view of sewing production lines in the factory',
    },
    {
      src: '/images/manufacturing/sewing/02-workstation.png',
      alt: 'Sewing workstation with quality control board and digital display',
    },
    {
      src: '/images/manufacturing/sewing/03-factory-aisle.png',
      alt: 'Workers at sewing stations with floor safety markings',
    },
    {
      src: '/images/manufacturing/sewing/04-sewing-station.png',
      alt: 'Organized sewing workstation with storage bins',
    },
  ],
}

export const manufacturingEmbroidery = {
  badge: 'Value Addition',
  title: 'In-House Embroidery Capability',
  cards: [
    {
      id: 'quality-control',
      title: 'In-Process Quality Control',
      image: '/images/manufacturing/embroidery/quality-control.png',
      imageAlt: 'Embroidery factory floor with industrial machines',
      points: [
        'Set the standard for placement and color and design accuracy before starting the bulk.',
        'Assess stitching consistency in all heads and design finishes.',
        'Ensure the quality of Emb panels by checking 100%, before sending to production floor.',
      ],
    },
    {
      id: 'defect-management',
      title: 'Defect Management',
      image: '/images/manufacturing/embroidery/defect-management.png',
      imageAlt: 'Workers operating embroidery machines',
      points: [
        'Record and classify defects immediately.',
        'Implement corrective actions to address recurring issues.',
      ],
    },
  ],
}

const mfgProductNetworkImage = (file: string) =>
  `/images/manufacturing/product network/${file}`

export const manufacturingProductionNetwork = {
  badge: 'Unit-Wise Capacity',
  title: 'Production Network',
  description:
    'Key production units across Dekko ISHO Group with lines, capacity, manpower, product mix, and compliance progress.',
  units: [
    {
      id: 'dekko-garments',
      title: 'Dekko Garments Ltd.',
      image: mfgProductNetworkImage('pn.png'),
      imageAlt: 'Garment production floor',
      productionLines: '46',
      monthlyCapacity: '14,40,000',
      manpower: '6,800',
      products:
        'Formal and Casual shirt, Casual bottom for both men & Ladies. (60% capacity for tops and 40% for bottom)',
      higgFfm: '83%',
      rscProgress: '92%',
    },
    {
      id: 'dekko-readywears',
      title: 'DEKKO READYWEARS LTD.',
      image: mfgProductNetworkImage('pn1.png'),
      imageAlt: 'Readywear production facility',
      productionLines: '24',
      monthlyCapacity: '7,50,000',
      manpower: '3,150',
      products: "70% men's casual, 20% ladies' and 10% kids'",
      higgFfm: '75%',
      rscProgress: '100%',
    },
    {
      id: 'dekko-fashions',
      title: 'DEKKO FASHIONS LTD.',
      image: mfgProductNetworkImage('pn2.png'),
      imageAlt: 'Dekko Fashions production unit',
      productionLines: '10',
      monthlyCapacity: '3,00,000',
      manpower: '1,450',
      products: "80% men's & Ladies' casual products, 15% formal men's, 5% kids'",
      higgFfm: '68%',
      rscProgress: '100%',
    },
    {
      id: 'agami-fashions',
      title: 'AGAMI FASHIONS LTD.',
      image: mfgProductNetworkImage('pn3.jpg'),
      imageAlt: 'Agami Fashions production floor',
      productionLines: '08',
      monthlyCapacity: '300,000',
      manpower: '1,200(AP.)',
      products: '70% bottom for Kids, Men & Ladies, 30% Jackets and overshirts',
      higgFfm: '81%',
      rscProgress: '97%',
    },
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
    },
    {
      id: 'womens-wear',
      title: "Women's Wear",
      image: '/images/about/design.jpg',
      imageAlt: "Women's wear collection",
    },
    {
      id: 'denim',
      title: 'Denim Collections',
      image: '/images/about/manufacturing.jpg',
      imageAlt: 'Denim collection',
    },
    {
      id: 'knitwear',
      title: 'Knitwear Lines',
      image: '/images/about/laundry.jpg',
      imageAlt: 'Knitwear production line',
    },
  ],
}

export const manufacturingCta = {
  eyebrow: "Let's Connect",
  heading: "And build what's next, together",
  description:
    "Get in touch with our team for partnership, sourcing, careers or general inquiries - we'll get back to you with answers.",
  buttonLabel: 'Schedule consultation',
  buttonHref: '/contact',
  email: 'hello@dekkoisho.com',
  emailHref: 'mailto:hello@dekkoisho.com',
}
