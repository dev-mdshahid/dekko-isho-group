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
          <div className="hero-bottom-wrap">
            <div className="hero-bottom-text">
              Corporate HQ, Dhaka: West Tower, Level 16-19, 187, 188/B, Tejgaon Gulshan Link Road
            </div>
            <div>
              <a href="#Footer" className="hero-bottom-link">
                SCROLL DOWN
              </a>
            </div>
            <div className="hero-bottom-text">
              23.76994° N, 90.40694° E
            </div>
          </div>
        </div>
      </div>
      <SectionLines />
      <NoiseOverlay />
    </section>
  )
}
