import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'
import { CompanyLogosSection } from './CompanyLogosSection'

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-inner">
        <div className="container-full hero-title-area">
          <h1 className="hero-title">
            <span className="hero-title-line">
              Elevating <span className="hero-title-accent hero-title-accent--primary">Excellence</span>
            </span>
            <span className="hero-title-line">
              Through{' '}
              <span className="hero-title-accent hero-title-accent--green">Sustainable</span>{' '}
              <span className="hero-title-accent hero-title-accent--red">Progress</span>
            </span>
          </h1>
        </div>

        <div className="hero-bottom">
          <div className="container-full">
            <div className="hero-tagline">
              <span className="hero-tagline-line" aria-hidden="true" />
              <p className="hero-tagline-text">Born in Bangladesh. Trusted Worldwide</p>
              <span className="hero-tagline-line" aria-hidden="true" />
            </div>
          </div>
          <CompanyLogosSection />
        </div>
      </div>

      <div className="hero-section-overlay" aria-hidden="true" />
      <SectionLines />
      <NoiseOverlay />
    </section>
  )
}
