export const embroideryHero = {
  titleLines: [[{ text: 'Embroidery' }]],
  subtitle: 'PRECISION IN EVERY STITCH.',
  ctaLabel: 'OUR WORK',
  ctaHref: '#embroidery-expertise',
  video: '/images/embroidery/embroidery-hero.mp4',
  videoAlt: 'Industrial embroidery machine stitching a floral pattern on fabric',
}

export const embroideryExpertise = {
  id: 'embroidery-expertise',
  badge: 'OUR EXPERTISE',
  title: 'Crafting Excellence in Every Thread',
  paragraphs: [
    'Backed by 70 years of manufacturing experience, Dekko Isho delivers exceptional embroidery solutions using high-speed industrial machinery. Our state-of-the-art facilities offer a comprehensive range of decorative and functional embroidery services for various product categories.',
  ],
  cardMedia: 'photo' as const,
  features: [
    {
      id: 'barudan',
      logo: '/images/embroidery/barudan.png',
      logoAlt: 'Barudan multi-head embroidery machines',
      title: 'Barudan',
      description: 'The ultimate precision embroidery machine.',
    },
    {
      id: 'maya',
      logo: '/images/embroidery/maya.png',
      logoAlt: 'MAYA dual-head embroidery machine',
      title: 'MAYA',
      description: 'Precision, Performance, and Excellence.',
    },
    {
      id: 'in-house',
      logo: '/images/embroidery/in-house.jpg',
      logoAlt: 'In-house embroidery production line',
      title: 'In-House',
      description: 'Printing Capacity: 0.5 Million.',
    },
  ],
}

export const embroideryProductionNetwork = {
  badge: 'OUR NETWORK',
  title: 'Production Network',
  description: 'We operate within a strong, sustainable network for all your needs.',
  units: [
    {
      id: 'dgl',
      title: 'DGL Embroidery Unit',
      image: '/images/embroidery/dgl-embroidery-unit.png',
      imageAlt: 'Garments on hangers at the DGL Embroidery Unit',
    },
    {
      id: 'globus',
      title: 'Globus Embroidery',
      image: '/images/embroidery/globus-embroidery.png',
      imageAlt: 'Finished embroidered garments at Globus Embroidery',
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
