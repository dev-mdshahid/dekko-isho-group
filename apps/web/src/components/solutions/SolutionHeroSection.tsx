import type { Solution } from '../../data/solutions/solutions'
import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

type SolutionHeroSectionProps = {
  solution: Solution
}

export function SolutionHeroSection({ solution }: SolutionHeroSectionProps) {
  return (
    <section className="hero-simple-section">
      <div className="container-medium">
        <div className="hero-simple-wrap">
          <FadeIn id={`solution-hero-${solution.slug}`}>
            <h1 className="hero-inner-title">{solution.title}</h1>
          </FadeIn>
          <FadeIn id={`solution-hero-desc-${solution.slug}`} delay={80}>
            <p className="hero-inner-description">{solution.description}</p>
          </FadeIn>
        </div>
      </div>
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
