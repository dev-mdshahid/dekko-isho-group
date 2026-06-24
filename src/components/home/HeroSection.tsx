import { ButtonArrow } from '../ui/ButtonArrow'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function HeroSection() {
  return (
    <section className="hero-section section-spacing-top">
      <div className="container-full">
        <div className="hero-wrap">
          <div className="hero-centered">
            <PreSectionTitle title="Since 1950s" />
            <div className="hero-title-wrap">
              <h1 className="hero-title">
                <span className="hero-title-line">
                  Elevating <span className="text-linear-gradient">Excellence</span>
                </span>
                <span className="hero-title-line hero-title-line--single">
                  Through Sustainable Progress
                </span>
              </h1>
            </div>
            <div className="hero-content-text">// SINCE - 1953 //</div>
            <p className="hero-description">
              A dynamic conglomerate focused on innovation, sustainability & creating value across
              industries.
            </p>
            <div className="hero-button">
              <ButtonArrow to="#About-Section" label="Explore our capabilities" />
            </div>
          </div>
        </div>
      </div>
      <div className="hero-section-overlay" aria-hidden="true" />
      <SectionLines />
      <NoiseOverlay />
    </section>
  )
}
