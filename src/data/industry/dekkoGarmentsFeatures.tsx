import type { IndustryFeaturesProps } from '../../components/industry'
import { industryFeatureIcons } from './industryFeatureIcons'

export const dekkoGarmentsFeatures: IndustryFeaturesProps = {
  badge: 'One-Stop Apparel Partner',
  title: 'Sustainable apparel manufacturing for global fashion brands.',
  description:
    'Dekko Garments Ltd. supports international fashion brands with export-ready apparel manufacturing, sustainable production practices, reliable sourcing, and quality-focused execution across the full apparel development journey. From fabric sourcing and technical development to cutting, sewing, finishing, quality control, and shipment readiness, Dekko Garments Ltd. delivers dependable manufacturing solutions for growing apparel businesses.',
  features: [
    {
      id: 'sustainable',
      icon: industryFeatureIcons.tshirt,
      title: 'Sustainable Apparel Manufacturing',
      description:
        'Responsible production practices and organic, sustainable, and production-ready apparel solutions.',
    },
    {
      id: 'quality',
      icon: industryFeatureIcons.diamond,
      title: 'Quality Apparel Manufacturer',
      description:
        'A quality-first manufacturing approach focused on workmanship, consistency, and buyer-approved standards.',
    },
    {
      id: 'fashion-forward',
      icon: industryFeatureIcons.dress,
      title: 'Fashion-Forward Apparel Manufacturer',
      description:
        'Customer-focused apparel production support for modern fashion brands and evolving market needs.',
    },
  ],
}
