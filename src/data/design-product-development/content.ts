export const designProductDevelopmentHero = {
  badge: 'Fashion is constantly evolving and so are we',
  titleLines: [
    [
      { text: 'Design' },
      { text: 'Studio' },
      { text: '&' },
      { text: 'Product' },
      { text: 'Development' },
    ],
  ],
  subtitle:
    'At Dekko ISHO Design Studio, we transform ideas into market-ready collections through creativity, material innovation, and advanced product development. Our designers, product developers, fabric specialists, and technical experts collaborate with global brands to create products that are trend-driven, commercially relevant, and production-ready.',
  ctaLabel: 'Explore Our Capabilities',
  ctaHref: '#dpd-capabilities',
  video: '/videos/design-product-development-hero.mp4',
  videoAlt: 'Design Studio and Product Development at Dekko ISHO',
}

const CAPABILITY_IMAGE_BASE = '/images/design-product-development'

export const designProductDevelopmentCapabilities = {
  id: 'dpd-capabilities',
  badge: 'Why Dekko ISHO',
  title: 'Why leading brands partner with us.',
  description:
    "We combine creativity, technology, material expertise, and integrated manufacturing to simplify product development. From concept creation and fabric innovation to digital sampling and production readiness, our Design Studio works as an extension of our customers' teams.",
  items: [
    {
      id: 'trend-intelligence',
      image: `${CAPABILITY_IMAGE_BASE}/why-trend-intelligence.png`,
      imageAlt: 'Designer reviewing shirt designs and trend research on a studio monitor',
      title: 'Trend Intelligence',
      description: 'Global market insights that shape every collection direction.',
    },
    {
      id: 'creative-design',
      image: `${CAPABILITY_IMAGE_BASE}/why-creative-design.png`,
      imageAlt: 'Designer working at a desk surrounded by clothing racks in the design studio',
      title: 'Creative Design',
      description: 'Original concepts turned into commercially relevant products.',
    },
    {
      id: 'material-innovation',
      image: `${CAPABILITY_IMAGE_BASE}/why-material-innovation.png`,
      imageAlt: 'Fabric swatches hanging on racks in the material library',
      title: 'Material Innovation',
      description: 'Innovative fabrics, trims, washes, and sustainable materials.',
    },
    {
      id: 'digital-development',
      image: `${CAPABILITY_IMAGE_BASE}/why-digital-development.png`,
      imageAlt: 'Laptop displaying 3D fashion avatar and digital sampling software',
      title: 'Digital Development',
      description: 'Digital sampling and 3D workflows from first sketch to approval.',
    },
  ],
}

export const designProductDevelopmentStudio = {
  id: 'dpd-studio',
  badge: 'Design Studio',
  title: 'Creativity backed by expertise.',
  description:
    'Our Design Studio brings together fashion designers, textile specialists, product developers, and technical experts who turn concepts into commercially successful products through creativity, technical excellence, and manufacturing knowledge.',
  image: `${CAPABILITY_IMAGE_BASE}/design-studio-team.png`,
  imageAlt: 'Design Studio team collaborating at a communal desk',
}

export const designProductDevelopmentDigital = {
  id: 'dpd-digital',
  badge: 'Smarter design. Faster decisions.',
  title: 'Digital Product Development',
  description:
    'Using AI-assisted workflows, WGSN, Browzwear, CLO 3D, Textronic, and CAD software, we improve fit accuracy, reduce physical sampling, shorten lead times, and enable faster collaboration.',
  items: [
    {
      id: 'trend-forecasting',
      title: 'Trend Forecasting',
      description: 'WGSN market and category intelligence',
    },
    {
      id: '3d-visualization',
      title: '3D Visualization',
      description: 'True-to-life digital garments in Browzwear & CLO 3D',
    },
    {
      id: 'fabric-pattern',
      title: 'Fabric & Pattern',
      description: 'Textronic and CAD software for rapid design iteration',
    },
    {
      id: 'ai-assisted-workflows',
      title: 'AI-assisted Workflows',
      description: 'Faster iteration, fewer physical rounds, quicker approvals',
    },
  ],
}

