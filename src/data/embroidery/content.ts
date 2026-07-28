import type { CapacityStat } from '../../components/ui/CapacityStatCircles'

export const embroideryHero = {
  titleLines: [[{ text: 'Embroidery' }]],
  subtitle:
    'Our integrated embroidery facility combines advanced machinery, skilled craftsmanship, and efficient processes to create high-quality embroidery solutions with precision and consistency. From intricate designs to large-scale production, we deliver reliable embroidery capabilities tailored to the needs of global fashion brands.',
  ctaLabel: 'Learn More',
  ctaHref: '#embroidery-capabilities',
  video: '/images/embroidery/embroidery-hero.mp4',
  videoAlt: 'Industrial embroidery machine stitching a floral pattern on fabric',
}

const EMBROIDERY_CAPABILITIES_IMAGE_BASE = '/images/embroidery/capabilities'

export const embroideryCapabilities = {
  id: 'embroidery-capabilities',
  badge: 'Advanced Embroidery Capabilities',
  title: 'Precision in every stitch',
  titleBefore: 'Precision in every',
  titleAccent: 'stitch',
  description:
    'Our embroidery facility offers versatile embroidery solutions for a wide range of garment categories and customer requirements. Combining technical expertise with advanced machinery, we deliver intricate designs with exceptional stitch quality, design accuracy, and production flexibility.',
  items: [
    {
      id: 'logo',
      title: 'Logo Embroidery',
      image: `${EMBROIDERY_CAPABILITIES_IMAGE_BASE}/logo-embroidery.png`,
      imageAlt: 'Industrial embroidery machine stitching a logo onto fabric',
    },
    {
      id: 'badge',
      title: 'Badge Embroidery',
      image: `${EMBROIDERY_CAPABILITIES_IMAGE_BASE}/badge-embroidery.png`,
      imageAlt: 'Collection of embroidered badges and patches',
    },
    {
      id: 'decorative',
      title: 'Decorative Embroidery',
      image: `${EMBROIDERY_CAPABILITIES_IMAGE_BASE}/decorative-embroidery.png`,
      imageAlt: 'Close-up of decorative gold-thread embroidery on fabric',
    },
    {
      id: 'customized',
      title: 'Customized Embroidery',
      image: `${EMBROIDERY_CAPABILITIES_IMAGE_BASE}/customized-embroidery.png`,
      imageAlt: 'Multi-colored customized embroidery being stitched by machine',
    },
  ],
}

export const embroideryTechnology = {
  id: 'embroidery-technology',
  badge: 'Advanced Embroidery Technology',
  title: 'Technology that Stitches with Precision',
  description:
    'Powered by industry-leading Barudan and Maya embroidery machines, our facility delivers high-speed, high-precision embroidery with exceptional consistency across both development and bulk production.',
  items: [
    {
      id: 'barudan',
      title: 'Barudan Machines',
      description:
        'Industry-leading embroidery machinery delivering high-speed, high-precision output.',
      image: '/images/embroidery/barudan.png',
      imageAlt: 'Barudan multi-head embroidery machines',
    },
    {
      id: 'maya',
      title: 'MAYA Machines',
      description: 'Consistent stitch quality across both development and bulk production.',
      image: '/images/embroidery/maya.png',
      imageAlt: 'MAYA dual-head embroidery machine',
    },
    {
      id: 'multi-head',
      title: 'Multi-head Embroidery Systems',
      description: 'Parallel head configurations supporting efficient large-scale runs.',
      image: '/images/embroidery/in-house.jpg',
      imageAlt: 'Multi-head industrial embroidery production line',
    },
  ],
}

export const embroideryProductionCapacity = {
  badge: 'Production Capacity',
  title: 'Capacity Built for Every Production Schedule',
  titleLeadingAccent: 'Capacity',
  titleBefore: 'Built for Every Production',
  titleAccent: 'Schedule',
  titleAccentTone: 'amaranth' as const,
  description:
    'Designed for high-volume manufacturing, our facility combines advanced machinery, experienced professionals, and efficient production planning to deliver consistent quality while meeting demanding production timelines.',
  ctaLabel: 'Download Brochure',
  ctaHref: '/docs/Dekko_ISHO_Group.pdf',
  stats: [
    {
      id: 'monthly-capacity',
      value: '3,50,000',
      label: 'Capacity (Pcs/ month)',
      variant: 'blue',
    },
    {
      id: 'total-machines',
      value: '06',
      label: 'Total Machines',
      variant: 'sky',
    },
    {
      id: 'skilled-professionals',
      value: '56',
      label: 'Skilled Professionals',
      variant: 'pink',
    },
  ] satisfies CapacityStat[],
}

export const embroideryTechnicalDevelopment = {
  id: 'embroidery-technical-development',
  badge: 'Technical Development',
  title: 'Every Design Perfected Before Production',
  description:
    'Every embroidery design is digitized, optimized, and sampled before production begins. Our technical team ensures accurate stitch programming, efficient machine performance, and production-ready execution.',
  items: [
    {
      id: 'artwork-optimization',
      title: 'Artwork Optimization',
      description: 'Designs digitized and optimized for accurate reproduction',
    },
    {
      id: 'stitch-programming',
      title: 'Stitch Programming',
      description: 'Accurate stitch paths for efficient machine performance',
    },
    {
      id: 'sample-development',
      title: 'Sample Development',
      description: 'Production-ready execution validated before bulk',
    },
  ],
}

