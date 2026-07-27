import { designProductDevelopmentJourney } from '../../data/design-product-development/content'
import { JourneyRoadmapSection } from '../ui/JourneyRoadmapSection'

export function DesignJourneySection() {
  return (
    <JourneyRoadmapSection
      classPrefix="dpd-journey"
      columnCount={5}
      {...designProductDevelopmentJourney}
    />
  )
}
