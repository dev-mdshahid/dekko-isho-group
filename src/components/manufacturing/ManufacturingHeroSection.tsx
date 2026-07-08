import { manufacturingExpertise, manufacturingHero } from '../../data/manufacturing/content'
import {
  SolutionExpertiseSection,
  SolutionVideoHeroSection,
} from '../solutions'

const ID_PREFIX = 'mfg'

export function ManufacturingHeroSection() {
  return (
    <section className="service-details-section section-spacing-top solution-hero-section mfg-hero-section">
      <SolutionVideoHeroSection idPrefix={ID_PREFIX} {...manufacturingHero} />
      <SolutionExpertiseSection idPrefix={ID_PREFIX} {...manufacturingExpertise} />
    </section>
  )
}
