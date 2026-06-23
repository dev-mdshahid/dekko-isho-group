import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function AboutHeroSection() {
  return (
    <section className="about-hero-section">
      <div className="about-hero-main section-spacing-top">
        <div className="container-full">
          <div className="hero-wrap">
            <FadeIn id="496825ca-af47-4d2c-6b28-e6a5f87ad674" className="about-hero-title-wrap">
              <h1 className="about-hero-title">
                Dream. Believe.
                <br />
                <span className="text-linear-gradient">Achieve.</span>
              </h1>
            </FadeIn>
          </div>
        </div>
      </div>
      <SectionLines />
      <NoiseOverlay />
    </section>
  )
}
