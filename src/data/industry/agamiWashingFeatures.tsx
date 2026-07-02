import type { IndustryFeaturesProps } from '../../components/industry'
import { industryFeatureIcons } from './industryFeatureIcons'

export const agamiWashingFeatures: IndustryFeaturesProps = {
  badge: 'Industrial Laundry Partner',
  title: 'Advanced garment washing and finishing for fashion-ready apparel.',
  description:
    'Agami Washing Ltd. supports Dekko ISHO Group\u2019s apparel ecosystem with modern industrial laundry capability, denim washing, garment finishing, and value-added wash effects for export-ready fashion products. With advanced laboratory support, OZONE fading technology, nano bubble technology, wet process, dry process, and quality-controlled bulk wash review, Agami Washing Ltd. delivers consistent shade, finish, appearance, and dispatch-ready wash quality.',
  features: [
    {
      id: 'washing',
      icon: industryFeatureIcons.washing,
      title: 'Advanced Washing Capability',
      description:
        'Modern wet and dry wash processes support denim, garment wash, enzyme wash, dip dye, PP spray, resin spray, and 3D effects.',
    },
    {
      id: 'lab',
      icon: industryFeatureIcons.lab,
      title: 'Lab-Led Recipe Control',
      description:
        'Technical experts and laboratory machines help develop, review, and fine-tune wash recipes before bulk production.',
    },
    {
      id: 'quality',
      icon: industryFeatureIcons.shieldCheck,
      title: 'Wash Quality Assurance',
      description:
        'Before wash inspection, first bulk review, in-process testing, and final audit ensure consistent wash standards.',
    },
  ],
}
