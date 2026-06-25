import { strengthIntro, strengthItems } from '../../data/about/strengthItems'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function AboutStrengthSection() {
  return (
    <section className="about-strength-section about-strength-section--about section-spacing">
      <div className="hero-section-overlay" aria-hidden="true" />
      <div className="container about-strength-container">
        <div className="about-strength-main">
          <FadeIn id="about-strength-header" className="about-strength-header">
            <PreSectionTitle title="Our Strength" />
            <div className="about-strength-title-row">
              <span className="about-strength-accent" aria-hidden="true" />
              <h2 className="section-title about-strength-title">
                Built on Expertise.
                <br />
                Driven by <span className="text-linear-gradient">Impact.</span>
              </h2>
            </div>
            <div className="about-strength-description-row">
              <span className="about-strength-accent" aria-hidden="true" />
              <p className="about-strength-description">{strengthIntro}</p>
            </div>
          </FadeIn>

          <div className="about-strength-grid">
            {strengthItems.map((item, index) => (
              <FadeIn
                key={item.id}
                id={item.id}
                className="about-strength-card"
                delay={index * 60}
              >
                <div className="about-strength-card-number">{item.number}</div>
                <div className="about-strength-card-content">
                  <h3 className="about-strength-card-title">{item.title}</h3>
                  <p className="about-strength-card-description">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