export const designProductDevelopmentMaterials = {
  id: 'dpd-materials',
  badge: 'Materials',
  title: 'The Foundation of Inspired Product Development.',
  items: [
    {
      id: 'fabric-library',
      image: `${CAPABILITY_IMAGE_BASE}/materials-fabric-library.png`,
      imageAlt: 'Shelves packed with folded fabric samples in the fabric library',
      title: 'Fabric Library',
      description:
        'Our Fabric Library features innovative fabrics, trims, washes, finishes, and sustainable materials sourced from leading mills worldwide, providing continuous inspiration for new collections.',
    },
    {
      id: 'global-sourcing',
      image: `${CAPABILITY_IMAGE_BASE}/materials-global-sourcing.png`,
      imageAlt: 'Fabric swatches hanging on racks in the material sourcing room',
      title: 'Global Fabric Sourcing & Innovation',
      description:
        "We don't simply source fabrics – we discover materials that inspire the next generation of fashion. Our Fabric Sourcing & Innovation Team explores global textile fairs and sourcing destinations to identify emerging materials and enrich our Fabric Library with commercially relevant innovations.",
    },
  ],
}

export const designProductDevelopmentServices = {
  id: 'dpd-services',
  badge: 'Our Services',
  title: 'Pre-Production Quality Assurance — Key Highlights',
  description:
    'Structured QA checkpoints before bulk production help protect fit, construction and finish — reducing rework and keeping timelines on track.',
  image: '/images/design%20and%20product/design%20and%20dev.png',
  imageAlt: 'Design and product development quality inspection',
  steps: [
    {
      id: 'raw-material',
      number: '01',
      title: 'Raw Material Selection & Inspection',
      items: [
        'Inspect fabric quality, color and composition.',
        'Check technical data sheet standards.',
        'Review supplier certifications and audits.',
      ],
    },
    {
      id: 'sample',
      number: '02',
      title: 'Approved Sample Creation',
      items: [
        'Finalize design, pattern and specification.',
        'Develop prototype for approval.',
        'Set quality and reject criteria.',
      ],
    },
    {
      id: 'planning',
      number: '03',
      title: 'Production Planning',
      items: [
        'Prepare production readiness checklist.',
        'Confirm materials and development comments.',
        'Align factory teams before execution.',
      ],
    },
  ],
}

export const designProductDevelopmentGlobalNetwork = {
  id: 'dpd-global-network',
  badge: 'Global Design Network',
  title: 'Close to the market, wherever you are.',
  description: 'We translate global fashion insights into market-ready collections.',
  image: '/images/design-product-development/global-design-network.jpg',
  imageAlt: 'Neutral-toned textured fabrics and knits hanging in a design studio',
  items: [
    {
      id: 'london-showroom',
      number: '01',
      accent: '#F3215D',
      title: 'London Showroom',
      description:
        'A dedicated space to explore collections, review samples, and collaborate with our design team in person.',
    },
    {
      id: 'european-support',
      number: '02',
      accent: '#449BFF',
      title: 'European Design Support',
      description: 'On-the-ground design collaboration with European brands and teams.',
    },
    {
      id: 'sourcing-network',
      number: '03',
      accent: '#14B253',
      title: 'International Sourcing Network',
      description:
        'A global sourcing network that keeps materials, trends, and innovation flowing into every collection.',
    },
  ],
}

/**
 * Product Development Journey roadmap.
 * Desktop layout (from design mock):
 * - Top L→R: Trend Research → Concept & Design → Fabric Development → 3D Visualization → Pattern Development
 * - Right U-turn; bottom nodes under columns 2–5 (Trend has none beneath)
 * - Bottom L→R (visual): Sample Creation → Fit & Technical Review → Buyer Approval → Production Ready
 * - Dashed path snakes R→L on the bottom row after the curve
 * - `stages` listed in reading order (top L→R, then bottom L→R)
 */
