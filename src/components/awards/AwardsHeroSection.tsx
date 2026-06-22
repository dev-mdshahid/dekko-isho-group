import { awardsHeroSubtitle } from '../../data/awards/certifications'
import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function AwardsHeroSection() {
  return (
    <section className="hero-simple-section awards-hero-section">
      <div className="container-medium">
        <div className="hero-simple-wrap">
          <FadeIn id="awards-hero-title">
            <h1 className="hero-inner-title">Awards &amp; certifications</h1>
          </FadeIn>
          <FadeIn id="awards-hero-subtitle" delay={80}>
            <p className="awards-hero-description">{awardsHeroSubtitle}</p>
          </FadeIn>
        </div>
      </div>
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
