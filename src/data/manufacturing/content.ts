import type { CapacityStat } from '../../components/ui/CapacityStatCircles'

export const manufacturingHero = {
  badge: 'From Sourcing to Packing',
  titleLines: [[{ text: 'Integrated' }, { text: 'Apparel' }, { text: 'Manufacturing' }]],
  subtitle:
    'At Dekko ISHO, we provide end-to-end apparel manufacturing solutions through a fully integrated ecosystem that connects material sourcing, product development, manufacturing, quality assurance, and packing. Supported by advanced technology, skilled people, and modern production facilities, we help global fashion brands improve speed to market, ensure consistent quality, and build more resilient supply chains.',
  ctaLabel: 'Learn More',
  ctaHref: '#mfg-capacity',
  video: '/videos/Integrated Manufacturing Page_ Drone Footage Inside DGL Factory.mp4',
  videoAlt: 'Apparel manufacturing facility aerial view',
}

export const manufacturingExpertise = {
  id: 'mfg-expertise',
  badge: 'One-Stop Apparel Partner',
  title: 'Sustainable Apparel Manufacturing for Growing Fashion Brands.',
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
        'Fusing is applied where required to strengthen garment components such as collars, cuffs, plackets, waistbands, and other structured areas. Temperature, pressure, and timing are monitored to ensure bonding quality and long-term product durability.',
      image: '/images/manufacturing/cutting/05-fusing.png',
      imageAlt: 'Industrial fusing machine on the production floor',
    },
    {
      id: 'bundling',
      number: '06',
      title: 'Cut-Part Bundling',
      description:
        'Cut components are numbered, bundled, and prepared for line input with clear identification. This improves traceability, reduces mixing risk, and allows sewing teams to begin assembly with organized production inputs.',
      image: '/images/manufacturing/cutting/06-bundling.png',
      imageAlt: 'Cut-part bundling equipment',
    },
  ],
}

export const manufacturingCapacity = {
  badge: 'Manufacturing at a Glance',
  title: 'Monthly Production Capacity',
  description:
    'Built on vertical integration, advanced manufacturing technologies, and decades of apparel expertise, our production platform delivers consistency, flexibility, and operational excellence. Every stage of manufacturing is carefully managed to ensure reliable execution, superior quality, and on-time delivery.',
  ctaLabel: 'Download Brochure',
  ctaHref: '/docs/Dekko_ISHO_Group.pdf',
  stats: [
    {
      id: 'total-capacity',
      value: '3.5M+',
      label: 'Total Capacity\n(units)',
      variant: 'blue',
    },
    {
      id: 'woven-tops',
      value: '2.5M+',
      label: 'Woven Tops\n(units)',
      variant: 'sky',
    },
    {
      id: 'woven-bottoms',
      value: '1M+',
      label: 'Woven Bottoms\n(units)',
      variant: 'navy',
    },
  ] satisfies CapacityStat[],
  pills: [
    'Vertically Integrated Manufacturing',
    'Advanced Global Machinery Brands',
    'Technology-Driven Operations',
    'Dedicated Salesman Samples (SMS) Line',
    'Quality Control at Every Stage',
    'Global Customer Base',
  ],
}

