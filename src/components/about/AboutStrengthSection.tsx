import { strengthIntro, strengthItems } from '../../data/about/strengthItems'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

const STRENGTH_BG = '/images/about-strength-bg.png'

export function AboutStrengthSection() {
  return (
    <section className="about-strength-section section-spacing">
      <img
        src={STRENGTH_BG}
        loading="lazy"
        alt=""
        aria-hidden="true"
        className="about-strength-bg"
      />
      <div className="about-strength-overlay" aria-hidden="true" />

      <div className="about-strength-container">
        <div className="about-strength-main">
          <FadeIn id="about-strength-header" className="about-strength-header">
            <PreSectionTitle title="Our Strength" />
            <div className="about-strength-title-row">
              <span className="about-strength-accent" aria-hidden="true" />
              <h2 className="section-title text-white about-strength-title">
                Built on Sourcing Intelligence,<br /> Speed and Transparency.
              </h2>
            </div>
            <p className="about-strength-description">{strengthIntro}</p>
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
