import { careerWorkplace } from '../../data/career/content'
import { SplitContentSection } from '../ui/SplitContentSection'

export function CareerWorkplaceSection() {
  return (
    <SplitContentSection
      className="career-workplace-section"
      {...careerWorkplace}
    />
  )
}
