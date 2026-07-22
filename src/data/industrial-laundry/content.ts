import type { CapacityStat } from '../../components/ui/CapacityStatCircles'

export const industrialLaundryHero = {
  titleLines: [[{ text: 'Industrial' }, { text: 'Laundry' }]],
  subtitle:
    'Agami Washing Ltd. delivers industrial garment washing with controlled finish, consistency and scale for global fashion partners.',
  ctaLabel: 'Learn More',
  ctaHref: '#il-innovation',
  video: '/videos/industry%20laundry.mp4',
  videoAlt: 'Industrial laundry facility with large washing machines',
}

export const industrialLaundryExpertise = {
  id: 'il-innovation',
  badge: 'From Wash to Finish',
  title: 'Sustainable washing for premium garment finishes.',
  paragraphs: [
    'Our washing facilities combine innovation, process control, and responsible manufacturing to deliver premium finishes across a wide range of denim and garment applications, while reducing environmental impact through efficient water management.',
  ],
  features: [
    {
      id: 'ozone',
      logo: '/images/industrial-laundry/jeanologia-logo.png',
      logoAlt: 'Jeanologia — The Science of Finishing',
      title: 'OZONE Technology',
      description:
        'Around 70 thousand pieces of denim washing capacity supported by modern laundry setup and technical expertise.',
    },
    {
      id: 'nano-bubble',
      logo: '/images/industrial-laundry/tonello-logo.png',
      logoAlt: 'Tonello — The Inspiring Company',
      title: 'Nano-Bubble Machines',
      description: 'Precision garment treatment using advanced nano-bubble washing technology.',
    },
    {
      id: 'dryers',
      logo: '/images/industrial-laundry/tupesa-logo.png',
      logoAlt: 'Tupesa — Maquinaria Textil',
      title: 'High-Performance Dryers',
      description: 'Fast, consistent and energy-efficient drying at industrial scale.',
    },
  ],
}

/** @deprecated Use industrialLaundryExpertise */
export const industrialLaundryInnovation = industrialLaundryExpertise

export const industrialLaundryWaterStewardship = {
  badge: 'Responsible Water Management',
  titleBefore: 'Water',
  titleAccent: 'Stewardship',
  titleAfter: 'at Scale',
  ctaLabel: 'Download Brochure',
  ctaHref: '/docs/Dekko_ISHO_Group.pdf',
  stats: [
    {
      id: 'etp',
      value: '130 m³/hr',
      label: 'Effluent Treatment Plant',
      variant: 'blue',
    },
    {
      id: 'stp',
      value: '40 m³/hr',
      label: 'Sewage Treatment Plant',
      variant: 'sky',
    },
    {
      id: 'gwt',
      value: '15 m³/hr',
      label: 'Ground Water Treatment',
      variant: 'navy',
    },
    {
      id: 'rainwater',
      value: 'Rainwater Harvesting',
      label: 'Across all units',
      variant: 'white',
    },
    {
      id: 'recycling',
      value: '2%',
      label: 'Water Recycling',
      variant: 'pink',
    },
  ] satisfies CapacityStat[],
}

export const industrialLaundrySpotlight = {
  badge: 'Creative Capability',
  title: 'From idea reference to sample-ready fashion development.',
  description:
    'Agami Washing Ltd, a sister concern of Dekko ISHO Group, started its journey in 2015 at Gazipur. It is a fully compliance and green model factory. The company accomplished all parameters set by Accord and Alliance.',
  image: '/images/industrial-laundry/development-section.png',
  imageAlt: 'Industrial washing machines in a laundry facility',
  imageLabel: 'Design',
}

/** @deprecated Use industrialLaundrySpotlight */
export const industrialLaundryDevelopment = industrialLaundrySpotlight

export const industrialLaundryWashing = {
  badge: 'Process',
  title: 'Industrial washing with controlled finish and repeatability.',
  description:
    'The washing unit supports a wide range of denim and garment treatments through laboratory-led recipe control, technical review and bulk production consistency.',
  rows: [
    {
      id: 'wet',
      title: 'Wet Process',
      items: [
        'Garment Wash',
        'Enzyme Silicon Wash',
        'Stone Enzyme Wash',
        'Dip Bleach, Dip Dye and Cold Dye',
        'Tint Wash and Super Light Wash',
      ],
    },
    {
      id: 'dry',
      title: 'Dry Process',
      items: [
        'Hand Scraping and Hand Whisker',
        'Chevron, Tacking and Tie Effect',
        'Destroy, Crinkle and 3D',
        'PP Rubbing, Resin Spray and PP Spray',
      ],
    },
    {
      id: 'technology',
      title: 'Technology',
      items: [
        'Ozone fading system',
        'Modern front loading machines',
        'Lab-based recipe development',
        'High-tech dryer and sample machine support',
      ],
    },
  ],
}

export const industrialLaundryQuality = {
  badge: 'Washing QA Process',
  title: 'Quality control from sorting to final dispatch.',
  description:
    'The QA process fits naturally after the wet and dry process section because it explains how each wash output is checked, reviewed, tested, and approved before garments move to dispatch.',
  items: [
    {
      id: 'sorting',
      number: '01',
      title: 'Before wash Inspection & sorting',
      description:
        'Inspect garments for conformity to specifications (stitching, cleanliness & appearance). Random inspection of critical spec points, before processing.',
      image: '/images/industrial-laundry/quality/01-sorting.png',
      imageAlt: 'Before wash inspection and sorting on the factory floor',
    },
    {
      id: 'bulk-review',
      number: '02',
      title: 'First Bulk wash Review',
      description:
        'Color wise review of first output garments for conformity to fine tune the bulk recipe. Having Pre-Production Meeting to discuss technical points for consistency in bulk.',
      image: '/images/industrial-laundry/quality/02-bulk-review.png',
      imageAlt: 'First bulk wash review at inspection tables',
    },
    {
      id: 'in-process',
      number: '03',
      title: 'In-Process Inspection & Testing',
      description:
        'Evaluate the shade consistency, dry process effects etc., (if applicable).',
      image: '/images/industrial-laundry/quality/03-in-process.png',
      imageAlt: 'In-process quality inspection and testing area',
    },
    {
      id: 'final',
      number: '04',
      title: 'Final Inspection / Audit prior to dispatch',
      description:
        'Ensure garments are inspected / audited (AQL 1.5 std) for wash standards.',
      image: '/images/industrial-laundry/quality/04-final-inspection.png',
      imageAlt: 'Final inspection area with industrial washing machines',
    },
  ],
}

export const industrialLaundryCta = {
  badge: "Let's Connect",
  heading: "And build what's next, together",
  description:
    'Get in touch with our team for partnership, sourcing, careers or general inquiries. We will get back to you with answers.',
  buttonLabel: 'Schedule consultation',
  buttonHref: '/contact',
}
