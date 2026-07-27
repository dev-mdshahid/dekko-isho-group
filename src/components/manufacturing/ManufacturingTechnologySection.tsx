import { manufacturingTechnology } from '../../data/manufacturing/content'
import { SplitFeatureListSection } from '../ui/SplitFeatureListSection'

export function ManufacturingTechnologySection() {
  return (
    <SplitFeatureListSection
      className="mfg-technology-section"
      {...manufacturingTechnology}
    />
  )
}
