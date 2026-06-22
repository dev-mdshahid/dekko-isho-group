import type { IndustryFeaturesProps } from '../../components/industry'
import { industryFeatureIcons } from './industryFeatureIcons'

export const dekkoFashionsFeatures: IndustryFeaturesProps = {
  badge: 'Fashion Manufacturing Partner',
  title: 'Fashion-led apparel manufacturing for modern global brands.',
  description:
    'Dekko Fashions Ltd. supports international buyers with export-ready woven apparel manufacturing, design-aware production, and quality-focused execution for fashion collections that demand precision and consistency. From fabric coordination and technical preparation to cutting, sewing, finishing, inspection, and shipment readiness, Dekko Fashions Ltd. delivers reliable manufacturing support for trend-driven apparel programs.',
  features: [
    {
      id: 'woven',
      icon: industryFeatureIcons.woven,
      title: 'Woven Apparel Expertise',
      description:
        'Specialized manufacturing support for woven fashion products with attention to fit, construction, and finishing details.',
    },
    {
      id: 'design-production',
      icon: industryFeatureIcons.designProduction,
      title: 'Design-to-Production Support',
      description:
        'Technical interpretation and production preparation that help transform fashion direction into scalable garment execution.',
    },
    {
      id: 'quality',
      icon: industryFeatureIcons.shieldCheck,
      title: 'Quality-Focused Execution',
      description:
        'Controlled production, workmanship consistency, and inspection discipline support export-ready apparel quality.',
    },
  ],
}
