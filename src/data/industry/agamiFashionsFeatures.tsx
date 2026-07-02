import type { IndustryFeaturesProps } from '../../components/industry'
import { industryFeatureIcons } from './industryFeatureIcons'

export const agamiFashionsFeatures: IndustryFeaturesProps = {
  badge: 'Integrated Apparel Partner',
  title: 'Agile apparel manufacturing with integrated washing support.',
  description:
    'Agami Fashions Ltd. supports global apparel buyers with export-ready manufacturing, flexible production execution, and strong coordination across garment development, production, finishing, and quality control. With integrated support from Agami Washing Ltd., the unit strengthens value-added garment finishing, denim wash capability, inspection discipline, and shipment readiness for fashion programs that require speed, consistency, and reliable delivery.',
  features: [
    {
      id: 'export',
      icon: industryFeatureIcons.airplane,
      title: 'Export-Ready Apparel Production',
      description:
        'Structured garment manufacturing focused on buyer requirements, production consistency, and scalable execution.',
    },
    {
      id: 'washing',
      icon: industryFeatureIcons.washing,
      title: 'Integrated Washing Support',
      description:
        'Connected washing and finishing capability supports denim, garment treatments, and value-added product effects.',
    },
    {
      id: 'quality',
      icon: industryFeatureIcons.shieldCheck,
      title: 'Quality & Delivery Discipline',
      description:
        'Controlled production, inspection checkpoints, and coordinated dispatch planning help ensure quality and on-time delivery.',
    },
  ],
}
