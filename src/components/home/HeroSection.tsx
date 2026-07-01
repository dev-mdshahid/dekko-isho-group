import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'
import { CompanyLogosSection } from './CompanyLogosSection'
import { HeroVideo } from './HeroVideo'

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-inner">
        <div className="container-full hero-title-area">
          <h1 className="hero-title" data-home-animate="hero-title">
            <span className="hero-title-line-mask">
              <span className="hero-title-line" data-home-animate="hero-line">
                Elevating{' '}
                <span
                  className="hero-title-word hero-title-accent hero-title-accent--primary"
                  data-home-animate="hero-word"
                >
                  Excellence
                </span>
              </span>
            </span>
            <span className="hero-title-line-mask hero-title-line-mask--inline">
              <span className="hero-title-line" data-home-animate="hero-line">
                Through{' '}
                <span
                  className="hero-title-word hero-title-accent hero-title-accent--green"
                  data-home-animate="hero-word"
                >
                  Sustainable
                </span>
              </span>
              <span className="hero-title-caret" aria-hidden="true" />
            </span>
            <span className="hero-title-line-mask hero-title-line-mask--inline">
              <span className="hero-title-line" data-home-animate="hero-line">
                <span
                  className="hero-title-word hero-title-accent hero-title-accent--red"
                  data-home-animate="hero-word"
                >
                  Progress
                </span>
              </span>
            </span>
          </h1>
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
