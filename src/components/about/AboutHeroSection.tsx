import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function AboutHeroSection() {
  return (
    <section className="about-hero-section">
      <div className="about-hero-main section-spacing-top">
        <div className="container-full">
          <div className="hero-wrap">
            <FadeIn id="496825ca-af47-4d2c-6b28-e6a5f87ad674" className="about-hero-title-wrap">
              <PreSectionTitle title="Dekko Isho Group" />
              <h1 className="about-hero-title">
                Dream. Believe.
                <br />
                <span className="text-linear-gradient">Achieve.</span>
              </h1>
            </FadeIn>
            <div className="hero-bottom-wrap">
              <FadeIn
                id="7dec0c57-d1b2-b423-ef21-282893928583"
                className="hero-bottom-text"
              >
                Corporate HQ, Dhaka: West Tower, Level 16-19, 187, 188/B, Tejgaon Gulshan Link Road
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
                23.76994° N, 90.40694° E
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
      <SectionLines />
      <NoiseOverlay />
    </section>
  )
}
