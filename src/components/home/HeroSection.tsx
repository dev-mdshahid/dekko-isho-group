import { ButtonArrow } from '../ui/ButtonArrow'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function HeroSection() {
  return (
    <section className="hero-section section-spacing-top">
      <div className="container-full">
        <div className="hero-wrap">
          <div className="w-layout-grid grid-hero">
            <div className="hero-left-wrap">
              <div className="hero-left-inner">
                <PreSectionTitle title="Pioneering Innovation" />
                <div className="hero-title-wrap">
                  <h1 className="hero-title">
                    Elevating <span className="text-linear-gradient">Excellence</span> Through Innovation
                  </h1>
                </div>
              </div>
            </div>
            <div className="hero-right-wrap">
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
      </div>
      <div className="hero-section-overlay" aria-hidden="true" />
      <SectionLines />
      <NoiseOverlay />
    </section>
  )
}
