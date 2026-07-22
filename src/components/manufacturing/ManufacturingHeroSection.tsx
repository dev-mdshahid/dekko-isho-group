import { manufacturingHero } from '../../data/manufacturing/content'
import { SolutionPageHeroSection } from '../solutions/SolutionPageHeroSection'

export function ManufacturingHeroSection() {
  return <SolutionPageHeroSection idPrefix="mfg" className="mfg-hero-section" {...manufacturingHero} />
}
