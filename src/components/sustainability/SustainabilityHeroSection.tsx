import { sustainabilityHero } from '../../data/sustainability/content'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function SustainabilityHeroSection() {
  return (
    <section className="hero-simple-section sustain-hero-section">
      <div className="container-full sustain-hero-container">
        <div className="hero-simple-wrap sustain-hero-wrap">
          <FadeIn id="sustain-hero-title">
            <h1 className="hero-inner-title sustain-hero-title">
              {sustainabilityHero.titleParts.map((part, index) => (
                <span key={part.text}>
                  <span className={`sustain-hero-title-accent sustain-hero-title-accent--${part.tone}`}>
                    {part.text}
                  </span>
                  {index < sustainabilityHero.titleParts.length - 1 ? ' ' : null}
                </span>
              ))}
            </h1>
          </FadeIn>
          <FadeIn id="sustain-hero-description" delay={80} className="sustain-hero-description-wrap">
            <p className="sustain-hero-description">{sustainabilityHero.description}</p>
          </FadeIn>
          <FadeIn id="sustain-hero-cta" delay={120}>
            <ButtonArrow to={sustainabilityHero.ctaHref} label={sustainabilityHero.ctaLabel} />
          </FadeIn>
        </div>
      </div>
      <div className="hero-section-overlay" aria-hidden="true" />
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
