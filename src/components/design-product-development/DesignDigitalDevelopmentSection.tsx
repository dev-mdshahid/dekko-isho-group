import { designProductDevelopmentDigital } from '../../data/design-product-development/content'
import { SplitFeatureListSection } from '../ui/SplitFeatureListSection'

export function DesignDigitalDevelopmentSection() {
  return (
    <SplitFeatureListSection
      className="dpd-digital-section"
      {...designProductDevelopmentDigital}
    />
  )
}
