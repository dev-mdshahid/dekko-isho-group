export const designProductDevelopmentHero = {
  titleLines: [[{ text: 'Design' }, { text: '&' }, { text: 'Development' }]],
  subtitle: 'Fashion Intelligence to Manufacturing Excellence.',
  ctaLabel: 'Learn More',
  ctaHref: '#dpd-capabilities',
  video: '/videos/design%20and%20product%20dev.mp4',
  videoAlt: 'Design team collaborating in a modern studio',
}

const CAPABILITY_IMAGE_BASE = '/images/design-product-development'

export type DesignCapabilityIcon =
  | 'search'
  | 'pencil'
  | 'shirt'
  | 'layers'
  | 'chart'
  | 'scroll'
  | 'ruler'
  | 'folder'
  | 'box'

export const designProductDevelopmentCapabilities = {
  id: 'dpd-capabilities',
  badge: 'Capabilities',
  title: 'A development system that balances creativity and control.',
  description:
    'Our Design & Development team combines market insights, technical expertise, and digital product creation to transform concepts into production-ready garments. Through advanced 3D technologies and virtual product development, we enable faster approvals, greater design accuracy, and more efficient collaboration throughout the product lifecycle.',
  items: [
    {
      id: 'trend-research',
      icon: 'search' as const satisfies DesignCapabilityIcon,
      iconTone: 'blue',
      image: `${CAPABILITY_IMAGE_BASE}/capability-trend-research.jpg`,
      imageAlt: 'Designers collaborating on fashion sketches',
      title: 'Trend Research & Product Ideation',
      description: 'Market signals and category insight shaping every collection direction.',
    },
    {
      id: 'design-rd',
      icon: 'pencil' as const satisfies DesignCapabilityIcon,
      iconTone: 'amber',
      image: `${CAPABILITY_IMAGE_BASE}/capability-design-rd.jpg`,
      imageAlt: 'Fabric swatches, thread bobbins and design notebook',
      title: 'Design & R&D',
      description: 'Original design development backed by continuous research and experimentation.',
    },
    {
      id: 'garment-visualization',
      icon: 'shirt' as const satisfies DesignCapabilityIcon,
      iconTone: 'pink',
      image: `${CAPABILITY_IMAGE_BASE}/capability-garment-visualization.jpg`,
      imageAlt: 'Draped patterned fabric for digital garment visualization',
      title: '3D Garment Visualization',
      description: 'True-to-life digital garments before a single cut is made (Browzwear & CLO)',
    },
    {
      id: 'virtual-sampling',
      icon: 'layers' as const satisfies DesignCapabilityIcon,
      iconTone: 'green',
      image: `${CAPABILITY_IMAGE_BASE}/capability-virtual-sampling.jpg`,
      imageAlt: 'Design workspace with fabric swatches, sketches and measuring tools',
      title: 'Virtual Sampling',
      description: 'Digital samples that reduce physical rounds, cost and material waste.',
    },
    {
      id: 'tech-pack',
      icon: 'chart' as const satisfies DesignCapabilityIcon,
      iconTone: 'violet',
      image: `${CAPABILITY_IMAGE_BASE}/capability-tech-pack.jpg`,
      imageAlt: 'Designers working on a laptop with fabric samples',
      title: 'Digital Tech Pack Creation',
      description: 'Precise, production-ready specifications for every style.',
    },
    {
      id: 'bom-management',
      icon: 'scroll' as const satisfies DesignCapabilityIcon,
      iconTone: 'gray',
      image: `${CAPABILITY_IMAGE_BASE}/capability-bom-management.jpg`,
      imageAlt: 'Garment pattern pieces hanging on a rail',
      title: 'Bill of Materials (BOM) Management',
      description: 'Structured material data from first sketch to bulk order.',
    },
    {
      id: 'fit-engineering',
      icon: 'ruler' as const satisfies DesignCapabilityIcon,
      iconTone: 'sky',
      image: `${CAPABILITY_IMAGE_BASE}/capability-fit-engineering.jpg`,
      imageAlt: 'Measuring tape held against a garment shoulder seam',
      title: 'Fit Engineering',
      description: 'Consistent, engineered fits across sizes and silhouettes.',
    },
    {
      id: 'collection-development',
      icon: 'folder' as const satisfies DesignCapabilityIcon,
      iconTone: 'teal',
      image: `${CAPABILITY_IMAGE_BASE}/capability-collection-development.jpg`,
      imageAlt: 'Outerwear collection hanging on a rack',
      title: 'Collection Development',
      description: 'Cohesive, commercial collections built season after season.',
    },
    {
      id: 'design-simulation',
      icon: 'box' as const satisfies DesignCapabilityIcon,
      iconTone: 'purple',
      image: `${CAPABILITY_IMAGE_BASE}/capability-design-simulation.png`,
      imageAlt: '3D garment design software on a studio monitor',
      title: 'Rapid Design Simulation',
      description: 'Fast fabric design iteration with dedicated software (Textronics)',
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

export const designProductDevelopmentFactoryAssurance = {
  badge: 'Process',
  title: 'Pre-Production Quality Assurance in Factory',
  items: [
    {
      id: 'raw-material',
      number: '01',
      accent: '#FFC219',
      title: 'Raw Material Inspection against standard',
      items: [
        'Max 4 point Inspection',
        'Max 20 points/100 sq. Yds',
        '100% shrinkage & Shade management',
        'Zero defect acceptance',
        '1.5 AQL inspection for trims & accessories',
        'Basic test of bulk fabrics by the supplier',
        'Supplier audits & certifications.',
      ],
    },
    {
      id: 'size-set',
      number: '02',
      accent: '#F3215D',
      title: 'Size Set samples review by color',
      description:
        'Finalize designs/patterns and specifications to create an approved sample.',
    },
    {
      id: 'pre-production',
      number: '03',
      accent: '#449BFF',
      title: 'Pre -Production Meeting by style',
      description:
        'Establish quality standards and reject criteria based on approved samples',
    },
    {
      id: 'pilot-run',
      number: '04',
      accent: '#14B253',
      title: 'Pilot Run / First of Bulk review by style',
      description:
        'Establish quality standards and reject criteria based on approved samples.',
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
  eyebrow: "Let's Connect",
  heading: "And build what's next, together",
  description:
    "Get in touch with our team for partnership, sourcing, careers or general inquiries - we'll get back to you with answers.",
  buttonLabel: 'Schedule consultation',
  buttonHref: '/contact',
  email: 'hello@dekkoisho.com',
  emailHref: 'mailto:hello@dekkoisho.com',
}