export const embroideryQualityAssurance = {
  id: 'embroidery-quality-assurance',
  badge: 'Quality Assurance',
  title: 'Quality control before a single panel moves.',
  description:
    'Every embroidered panel undergoes rigorous quality checks throughout the production process. From design approval and stitch verification to final inspection, we ensure every detail meets customer specifications before moving to the next stage.',
  highlightTitle: '100% Panel Inspection',
  highlightDetail: 'Stitch Consistency • Defect Management',
  image: '/images/embroidery/quality-assurance.jpg',
  imageAlt: 'Quality audit and sorting tables inspecting embroidered panels',
}

export const embroideryProductionNetwork = {
  badge: 'Verified scale',
  title: 'Production Network',
  description: 'We operate within a strong, sustainable network for all your needs.',
  units: [
    {
      id: 'dgl',
      title: 'DGL Embroidery Unit',
      image: '/images/embroidery/dgl-embroidery-unit.png',
      imageAlt: 'Garments on hangers at the DGL Embroidery Unit',
      monthlyCapacity: '50,00,000',
      monthlyCapacityLabel: 'Stitching capacity',
      monthlyCapacityUnit: 'Stitches/day',
      productionLines: '9',
      productionLinesLabel: 'Machines',
    },
    {
      id: 'globus',
      title: 'Globus Embroidery',
      image: '/images/embroidery/globus-embroidery.png',
      imageAlt: 'Finished embroidered garments at Globus Embroidery',
      monthlyCapacity: '350,000',
      monthlyCapacityLabel: 'Production capacity',
      monthlyCapacityUnit: 'PCS/month',
      productionLines: '6',
      productionLinesLabel: 'Machines',
    },
  ],
}

export const embroideryWhyItMatters = {
  title: 'Why It Matters',
  description:
    'We prioritize embroidery as an essential element that elevates quality, craftsmanship, and brand expression across our product offerings.',
  items: [
    {
      id: 'craftsmanship',
      title: 'Exceptional craftsmanship',
      description: 'A testament to artistry and technical precision.',
    },
    {
      id: 'durability',
      title: 'Durability and Longevity',
      description: 'High-performance stitching for high-end garments.',
    },
    {
      id: 'unique',
      title: 'Distinctively Unique',
      description: 'Customizations that set your brand apart in the market.',
    },
  ],
}

export const embroideryCta = {
  badge: 'Get in touch',
  heading: "And build what's next, together",
  description:
    'Get in touch with us to find out how our high quality embroidery and production network can help your brand grow.',
  buttonLabel: 'Shoot us a line',
  buttonHref: '/contact',
}

/** @deprecated Not used on the current embroidery page design. */
export const embroiderySpotlight = {
  badge: 'Applied Decoration',
  title: 'From approved artwork to embroidered bulk.',
  description:
    "Globus Embroidery Ltd., a sister concern of Dekko ISHO Group, extends the group's decoration capacity alongside the DGL unit. Together with Sprintex Enterprise's digital textile printing, decoration stays inside the group – from logos and badges to prints on voile, viscose, and twill.",
  image: '/images/embroidery/embroidery-machines.jpg',
  imageAlt: 'Industrial embroidery machines in a production facility',
}

/** @deprecated Not used on the current embroidery page design. */
export const embroideryQuality = {
  badge: 'Embroidery QA Process',
  title: 'Quality control before a single panel moves.',
  description:
    'Every embroidered panel passes through in-process quality control – from the placement standard set before bulk to a 100% check before panels reach the production floor.',
  items: [
    {
      id: 'placement',
      number: '01',
      title: 'Placement & Design Standard',
      description:
        'The standard for placement, color, and design accuracy is set and approved before starting the bulk run.',
      image: '/images/embroidery/qa-process/placement.png',
      imageAlt: 'Embroidery placement and design standard review',
    },
    {
      id: 'consistency',
      number: '02',
      title: 'Stitching Consistency',
      description:
        'Stitching consistency is assessed across all machine heads, along with design finishes, throughout the run.',
      image: '/images/embroidery/qa-process/consistency.jpg',
      imageAlt: 'Stitching consistency check on embroidery machines',
    },
    {
      id: 'panel-check',
      number: '03',
      title: '100% Panel Check',
      description:
        'Every embroidered panel is checked — 100% inspection — before it is sent onward to the production floor.',
      image: '/images/embroidery/qa-process/panel-check.png',
      imageAlt: '100% panel inspection before production floor',
    },
    {
      id: 'defect-management',
      number: '04',
      title: 'Defect Management',
      description:
        'Defects are recorded and classified immediately, with corrective actions implemented for recurring issues.',
      image: '/images/embroidery/qa-process/defect-management.png',
      imageAlt: 'Defect recording and classification at embroidery QA',
    },
  ],
}

/** @deprecated Not used on the current embroidery page design. */
export const embroideryCapacity = {
  badge: 'Capacity',
  title: 'Embroidery capacity at a glance.',
  description:
    'Two dedicated embroidery units and a digital printing line give the group flexible decoration capacity, matched to bulk production schedules.',
  rows: [
    {
      id: 'dgl',
      title: 'DGL Embroidery Unit',
      items: [
        '09 total machines – Barudan and Maya',
        '86 team members',
        '50 million stitches per day capacity',
        'In-house printing, embroidery, and finishing',
      ],
    },
    {
      id: 'globus',
      title: 'Globus Embroidery Ltd.',
      items: [
        '06 total machines',
        '56 team members',
        '350,000 pieces capacity at average 1,000 stitches',
      ],
    },
    {
      id: 'sprintex',
      title: 'Sprintex Enterprise',
      items: [
        'Digital inkjet printing for voile, viscose, twill, and more',
        '936,000 yards yearly production capacity',
        '1 production line, 15 team members',
      ],
    },
  ],
}
