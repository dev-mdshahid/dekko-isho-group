import { designProductDevelopmentStudio } from '../../data/design-product-development/content'
import { SplitContentSection } from '../ui/SplitContentSection'

export function DesignStudioSection() {
  return (
    <SplitContentSection
      className="dpd-studio-section"
      {...designProductDevelopmentStudio}
    />
  )
}
