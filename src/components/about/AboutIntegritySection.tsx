import {
  aboutCoreValues,
  aboutPurposeIntro,
  aboutPurposeMission,
  aboutPurposeVision,
} from '../../data/about/purpose'
import { FadeIn } from '../ui/FadeIn'

export function AboutIntegritySection() {
  return (
    <section className="about-purpose-section">
      <div className="about-purpose-main">
        <div className="container">
          <div className="about-purpose-grid">
            <FadeIn id="about-purpose-intro" className="about-purpose-intro">
              <h2 className="about-purpose-title">
                <span className="about-purpose-title-line">
                  Built on <span className="hero-title-accent hero-title-accent--primary">Ideas</span>
                </span>
                <span className="about-purpose-title-line">
                  Driven by <span className="hero-title-accent hero-title-accent--green">Impact</span>
                </span>
                <span className="about-purpose-title-line">
                  Defined by <span className="hero-title-accent hero-title-accent--red">People</span>
                </span>
              </h2>
              <p className="about-purpose-description">{aboutPurposeIntro}</p>
            </FadeIn>

            <div className="about-purpose-details">
              <FadeIn id="about-purpose-mission" className="about-purpose-block">
                <h3 className="about-purpose-block-title">Mission</h3>
                <p className="about-purpose-block-text">{aboutPurposeMission}</p>
              </FadeIn>

              <div className="about-purpose-separator" aria-hidden="true" />

              <FadeIn id="about-purpose-vision" className="about-purpose-block">
                <h3 className="about-purpose-block-title">Vision</h3>
                <p className="about-purpose-block-text">{aboutPurposeVision}</p>
              </FadeIn>

              <div className="about-purpose-separator" aria-hidden="true" />

              <FadeIn id="about-purpose-values" className="about-purpose-block">
                <h3 className="about-purpose-block-title">Core Values</h3>
                <ul className="about-purpose-values">
                  {aboutCoreValues.map((value) => (
                    <li key={value.label} className="about-purpose-value-item">
                      <span className="about-purpose-value-label">{value.label}:</span>{' '}
                      {value.description}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
