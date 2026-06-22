import { sustainabilityHero } from '../../data/sustainability/content'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function SustainabilityHeroSection() {
  return (
    <section className="hero-simple-section sustain-hero-section">
      <div className="container-medium">
        <div className="hero-simple-wrap sustain-hero-wrap">
          <FadeIn id="sustain-hero-title">
            <h1 className="hero-inner-title sustain-hero-title">{sustainabilityHero.title}</h1>
          </FadeIn>
          <FadeIn id="sustain-hero-description" delay={80}>
            <p className="sustain-hero-description">{sustainabilityHero.description}</p>
          </FadeIn>
          <FadeIn id="sustain-hero-cta" delay={120}>
            <ButtonArrow to={sustainabilityHero.ctaHref} label={sustainabilityHero.ctaLabel} />
          </FadeIn>
        </div>
      </div>
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
