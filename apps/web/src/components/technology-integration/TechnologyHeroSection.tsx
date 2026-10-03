import { technologyIntegrationHero } from '../../data/technology-integration/content'
import { SolutionPageHeroSection } from '../solutions/SolutionPageHeroSection'

export function TechnologyHeroSection() {
  return (
    <SolutionPageHeroSection idPrefix="ti" className="ti-hero-section" {...technologyIntegrationHero} />
  )
}
