import { manufacturingJourney } from '../../data/manufacturing/content'
import { JourneyRoadmapSection } from '../ui/JourneyRoadmapSection'

export function ManufacturingJourneySection() {
  return (
    <JourneyRoadmapSection
      classPrefix="mfg-journey"
      columnCount={6}
      xPadLeft={36}
      xPadRight={100}
      {...manufacturingJourney}
    />
  )
}
