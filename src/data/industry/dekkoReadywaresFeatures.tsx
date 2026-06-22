import type { IndustryFeaturesProps } from '../../components/industry'
import { industryFeatureIcons } from './industryFeatureIcons'

export const dekkoReadywaresFeatures: IndustryFeaturesProps = {
  badge: 'One-Stop Apparel Partner',
  title: 'Reliable apparel manufacturing for global fashion brands.',
  description:
    'Dekko Readywears Ltd. supports international apparel buyers with structured manufacturing, dependable production planning, and export-ready garment solutions across the apparel development journey. From sourcing and technical preparation to cutting, sewing, finishing, inspection, and shipment readiness, Dekko Readywears Ltd. delivers consistent quality, scalable capacity, and reliable on-time execution.',
  features: [
    {
      id: 'export',
      icon: industryFeatureIcons.airplane,
      title: 'Export-Oriented Manufacturing',
      description:
        'Structured apparel production built for global buyers, reliable execution, and shipment-ready garment programs.',
    },
    {
      id: 'quality',
      icon: industryFeatureIcons.diamond,
      title: 'Quality-Driven Production',
      description:
        'Consistent workmanship, measurement accuracy, and buyer-approved standards across every production stage.',
    },
    {
      id: 'agile',
      icon: industryFeatureIcons.document,
      title: 'Agile Order Execution',
      description:
        'Efficient planning and coordinated factory operations support faster cycles and dependable delivery timelines.',
    },
  ],
}