export const MANUFACTURING_CAPACITY = {
  badge: 'Monthly Production Capacity',
  title: 'Manufacturing Capacity at Scale',
  description:
    'Built on vertical integration, advanced manufacturing technologies, and decades of apparel expertise, our production platform delivers consistency, flexibility, and operational excellence. Every stage of manufacturing is carefully managed to ensure reliable execution, superior quality, and on-time delivery.',
  ctaLabel: 'Download Brochure',
  ctaHref: '/docs/Dekko_ISHO_Group.pdf',
  stats: [
    {
      id: 'total-capacity',
      value: '3.5M+',
      label: 'Total Capacity\n(units)',
      variant: 'blue',
    },
    {
      id: 'woven-tops',
      value: '2.5M+',
      label: 'Woven Tops\n(units)',
      variant: 'sky',
    },
    {
      id: 'woven-bottoms',
      value: '1M+',
      label: 'Woven Bottoms\n(units)',
      variant: 'navy',
    },
  ] satisfies CapacityStat[],
  pills: [],
  pillsWithIcons: [
    {
      icon: "/images/manufacturing/manufacturing-capacity/vertically-integrated-manufacturing.svg",
      label: 'Vertically Integrated Manufacturing',
    },
    {
      icon: "/images/manufacturing/manufacturing-capacity/advanced-european-machinery.svg",
      label: 'Advanced Global Machinery Brands',
    },
    {
      icon: "/images/manufacturing/manufacturing-capacity/technology-driven-operations.svg",
      label: 'Technology-Driven Operations',
    },
    {
      icon: "/images/manufacturing/manufacturing-capacity/3-dedicated-salesman-sample-lines.svg",
      label: 'Dedicated Salesman Samples (SMS) Line',
    },
    {
      icon: "/images/manufacturing/manufacturing-capacity/quality-control-at-every-stage.svg",
      label: 'Quality Control at Every Stage',
    },
    {
      icon: "/images/manufacturing/manufacturing-capacity/global-customer-base.svg",
      label: 'Global Customer Base',
    },
  ],
}

export const manufacturingEcosystem = {
  id: 'mfg-ecosystem',
  badge: 'Manufacturing Ecosystem',
  title: 'Everything Connected.\nEvery Process Optimized.',
  description:
    'Our vertically integrated manufacturing ecosystem connects every stage of production—from sourcing and product development to manufacturing, quality assurance, and logistics. By bringing every function together under one coordinated platform, we enhance collaboration, improve visibility, and deliver greater efficiency throughout the manufacturing journey.',
  image: '/images/manufacturing/manufacturing_ecosystem2.png',
  imageAlt: 'Interior view of a large apparel manufacturing floor',
}

const automationImage = (file: string) => `/images/manufacturing/automation/${file}`

export const manufacturingAutomation = {
  id: 'mfg-automation',
  description:
    'By combining intelligent technologies with advanced machinery, we deliver superior precision, optimized performance, and dependable manufacturing outcomes.',
  items: [
    {
      id: 'fabric-spreader',
      label: 'Fabric Spreader Machine',
      image: automationImage('fabric_spreader_machine2.png'),
      imageAlt: 'Fabric spreader machine on the cutting floor',
    },
    {
      id: 'auto-fabric-relaxation',
      label: 'Auto Fabric Relaxation Machine',
      image: automationImage('cutting_auto_fabric_relaxation_machine2.png'),
      imageAlt: 'Auto fabric relaxation machine processing layered fabric',
    },
    {
      id: 'auto-fabric-cutting',
      label: 'Auto Fabric Cutting',
      image: automationImage('auto_fabric_cutting2.png'),
      imageAlt: 'Automated fabric cutting machine',
    },
    {
      id: 'auto-pocket-welt',
      label: 'Auto Pocket Welt Machine',
      image: automationImage('auto_pocket_welt_machine2.png'),
      imageAlt: 'Auto pocket welt sewing machine',
    },
    {
      id: 'auto-collar-cuff',
      label: 'Auto Collar & Cuff Make Machine',
      image: automationImage('auto_collar_cuff_make_machine2.png'),
      imageAlt: 'Auto collar and cuff make machine',
    },
    {
      id: 'belt-loop-attach',
      label: 'Automatic Belt Loop Attach Machine',
      image: automationImage('automatic_belt_loop_attach_machine2.png'),
      imageAlt: 'Automatic belt loop attach machine',
    },
    {
      id: 'belt-setter-douglas',
      label: 'Automatic Belt Setter (Douglas)',
      image: automationImage('automatic_belt_setter.png'),
      imageAlt: 'Automatic belt setter Douglas machine',
    },
    {
      id: 'moisture-machine',
      label: 'Moisture Machine',
      image: automationImage('moisture_machine2.png'),
      imageAlt: 'Moisture machine for fabric treatment',
    },
  ],
}

const productRangeImage = (file: string) => `/images/manufacturing/powered-by-technology/${file}`

