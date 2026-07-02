import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'
import { CompanyLogosSection } from './CompanyLogosSection'
import { HeroTypewriterTitle } from './HeroTypewriterTitle'
import { HeroVideo } from './HeroVideo'

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-inner">
        <div className="container-full hero-title-area">
          <HeroTypewriterTitle />
        </div>

        <div className="hero-bottom">
          <div className="container-full">
            <div className="hero-tagline" data-home-animate="hero-tagline">
              <span
                className="hero-tagline-line"
                data-home-animate="hero-tagline-line"
                aria-hidden="true"
              />
              <p className="hero-tagline-text" data-home-animate="hero-tagline-text">
                Born in Bangladesh. Trusted Worldwide
              </p>
              <span
                className="hero-tagline-line"
                data-home-animate="hero-tagline-line"
                aria-hidden="true"
              />
            </div>
          </div>
          <div data-home-animate="hero-logos">
            <CompanyLogosSection />
          </div>
        </div>
      </div>

      <HeroVideo />

      <div className="hero-section-overlay" aria-hidden="true" />
      <SectionLines />
      <NoiseOverlay />
    </section>
  )
}
