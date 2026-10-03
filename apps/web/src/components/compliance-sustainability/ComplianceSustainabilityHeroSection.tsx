import { complianceSustainabilityHero } from '../../data/compliance-sustainability/content'
import { SolutionPageHeroSection } from '../solutions/SolutionPageHeroSection'

export function ComplianceSustainabilityHeroSection() {
  return (
    <SolutionPageHeroSection
      idPrefix="cs"
      className="cs-hero-section"
      {...complianceSustainabilityHero}
    />
  )
}