export const designProductDevelopmentJourney = {
  id: 'dpd-journey',
  badge: 'From trend research to production ready',
  title: 'Product Development Journey',
  stages: [
    { id: 'trend-research', label: 'Trend Research', row: 'top' as const, column: 0 },
    { id: 'concept-design', label: 'Concept & Design', row: 'top' as const, column: 1 },
    { id: 'fabric-development', label: 'Fabric Development', row: 'top' as const, column: 2 },
    { id: '3d-visualization', label: '3D Visualization', row: 'top' as const, column: 3 },
    { id: 'pattern-development', label: 'Pattern Development', row: 'top' as const, column: 4 },
    { id: 'sample-creation', label: 'Sample Creation', row: 'bottom' as const, column: 1 },
    { id: 'fit-technical-review', label: 'Fit & Technical Review', row: 'bottom' as const, column: 2 },
    { id: 'buyer-approval', label: 'Buyer Approval', row: 'bottom' as const, column: 3 },
    { id: 'production-ready', label: 'Production Ready', row: 'bottom' as const, column: 4 },
  ],
}

export const designProductDevelopmentDigitalImpact = {
  id: 'dpd-digital-impact',
  badge: 'Design excellence infrastructure',
  title: 'Digital-first development, measurable impact.',
  description:
    'Digital product development minimizes physical sampling, accelerates decision-making, and helps brands launch collections faster while reducing material waste.',
  items: [
    {
      id: 'fewer-samples',
      title: 'Fewer physical samples',
      description: 'Virtual sampling replaces costly physical rounds.',
    },
    {
      id: 'faster-decisions',
      title: 'Faster decision-making',
      description: '3D visualization accelerates approvals across the lifecycle.',
    },
    {
      id: 'faster-launches',
      title: 'Faster collection launches',
      description: 'Styles reach market sooner, with greater accuracy.',
    },
    {
      id: 'reduced-waste',
      title: 'Reduced material waste',
      description: 'Digital iteration cuts fabric consumption before production.',
    },
  ],
}

export const designProductDevelopmentSolutionsBanner = {
  badge: 'Product Development',
  title: 'Unique design solutions for modern apparel customers.',
  descriptions: [
    'Our product development studio that can help you create new styles and new garments. We can start with a sketch, a picture, or a verbal idea. We provide fashion design, sourcing, pattern making, and sample making.',
    'Our Design studio was established to provide unique design solution to our customer. To be a key player, we recognize the need to invest in design and hence our own specialized Design studio.',
  ],
  buttonLabel: 'Schedule consultation',
  buttonHref: '/contact',
  backgroundImage: '/images/design%20and%20product/unique-design-bg.jpg',
  backgroundAlt: 'Modern design studio interior',
}

export const designProductDevelopmentConcept = {
  badge: 'Creative Capability',
  title: 'From idea reference to sample-ready fashion development.',
  description:
    'Our Design Studio offers unique design solutions, focusing on fashion design, sourcing, pattern making, and sample creation. We aim to turn initial concepts into production-ready garments and collections.',
  imageSrc: '/images/design%20and%20product/design-studio.png',
  imageAlt: 'Dress forms in a design studio',
  imageLabel: 'Design',
}

export const designProductDevelopmentFacilities = {
  badge: 'People & Facilities',
  title: 'Design value focused on specialized people and facilities.',
  columnLabels: {
    category: 'Focus Area',
    details: 'Details',
  },
  items: [
    {
      id: 'studio',
      category: 'Design Studio',
      details: [
        'Dedicated workspace for sketching, draping and 3D visualization',
        'Seasonal trend boards and material libraries on-site',
      ],
    },
    {
      id: 'cad',
      category: 'CAD & Pattern',
      details: [
        'Digital pattern development and grading support',
        'Marker optimization for efficient fabric utilization',
      ],
    },
    {
      id: 'sample',
      category: 'Sample Room',
      details: [
        'Proto, fit and salesman sample production',
        'Quick iteration cycles for buyer feedback',
      ],
    },
    {
      id: 'qa',
      category: 'QA Support',
      details: [
        'Pre-production measurement and construction checks',
        'Documentation for smooth bulk handover',
      ],
    },
  ],
}

