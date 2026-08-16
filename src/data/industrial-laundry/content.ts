import type { CapacityStat } from '../../components/ui/CapacityStatCircles'

export const industrialLaundryHero = {
  titleLines: [[{ text: 'Washing' }]],
  subtitle:
    'Our washing facility delivers a comprehensive range of garment finishing solutions tailored to diverse fabrics, fashion trends, and customer requirements – from garment and enzyme washes to specialized denim treatments and dyeing.',
  ctaLabel: 'Learn More',
  ctaHref: '#il-washing-processes',
  video: '/videos/industrial-laundry-hero.mp4',
  videoAlt: 'Industrial laundry facility with large washing machines',
}

const INDUSTRIAL_LAUNDRY_IMAGE_BASE = '/images/industrial-laundry'

export const industrialLaundryWashingProcesses = {
  id: 'il-washing-processes',
  badge: 'Comprehensive Washing Capabilities',
  title: 'Core Washing Processes',
  description:
    'Our washing facility delivers a comprehensive range of garment finishing solutions tailored to diverse fabrics, fashion trends, and customer requirements. From garment and enzyme washes to specialized denim treatments and dyeing, we ensure consistent quality, repeatable results, and production flexibility across every order.',
  items: [
    {
      id: 'garment-wash',
      title: 'Garment Wash',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/garment-wash.png`,
      imageAlt: 'Blue denim garments in a laundry basket',
    },
    {
      id: 'enzyme-wash',
      title: 'Enzyme Wash',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/enzyme-wash.png`,
      imageAlt: 'Stacked denim jeans in varied enzyme wash finishes',
    },
    {
      id: 'dark-wash',
      title: 'Dark Wash',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/dark-wash.png`,
      imageAlt: 'Stack of dark wash denim garments',
    },
    {
      id: 'mid-wash',
      title: 'Mid Wash',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/mid-wash.png`,
      imageAlt: 'Mid wash denim jeans',
    },
    {
      id: 'light-wash',
      title: 'Light Wash',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/light-wash.png`,
      imageAlt: 'Light wash denim jeans with product tag',
    },
    {
      id: 'dyeing',
      title: 'Dyeing',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/dyeing.png`,
      imageAlt: 'Folded garments in assorted dyed colors',
    },
  ],
}

export const industrialLaundryAdvancedFinishing = {
  id: 'il-advanced-finishing',
  badge: 'Comprehensive Washing Capabilities',
  title: 'Advanced Finishing Capabilities',
  description:
    'Our integrated finishing facility combines advanced technologies with skilled craftsmanship to create distinctive fashion effects and premium garment finishes. Dedicated process areas and specialized equipment ensure precision, efficiency, and consistency across every production run.',
  items: [
    {
      id: 'advanced-washing',
      title: 'Advanced Washing',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/advanced-washing.png`,
      imageAlt: 'Industrial advanced washing machines in finishing facility',
    },
    {
      id: 'dry-process',
      title: 'Dry Process',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/dry-process-operators.png`,
      imageAlt: 'Operators performing dry process finishing work',
    },
    {
      id: 'hand-scraping-destroy',
      title: 'Hand Scraping & Destroy',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/hand-scraping-destroy.png`,
      imageAlt: 'Worker applying hand scraping and destroy effects',
    },
    {
      id: 'laser-finishing',
      title: 'Laser Finishing',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/laser-finishing.png`,
      imageAlt: 'Laser finishing process on denim fabric',
    },
    {
      id: 'conveyor-dryers',
      title: 'Conveyor Dryers',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/conveyor-dryers.png`,
      imageAlt: 'Garments moving through conveyor dryer line',
    },
    {
      id: 'sanforizing',
      title: 'Sanforizing',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/sanforizing.jpg`,
      imageAlt: 'Sanforizing process area in laundry facility',
    },
  ],
}

export const industrialLaundryExpertise = {
  id: 'il-innovation',
  badge: 'Our Approach to Wash',
  title: 'Sustainable Washing for Premium Garment Finishes.',
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
  badge: 'Monthly Capacity',
  title: 'Production Capacity at Scale',
  titleBefore: 'Production',
  titleAccent: 'Capacity',
  titleAfter: 'at Scale',
  description:
    'Designed for high-volume manufacturing, our facility combines advanced machinery, experienced professionals, and efficient production planning to deliver consistent quality while meeting demanding production timelines.',
  keyMetrics: [
    {
      id: 'higg-fem',
      label: 'Higg FEM Score',
      value: '71%',
    },
    {
      id: 'gateway-compliance',
      label: 'Gateway Compliance',
      value: '100% ZDHC Level 3',
    },
  ],
  ctaLabel: 'Download Brochure',
  ctaHref: '/docs/Dekko_ISHO_Group.pdf',
  stats: [
    {
      id: 'total-capacity',
      value: '3.5 Million',
      label: 'Total Capacity (Pcs)',
      variant: 'blue',
    },
    {
      id: 'advanced-washing-machines',
      value: '28',
      label: 'Advanced Washing Machines',
      variant: 'sky',
    },
    {
      id: 'skilled-professionals',
      value: '800+',
      label: 'Skilled Professionals',
      variant: 'pink',
    },
  ] satisfies CapacityStat[],
}