export const manufacturingTechnology = {
  id: 'mfg-technology',
  badge: 'Technology-Driven Manufacturing',
  title: 'Powered by Technology.\nDriven by Efficiency.',
  description:
    'Powered by Oracle EBS, Fast React, GPRO, advanced automation, and smart production systems, we optimize planning, production, inventory, and capacity management while maintaining complete operational visibility. Real-time monitoring and digital manufacturing tools enable faster decisions, reduced lead times, and consistent quality at every stage.',
  items: [
    {
      id: 'ebs',
      image: productRangeImage('EBS.png'),
      imageAlt: 'Enterprise resource planning technology placeholder',
      title: 'EBS',
      description: 'Enterprise Resource Planning',
    },
    {
      id: 'fast-react',
      image: productRangeImage('FastReact.png'),
      imageAlt: 'Fast React production planning technology placeholder',
      title: 'Fast React',
      description: 'Production Planning',
    },
    {
      id: 'gpro',
      image: productRangeImage('GPRO2.png'),
      imageAlt: 'GPRO production monitoring technology placeholder',
      title: 'GPRO',
      description: 'Production Monitoring',
    },
    {
      id: 'automation',
      image: productRangeImage('Automation.png'),
      imageAlt: 'Automated manufacturing equipment placeholder',
      title: 'Automation',
      description: 'Automated Manufacturing Equipment',
    },
  ],
}

const productRangeImage2 = (file: string) => `/images/manufacturing/product-range/${file}`

export const manufacturingProductRange = {
  badge: 'Versatile Manufacturing Capability',
  title: 'Designed for Diverse Product Categories.',
  description:
    'Our integrated manufacturing platform supports a broad portfolio of woven apparel, combining technical expertise, flexible production, and efficient manufacturing processes to meet diverse customer requirements.',
  items: [
    {
      id: 'formal-shirts',
      label: 'Formal Shirts',
      image: productRangeImage2('Formal Shirts2.png'),
      // image: 'https://placehold.co/600x400/red/white',
    },
    {
      id: 'casual-shirts',
      label: 'Casual Shirts',
      // image: productRangeImage('casual-shirts.png'),
      image: productRangeImage2('Casual Shirts2.png'),
    },
    {
      id: 'pants',
      label: 'Pants',
      image: productRangeImage2('Pants2.png'),
      // image: 'https://placehold.co/600x400/red/white',
    },
    {
      id: 'denim-twill-jackets',
      label: 'Denim & Twill Jackets',
      image: productRangeImage2('Denim & Twill Jackets2.png'),
      // image: 'https://placehold.co/600x400/red/white',
    },
    {
      id: 'quilted-shirts-jackets',
      label: 'Quilted Shirts & Jackets',
      image: productRangeImage2('Quilted Shirts & Jackets2.png'),
      // image: 'https://placehold.co/600x400/red/white',
    },
    {
      id: 'shakets',
      label: 'Shakets',
      image: productRangeImage2('Shakets2.png'),
      // image: 'https://placehold.co/600x400/red/white',
    },
    {
      id: 'ladies-blouse',
      label: "Ladies' Blouse",
      image: productRangeImage2('Ladies_ Blouse.png'),
      // image: 'https://placehold.co/600x400/red/white',
    },
    {
      id: 'ladies-dress',
      label: "Ladies' Dress",
      image: productRangeImage2('ladies-dress2.png'),
      // image: 'https://placehold.co/600x400/red/white',
    },
    {
      id: 'cap',
      label: "Cap",
      image: productRangeImage2('cap.png'),
      // image: 'https://placehold.co/600x400/red/white',
    },
    {
      id: 'jacket',
      label: "Jacket",
      image: productRangeImage2('jacket.png'),
      // image: 'https://placehold.co/600x400/red/white',
    },
  ],
}

export const manufacturingWhyItMatters = {
  title: 'Why It Matters',
  description:
    'Managing your orders under one roof keeps production seamless, fast, simple, and consistent.',
  items: [
    {
      id: 'customization',
      title: 'Improved Customization',
      description: "It's all about providing quality products for better value.",
    },
    {
      id: 'cycles',
      title: 'Shorter Development Cycles',
      description: 'At the speed of fast fashion, getting a product to market.',
    },
    {
      id: 'complexity',
      title: 'Reduced Operational Complexity',
      description: 'Single point contact ensures manageable workflow.',
    },
    {
      id: 'quality',
      title: 'Consistent Product Quality',
      description: 'Highly skilled workforce ensures top-tier apparel production.',
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
        'Capable of producing a wide range of products, including both formal and casual shirts, pants, ladies’ blouses, dresses, denim and twill jackets, shackets, quilted shirts, and jackets.',
    },
  ],
}

