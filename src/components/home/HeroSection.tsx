import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function HeroSection() {
  return (
    <section className="hero-section section-spacing-top">
      <div className="container-full">
        <div className="hero-wrap">
          <div className="w-layout-grid grid-hero">
            <div className="hero-left-wrap">
              <FadeIn id="257211a5-2a9d-1221-d387-56b813a33b41" className="hero-left-inner">
                <PreSectionTitle title="Trusted manufacturing partner" />
                <div className="hero-title-wrap">
                  <h1 className="hero-title">
                    From raw <span className="text-linear-gradient">material</span> to market-ready
                  </h1>
                </div>
              </FadeIn>
            </div>
            <FadeIn id="89b15f62-94c9-1c8d-5eb8-ed12f4e88666" className="hero-right-wrap">
              <div className="hero-content-text">// SINCE - 2005 //</div>
              <p className="hero-description">
                From concept to production, we deliver high-quality, scalable, and cost-effective solutions
                tailored to your business needs.
              </p>
              <div className="hero-button">
                <ButtonArrow to="/services" label="Explore Our Capabilities" />
              </div>
            </FadeIn>
          </div>
          <div className="hero-bottom-wrap">
            <FadeIn
              id="7dec0c57-d1b2-b423-ef21-282893928583"
              className="hero-bottom-text"
            >
              Based in: Los Angeles, USA
            </FadeIn>
            <FadeIn id="33e8caeb-8f86-0a37-d251-e7111d4b615c">
              <a href="#Footer" className="hero-bottom-link">
                SCROLL DOWN
              </a>
            </FadeIn>
            <FadeIn
              id="22ca442b-6b4e-ae70-b69a-dc7eb35ab8aa"
              className="hero-bottom-text"
            >
              21.0278° N, 105.8342° E
            </FadeIn>
          </div>
        </div>
      </div>
      <SectionLines />
      <NoiseOverlay />
    </section>
  )
}
