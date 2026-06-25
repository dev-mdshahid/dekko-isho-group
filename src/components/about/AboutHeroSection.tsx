import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function AboutHeroSection() {
  return (
    <section className="about-hero-section">
      <div className="about-hero-inner">
        <div className="container-full">
          <FadeIn id="496825ca-af47-4d2c-6b28-e6a5f87ad674" className="about-hero-title-wrap">
            <h1 className="about-hero-title">
              Creating <span className="hero-title-accent hero-title-accent--primary">Impact</span> <br /> Across
              Generations
            </h1>
            <p className="about-hero-subtitle">
              For over seven decades, we have transformed ambition into progress through innovation,
              resilience, and responsible growth. Today, we continue to create lasting value for our people,
              partners and communities while shaping a better future for all.
            </p>
          </FadeIn>
        </div>
      </div>
      <div className="hero-section-overlay" aria-hidden="true" />
      <SectionLines />
      <NoiseOverlay />
    </section>
  )
}