export const industrialLaundryResearchDevelopment = {
  id: 'il-research-development',
  badge: 'Technical Development',
  title: 'Research & Development',
  description:
    'Our dedicated R&D team continuously develops and refines wash recipes, explores innovative finishing techniques, and optimizes production processes to meet evolving customer requirements and fashion trends.',
  items: [
    {
      id: 'wash-recipe',
      title: 'Wash Recipe Development',
      description: 'Innovative wash formulas crafted for consistent quality and vibrant finishes.',
    },
    {
      id: 'sample-development',
      title: 'Sample Development',
      description: '3D sample previews speed up design approvals and reduce physical samples.',
    },
    {
      id: 'process-optimization',
      title: 'Process Optimization',
      description: 'Streamlined processes to enhance efficiency and reduce production time.',
    },
  ],
}

export const industrialLaundryLaboratory = {
  id: 'il-laboratory',
  title: 'Modern Washing Laboratory',
  description:
    'Our modern washing laboratory supports every stage of product development through comprehensive testing and validation. From color consistency to fabric performance, every wash recipe is evaluated before transitioning to bulk production.',
  image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/modern-washing-laboratory.png`,
  imageAlt: 'Technician inspecting fabric samples in a light-controlled washing laboratory',
  items: [
    {
      id: 'shade-color',
      number: '01',
      accent: '#F3215D',
      title: 'Shade & Color Matching',
      description: 'Color consistency verified against approved standards before bulk.',
    },
    {
      id: 'performance',
      number: '02',
      accent: '#449BFF',
      title: 'Performance Testing',
      description: 'Fabric performance evaluated across every wash recipe.',
    },
    {
      id: 'shrinkage',
      number: '03',
      accent: '#14B253',
      title: 'Shrinkage Testing',
      description: 'Dimensional stability confirmed before production transition.',
    },
  ],
}

export const industrialLaundryQualityAssurance = {
  id: 'il-quality-assurance',
  badge: 'Technical Development',
  title: 'Quality Assurance',
  description:
    'Quality assurance is embedded throughout our washing operations, from garment receiving to final inspection. Through rigorous process controls and systematic quality checks, we ensure every garment consistently meets customer specifications and international quality standards.',
  highlightTitle: '100% QC Inspection Process',
  highlightDetail: 'In-Process Quality Control • Final Inspection',
  image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/quality-assurance.jpg`,
  imageAlt: 'Quality control team inspecting garments in a laboratory',
}

export const industrialLaundrySustainableTech = {
  id: 'il-sustainable-tech',
  title: 'Sustainable Washing Technologies',
  description:
    'We integrate advanced washing technologies that improve operational efficiency while reducing water, energy, and chemical consumption. By adopting innovative processes, we deliver premium garment finishes with a lower environmental footprint.',
  items: [
    {
      id: 'eflow',
      number: '01',
      title: 'eFlow Technology',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/tech-eflow.png`,
      imageAlt: 'Jeanologia e-Flow K Lab washing technology equipment',
    },
    {
      id: 'ozone',
      number: '02',
      title: 'Ozone Processing',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/ozone-processing.png`,
      imageAlt: 'Jeanologia G2 ozone processing machines',
    },
    {
      id: 'conveyor-dryers',
      number: '03',
      title: 'Conveyor Dryers',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/tech-conveyor-dryers.png`,
      imageAlt: 'Garments moving through an industrial conveyor dryer line',
    },
  ],
}

export const industrialLaundryEnvironmentalManagement = {
  id: 'il-environmental-management',
  badge: 'Responsible Manufacturing',
  title: 'Environmental & Chemical Management',
  description:
    'Our commitment to chemical stewardship and environmental management ensures responsible operations across every washing process — from safe chemical handling to advanced water treatment and efficiency systems.',
  items: [
    {
      id: 'chemical-stewardship',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/env-chemical-stewardship.png`,
      imageAlt: 'Laboratory jar testing setup with chemical solutions',
      title: 'Chemical Stewardship',
      description:
        'Ensures responsible sourcing, handling, and disposal of all chemicals used in our washing processes, prioritizing safety and environmental sustainability.',
    },
    {
      id: 'effluent-treatment',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/env-effluent-treatment.png`,
      imageAlt: 'Effluent treatment bio-tower aeration tank',
      title: 'Effluent Treatment Plant',
      description:
        'Effectively treats wastewater generated during washing operations, removing contaminants to meet stringent environmental regulations before safe discharge or reuse.',
    },
    {
      id: 'sewage-treatment',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/env-sewage-treatment.png`,
      imageAlt: 'Sewage treatment plant tanks and chemical dosing systems',
      title: 'Sewage Treatment Plant (STP)',
      description:
        'Processes all domestic wastewater on-site, ensuring hygienic and eco-friendly treatment to minimize environmental impact and comply with local standards.',
    },
    {
      id: 'water-efficiency',
      image: `${INDUSTRIAL_LAUNDRY_IMAGE_BASE}/water-efficiency.jpg`,
      imageAlt: 'Industrial water pumps and piping for water efficiency systems',
      title: 'Water Efficiency',
      description:
        'Advanced water efficiency measures, including recycling and optimized usage, to significantly reduce water consumption while maintaining high-quality garment finishes.',
    },
  ],
}

