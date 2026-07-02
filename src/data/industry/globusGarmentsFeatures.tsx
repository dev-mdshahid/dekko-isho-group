import type { IndustryFeaturesProps } from '../../components/industry'
import { industryFeatureIcons } from './industryFeatureIcons'

export const globusGarmentsFeatures: IndustryFeaturesProps = {
  badge: 'Export Apparel Partner',
  title: 'Scalable apparel manufacturing for dependable global supply.',
  description:
    'Globus Garments Ltd. supports international apparel buyers with export-oriented manufacturing, coordinated production planning, and reliable garment execution across the full apparel supply journey. From material preparation and technical alignment to cutting, sewing, finishing, inspection, and shipment readiness, Globus Garments Ltd. delivers consistent quality, production discipline, and dependable delivery performance.',
  features: [
    {
      id: 'scalable',
      icon: industryFeatureIcons.factory,
      title: 'Scalable Manufacturing',
      description:
        'Structured apparel production capability designed to support buyer requirements and volume-based programs.',
    },
    {
      id: 'process',
      icon: industryFeatureIcons.processGrid,
      title: 'Process-Driven Execution',
      description:
        'Controlled workflows across preparation, sewing, finishing, and inspection help maintain production consistency.',
    },
    {
      id: 'quality',
      icon: industryFeatureIcons.shieldCheck,
      title: 'Reliable Quality Performance',
      description:
        'Quality-focused checks and disciplined factory operations support export-ready garments and on-time delivery.',
    },
  ],
}