export const designProductDevelopmentExperience = {
  badge: 'Customer Advantages',
  titleBefore: 'Dependable ',
  titleAccent: 'design',
  titleAfter: ' and sourcing solutions for your supply chain.',
  items: [
    {
      id: 'vertical',
      number: '01',
      title: 'Vertical Setup',
      description: 'A vertically integrated setup from yarn to garments.',
    },
    {
      id: 'range',
      number: '02',
      title: 'Wide Product Range',
      description:
        'Basic, stylized, and high-fashion tops and bottoms for men, women, and children.',
    },
    {
      id: 'value',
      number: '03',
      title: 'Value Additions',
      description:
        'Includes embroidery, printing, and garment washes for elevated product development.',
    },
    {
      id: 'flexible',
      number: '04',
      title: 'Flexible Production',
      description: 'Production flexibility in terms of minimums and lead times.',
    },
    {
      id: 'team',
      number: '05',
      title: 'Committed Team',
      description:
        'A professional team that commits what can be delivered and delivers what is committed.',
    },
    {
      id: 'woven',
      number: '06',
      title: 'Woven Focus',
      description:
        'Offers a wide range of woven tops and bottoms with special focus on value additions.',
    },
  ],
}

export const designProductDevelopmentPresence = {
  badge: 'Photo Gallery',
  title: 'Design Studio in Action',
  description:
    'A visual look at the studio environment, fabric exploration, sketching, sample development, and showroom references that support faster product decisions.',
  primaryImage: {
    src: '/images/design%20and%20product/gallery-primary.png',
    alt: 'Model in contemporary fashion styling',
  },
  gridImages: [
    { src: '/images/design%20and%20product/gallery-1.png', alt: 'Craft supplies for design development' },
    { src: '/images/design%20and%20product/gallery-2.png', alt: 'Retail showroom interior' },
    { src: '/images/design%20and%20product/gallery-3.png', alt: 'Mannequins in summer collection display' },
    { src: '/images/design%20and%20product/gallery-4.png', alt: 'Fashion styling in a tropical setting' },
  ],
  bannerImage: {
    src: '/images/design%20and%20product/gallery-banner.png',
    alt: 'Fabric rolls in a design workshop',
  },
}

/** Asymmetric 3-image gallery (425 / 610 / 425). Copy from existing Photo Gallery / presence content. */
export const designProductDevelopmentGallery = {
  id: 'dpd-gallery',
  badge: 'Photo Gallery',
  title: 'Design Studio in Action',
  description:
    'A visual look at the studio environment, fabric exploration, sketching, sample development, and showroom references that support faster product decisions.',
  images: [
    {
      id: 'garment-detailing',
      size: 'side' as const,
      src: `${CAPABILITY_IMAGE_BASE}/gallery-garment-detailing.jpg`,
      alt: 'Designer pinning trim detail onto a jacket on a dress form',
    },
    {
      id: 'studio-collaboration',
      size: 'center' as const,
      src: `${CAPABILITY_IMAGE_BASE}/gallery-studio-collaboration.jpg`,
      alt: 'Designers collaborating over fashion sketches at a studio table',
    },
    {
      id: 'fabric-review',
      size: 'side' as const,
      src: `${CAPABILITY_IMAGE_BASE}/gallery-fabric-review.jpg`,
      alt: 'Hands reviewing fabric swatches beside a laptop in the design studio',
    },
  ],
}

export const designProductDevelopmentShowroom = {
  badge: 'Visit Store',
  titleBefore: 'Explore Showroom in',
  titleAccent: 'London',
  description:
    'Reach us directly, whether you want to call, visit our corporate headquarters, email an inquiry, or connect with Dekko ISHO Group on social media.',
  addressLabel: '// Address //',
  addressLines: ['94 Harley Street', 'London W1G 7HX'],
  mapLabel: 'Open in Maps',
  mapHref: 'https://maps.google.com/?q=94+Harley+Street+London+W1G+7HX',
}

export const designProductDevelopmentCta = {
  badge: "Let's Connect",
  heading: "And build what's next, together",
  description:
    'Get in touch with our team for partnership, sourcing, careers or general inquiries. We will get back to you with answers.',
  buttonLabel: 'Schedule consultation',
  buttonHref: '/contact',
}