export const industrialLaundryProductionNetwork = {
  badge: 'Our Footprint',
  title: 'Production Network',
  description:
    'We operate state-of-the-art washing facilities with capacity, product mix, and compliance standards.',
  units: [
    {
      id: 'agami-washing',
      title: 'Agami Washing Ltd.',
      image: '/images/industrial-laundry/agami-washing-production-network.jpg',
      imageAlt: 'Industrial washing machine at Agami Washing Ltd.',
    },
  ],
}

export const industrialLaundryWhyItMatters = {
  title: 'Why It Matters',
  description:
    'Advanced washing technology paired with responsible water management delivers premium garment finishes while continuously improving resource efficiency and environmental performance.',
  items: [
    {
      id: 'finishes',
      title: 'Premium Garment Finishes',
      description: 'Exceptional quality and durability for every garment.',
    },
    {
      id: 'efficiency',
      title: 'Improved Resource Efficiency',
      description: 'Optimized processes that reduce water and energy consumption.',
    },
    {
      id: 'environment',
      title: 'Improved Environmental Performance',
      description: 'Commitment to environmentally friendly manufacturing processes.',
    },
  ],
}

export const industrialLaundryCta = {
  badge: "Let's Connect",
  heading: "And Build What's Next, Together",
  description:
    'Get in touch with our team for partnership, sourcing, careers or upcoming projects. We will be back to you with solutions.',
  buttonLabel: 'Contact us now',
  buttonHref: '/contact',
}

/** @deprecated Not used on the current laundry page design. */
export const industrialLaundrySpotlight = {
  badge: 'Creative Capability',
  title: 'From Idea Reference to Sample-Ready Fashion Development.',
  description:
    'Agami Washing Ltd, a sister concern of Dekko ISHO Group, started its journey in 2015 at Gazipur. It is a fully compliance and green model factory. The company accomplished all parameters set by Accord and Alliance.',
  image: '/images/industrial-laundry/development-section.png',
  imageAlt: 'Industrial washing machines in a laundry facility',
  imageLabel: 'Design',
}

/** @deprecated Use industrialLaundrySpotlight */
export const industrialLaundryDevelopment = industrialLaundrySpotlight

/** @deprecated Not used on the current laundry page design. */
export const industrialLaundryWashing = {
  badge: 'Process',
  title: 'Industrial Washing with Controlled Finish and Repeatability.',
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

/** @deprecated Not used on the current laundry page design. */
export const industrialLaundryQuality = {
  badge: 'Washing QA Process',
  title: 'Quality Control from Sorting to Final Dispatch.',
  description:
    'The QA process fits naturally after the wet and dry process section because it explains how each wash output is checked, reviewed, tested, and approved before garments move to dispatch.',
  items: [
    {
      id: 'sorting',
      number: '01',
      title: 'Before Wash Inspection & Sorting',
      description:
        'Inspect garments for conformity to specifications (stitching, cleanliness & appearance). Random inspection of critical spec points, before processing.',
      image: '/images/industrial-laundry/quality/01-sorting.png',
      imageAlt: 'Before wash inspection and sorting on the factory floor',
    },
    {
      id: 'bulk-review',
      number: '02',
      title: 'First Bulk Wash Review',
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
      title: 'Final Inspection / Audit Prior to Dispatch',
      description:
        'Ensure garments are inspected / audited (AQL 1.5 std) for wash standards.',
      image: '/images/industrial-laundry/quality/04-final-inspection.png',
      imageAlt: 'Final inspection area with industrial washing machines',
    },
  ],
}
