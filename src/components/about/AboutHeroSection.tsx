import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function AboutHeroSection() {
  return (
    <section className="about-hero-section">
      <div className="about-hero-inner">
        <div className="container-full">
          <div className="about-hero-title-wrap">
            <h1 className="about-hero-title">
              <span className="hero-title-line-mask">
                <span data-about-animate="hero-line">
                  Creating{' '}
                  <span className="hero-title-accent hero-title-accent--primary">Impact</span>
                </span>
                <span className="hero-title-caret" aria-hidden="true" />
              </span>
              <span className="hero-title-line-mask">
                <span data-about-animate="hero-line">Across Generations</span>
                <span className="hero-title-caret" aria-hidden="true" />
              </span>
            </h1>
            <p className="about-hero-subtitle">
              For over seven decades, we have transformed ambition into progress through innovation,
              resilience, and responsible growth. Today, we continue to create lasting value for our
              people, partners and communities while shaping a better future for all.
            </p>
          </div>
        </div>
      </div>
      <div className="hero-section-overlay" aria-hidden="true" />
      <SectionLines />
      <NoiseOverlay />
    </section>
  )
}