export const manufacturingQuality = {
  badge: 'Quality & Compliance',
  title: 'Built on Standards You Can Trust',
  description:
    'Every facility operates under internationally recognized certifications — from social compliance to environmental management.',
  items: [
    {
      id: 'q1',
      number: '01',
      title: 'Social Compliance',
      description: 'BSCI, WRAP and ethical audit programs across all manufacturing units.',
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
      description: 'In-house and third-party lab testing for color fastness, shrinkage and safety.',
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
      description: 'Restricted substances lists, chemical inventory and MRSL compliance programs.',
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
  `/images/manufacturing/product-network/${file}`

export const manufacturingProductionNetwork = {
  badge: 'Verified Scale',
  title: 'Production Network',
  description:
    'Our production units ensure better efficiency with their capacity, immense product mix, and compliance standards.',
  units: [
    {
      id: 'dekko-garments',
      title: 'Dekko Garments Ltd.',
      image: mfgProductNetworkImage('network-dgl.png'),
      imageAlt: 'Colorful garments hanging on production racks',
      productionLines: '46',
      monthlyCapacity: '1.44M',
      manpower: '6.8K',
      products:
        'Formal and Casual shirt, Casual bottom for both men & Ladies. (60% capacity for tops and 40% for bottom)',
      higgFfm: '83%',
      rscProgress: '92%',
    },
    {
      id: 'dekko-readywears',
      title: 'Dekko Readywears Ltd.',
      image: mfgProductNetworkImage('network-drl.png'),
      imageAlt: 'Readywear garments on studio hanging system',
      productionLines: '24',
      monthlyCapacity: '750K',
      manpower: '3.15K',
      products: "70% men’s casual, 20% ladies’, and 10% kids’",
      higgFfm: '75%',
      rscProgress: '100%',
    },
    {
      id: 'dekko-fashions',
      title: 'Dekko Fashions Ltd.',
      image: mfgProductNetworkImage('DFL-Card-Image.png'),
      imageAlt: 'Fashion display mannequins in red and white looks',
      productionLines: '10',
      monthlyCapacity: '300K',
      manpower: '1.45K',
      products: "80% men’s & ladies’ casual products, 15% formal men’s, 5% kids’",
      higgFfm: '68%',
      rscProgress: '100%',
    },
    {
      id: 'agami-fashions',
      title: 'Agami Fashions Ltd.',
      image: mfgProductNetworkImage('AFL-Card-Image.png'),
      imageAlt: 'Lifestyle fashion portrait in a forest setting',
      productionLines: '08',
      monthlyCapacity: '300K',
      manpower: '1.2K (AP.)',
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
        'Dedicated knitwear facility with circular and flat knitting lines, dyeing, and finishing—serving leading global brands.',
      image: '/images/skyview-company.png',
      imageAlt: 'Dekko Isho Knitwears factory interior',
      href: '/contact',
    },
    {
      id: 'garments',
      title: 'Dekko Isho Garments Ltd.',
      description:
        'High-volume woven garment production with cutting, sewing, washing, and export-ready finishing under one roof.',
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

export const manufacturingOperation = {
  badge: 'Inside the Operation',
  title: 'Materials, Quality, and Sampling – Managed End to End.',
  description:
    'Three disciplines run in lockstep across every order, keeping production uninterrupted, quality embedded at every stage, and development moving fast.',
  cards: [
    {
      id: 'material-management',
      number: '01',
      label: 'Material Management',
      title: 'Every Great Product Starts with the Right Materials.',
      description:
        'A well-managed material warehouse forms the foundation of efficient manufacturing. Through accurate inventory management, complete material traceability, barcode-enabled storage systems, and comprehensive fabric and trim inspections, we ensure uninterrupted production and consistent quality from the very beginning.',
      image: '/images/manufacturing/Material-Management2.png',
      imageAlt: 'Material management warehouse',
    },
    {
      id: 'quality-assurance',
      number: '02',
      label: 'Quality Assurance',
      title: 'Quality Built into Every Stage.',
      description:
        'Quality is embedded throughout our manufacturing process—not simply inspected at the end. Our quality management system integrates incoming material inspections, in-line quality control, laboratory testing using advanced European equipment, and final audits to ensure every garment consistently meets customer expectations and international standards.',
      image: '/images/manufacturing/quality-assurance.png',
      imageAlt: 'Quality assurance inspection',
    },
    {
      id: 'salesman-sample',
      number: '03',
      label: 'Salesman Sample Development',
      title: 'Accelerating Product Development.',
      description:
        'Fast sample development enables faster buying decisions. Our three dedicated Salesman Sample (SMS) production lines support rapid prototype development, fit validation, buyer presentations, and pre-production approvals, helping customers shorten development timelines and accelerate speed to market.',
      image: '/images/manufacturing/salesman_sample_development3.png',
      imageAlt: 'Salesman sample development',
    },
  ],
}

const MANUFACTURING_CLIENTS_PATH = '/images/dekko-clients/v5'

export type ManufacturingClientLogo = { src: string; alt: string; width: number }
export type ManufacturingClientRegionId = 'europe' | 'north-america' | 'international'
export type ManufacturingMapCoordinates = [longitude: number, latitude: number]
export type ManufacturingMapOffset = [x: number, y: number]
export type ManufacturingClientRegion = {
  id: ManufacturingClientRegionId
  accent: string
  title: string
  partnerLabel: string
  description: string
  logos: ManufacturingClientLogo[]
  map: {
    /** UN M49 country identifiers used by the local world-atlas topology. */
    countryCodes: readonly string[]
    includeUnassignedCountries?: boolean
    marker: {
      coordinates: ManufacturingMapCoordinates
      labelOffset: ManufacturingMapOffset
      labelWidth: number
    }
  }
}

function manufacturingClientLogo(filename: string, alt: string, width: number): ManufacturingClientLogo {
  return { src: `${MANUFACTURING_CLIENTS_PATH}/${encodeURIComponent(filename)}`, alt, width }
}

export const manufacturingClients: {
  id: string
  badge: string
  title: string
  description: string
  yearsOfTrust: string
  regions: ManufacturingClientRegion[]
} = {
  id: 'mfg-clients',
  badge: 'Global Business Footprint',
  title: 'Trusted by Global Fashion Brands.',
  description:
    'Dekko ISHO proudly partners with leading fashion brands and retailers across Europe, North America, and other international markets — long-term partnerships built on trust, quality, reliability, and responsible manufacturing.',
  yearsOfTrust: '40+',
  regions: [
    {
      id: 'north-america',
      accent: '#086BD8',
      title: 'North America',
      partnerLabel: 'North American Partners',
      description: 'Trusted manufacturing partner to leading North American fashion brands.',
      map: {
        countryCodes: [
          '044', '084', '124', '188', '192', '214', '222', '304', '320', '332', '340',
          '388', '484', '558', '591', '630', '780', '840',
        ],
        marker: {
          coordinates: [-102, 43],
          labelOffset: [15, -17],
          labelWidth: 142,
        },
      },
      logos: [
        manufacturingClientLogo('ralph_lauren.png', 'RALPH LAUREN', 203),
        manufacturingClientLogo('tommy_hilfiger.png', 'Tommy Hilfiger', 240),
        manufacturingClientLogo('kohls.png', 'KOHLS', 126),
        manufacturingClientLogo('levis.png', "Levis", 78),
        manufacturingClientLogo('marks.png', "Mark's", 124),
        manufacturingClientLogo('sport_chek.png', 'SportChek', 101),
        manufacturingClientLogo('j_crew.png', "J.Crew", 104),
        manufacturingClientLogo('helly_hansen.png', "Helly Hensen AS", 63),
        manufacturingClientLogo('musto.png', "Musto", 108),
        manufacturingClientLogo('target.png', "Target USA", 54),
      ],
    },
    {
      id: 'europe',
      accent: '#D9154B',
      title: 'Europe',
      partnerLabel: 'European Partners',
      description:
        'Long-standing partnerships with European brands and retailers across key markets.',
      map: {
        countryCodes: [
          '008', '040', '056', '070', '100', '112', '191', '196', '203', '208', '233',
          '246', '250', '276', '300', '348', '352', '372', '380', '428', '440', '442',
          '498', '499', '528', '578', '616', '620', '642', '688', '703', '705', '724',
          '752', '756', '804', '807', '826',
        ],
        marker: {
          coordinates: [12, 52],
          labelOffset: [15, -17],
          labelWidth: 83,
        },
      },
      logos: [
        manufacturingClientLogo('jack_and_jones.png', 'Jack & Jones', 163),
        manufacturingClientLogo('selected.png', "Selected homme", 124),
        manufacturingClientLogo('kiabi.png', 'Kiabi', 117),
        manufacturingClientLogo('zara.png', 'Zara', 82),
        manufacturingClientLogo('tommy_hilfiger.png', 'Tommy Hilfiger', 240),
        manufacturingClientLogo('varner.png', 'VARNER', 143),
        manufacturingClientLogo('celio.png', 'Celio', 118),
        manufacturingClientLogo('lindex.png', 'Lindex', 100),
        manufacturingClientLogo('tom_tailor.png', 'TOM TAILOR', 179),
        manufacturingClientLogo('carhartt.png', 'Carhartt', 140),
        manufacturingClientLogo('lpp.png', 'LPP', 70),
        manufacturingClientLogo('camel_active.png', 'Camel', 120),
        manufacturingClientLogo('voice.png', 'Voice', 100),
        manufacturingClientLogo('spring_field.png', 'Springfield', 162),
      ],
    },
    {
      id: 'international',
      accent: '#087F42',
      title: 'Other International Markets',
      partnerLabel: 'International Partners',
      description: "A growing export footprint serving global consumers' evolving demands.",
      map: {
        countryCodes: [],
        includeUnassignedCountries: true,
        marker: {
          coordinates: [105, 8],
          labelOffset: [-190, -17],
          labelWidth: 176,
        },
      },
      logos: [
      ],
    },
  ],
}

const JOURNEY_ICON_BASE = '/images/manufacturing/journey'

/**
 * Manufacturing Journey roadmap.
 * Desktop layout:
 * - Top L→R: Material Sourcing → … → Sewing & Assembly (6 columns)
 * - Right U-turn; bottom nodes under columns 1–5 (Material Sourcing has none beneath)
 * - Bottom R→L (path order): In-line QC → Finishing → Final Inspection → Packing → Shipment
 * - `stages` listed in reading order (top L→R, then bottom R→L along the path)
 */
export const manufacturingJourney = {
  id: 'mfg-journey',
  badge: 'Manufacturing Journey',
  title: 'From Sourcing to Packing.',
  description:
    'Every garment follows a carefully managed manufacturing journey designed to ensure efficiency, consistency, and uncompromising quality—with complete visibility and control from raw materials to final shipment.',
  stages: [
    {
      id: 'material-sourcing',
      label: 'Material Sourcing',
      row: 'top' as const,
      column: 0,
      icon: `${JOURNEY_ICON_BASE}/icon-material-sourcing.svg`,
    },
    {
      id: 'material-inspection',
      label: 'Material Inspection',
      row: 'top' as const,
      column: 1,
      icon: `${JOURNEY_ICON_BASE}/icon-material-inspection.svg`,
    },
    {
      id: 'salesman-sample-development',
      label: 'Salesman Sample Development',
      row: 'top' as const,
      column: 2,
      icon: `${JOURNEY_ICON_BASE}/icon-salesman-sample-development.svg`,
    },
    {
      id: 'pattern-marker-planning',
      label: 'Pattern & Marker Planning',
      row: 'top' as const,
      column: 3,
      icon: `${JOURNEY_ICON_BASE}/icon-pattern-marker-planning.svg`,
    },
    {
      id: 'fabric-cutting',
      label: 'Fabric Cutting',
      row: 'top' as const,
      column: 4,
      icon: `${JOURNEY_ICON_BASE}/icon-fabric-cutting.svg`,
    },
    {
      id: 'sewing-assembly',
      label: 'Sewing & Assembly',
      row: 'top' as const,
      column: 5,
      icon: `${JOURNEY_ICON_BASE}/icon-sewing-assembly.svg`,
    },
    {
      id: 'inline-quality-control',
      label: 'In-line Quality Control',
      row: 'bottom' as const,
      column: 5,
      icon: `${JOURNEY_ICON_BASE}/icon-inline-quality-control.svg`,
    },
    {
      id: 'finishing',
      label: 'Finishing',
      row: 'bottom' as const,
      column: 4,
      icon: `${JOURNEY_ICON_BASE}/icon-finishing.svg`,
    },
    {
      id: 'final-inspection',
      label: 'Final Inspection',
      row: 'bottom' as const,
      column: 3,
      icon: `${JOURNEY_ICON_BASE}/icon-final-inspection.svg`,
    },
    {
      id: 'packing',
      label: 'Packing',
      row: 'bottom' as const,
      column: 2,
      icon: `${JOURNEY_ICON_BASE}/icon-packing.svg`,
    },
    {
      id: 'shipment',
      label: 'Shipment',
      row: 'bottom' as const,
      column: 1,
      icon: `${JOURNEY_ICON_BASE}/icon-shipment.svg`,
    },
  ],
}

export const manufacturingJourneyRoadmap = {
  id: 'mfg-journey',
  badge: 'Manufacturing Journey',
  title: 'From Sourcing to Packing.',
  description:
    'Every garment follows a carefully managed manufacturing journey designed to ensure efficiency, consistency, and uncompromising quality—with complete visibility and control from raw materials to final shipment.',
  stages: [
    {
      id: 'material-sourcing',
      label: 'Material\nSourcing',
      row: 'top' as const,
      column: 0,
      icon: `${JOURNEY_ICON_BASE}/icon-material-sourcing.svg`,
    },
    {
      id: 'material-inspection',
      label: 'Material\nInspection',
      row: 'top' as const,
      column: 1,
      icon: `${JOURNEY_ICON_BASE}/icon-material-inspection.svg`,
    },
    {
      id: 'sample-development',
      label: 'Sample\nDevelopment',
      row: 'top' as const,
      column: 2,
      icon: `${JOURNEY_ICON_BASE}/icon-salesman-sample-development.svg`,
    },
    {
      id: 'pattern-marker',
      label: 'Pattern\n& Marker',
      row: 'top' as const,
      column: 3,
      icon: `${JOURNEY_ICON_BASE}/icon-pattern-marker-planning.svg`,
    },
    {
      id: 'fabric-cutting',
      label: 'Fabric\nCutting',
      row: 'top' as const,
      column: 4,
      icon: `${JOURNEY_ICON_BASE}/icon-fabric-cutting.svg`,
    },
    {
      id: 'sewing-assembly',
      label: 'Sewing\n& Assembly',
      row: 'top' as const,
      column: 5,
      icon: `${JOURNEY_ICON_BASE}/icon-sewing-assembly.svg`,
    },
    {
      id: 'inline-qc',
      label: 'In-line\nQC',
      row: 'bottom' as const,
      column: 5,
      icon: `${JOURNEY_ICON_BASE}/icon-inline-quality-control.svg`,
    },
    {
      id: 'finishing',
      label: 'Finishing',
      row: 'bottom' as const,
      column: 4,
      icon: `${JOURNEY_ICON_BASE}/icon-finishing.svg`,
    },
    {
      id: 'final-inspection',
      label: 'Final\nInspection',
      row: 'bottom' as const,
      column: 3,
      icon: `${JOURNEY_ICON_BASE}/icon-final-inspection.svg`,
    },
    {
      id: 'packing',
      label: 'Packing',
      row: 'bottom' as const,
      column: 2,
      icon: `${JOURNEY_ICON_BASE}/icon-packing.svg`,
    },
    {
      id: 'shipment',
      label: 'Shipment',
      row: 'bottom' as const,
      column: 1,
      icon: `${JOURNEY_ICON_BASE}/icon-shipment.svg`,
    },
  ],
}

export const manufacturingCta = {
  badge: null,
  heading: "And Build What's Next, Together",
  description:
    "Get in touch with us. Start the conversation by telling us about your ideas & let's get down to work together.",
  buttonLabel: 'Send us a message',
  buttonHref: '/contact',
}
