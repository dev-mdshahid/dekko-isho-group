import { designProductDevelopmentJourney } from '../../data/design-product-development/content'
import { JourneyRoadmapSection } from '../ui/JourneyRoadmapSection'

export function DesignJourneySection() {
  return (
    <JourneyRoadmapSection
      classPrefix="dpd-journey"
      columnCount={5}
      xPadLeft={54}
      xPadRight={90}
      curveOffset={0}
      {...designProductDevelopmentJourney}
    />
  )
}
