import { manufacturingQuality } from '../../data/manufacturing/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

const STRENGTH_BG = '/images/about-strength-bg.png'

export function ManufacturingQualitySection() {
  const { badge, title, description, items } = manufacturingQuality

  return (
    <section className="about-strength-section section-spacing mfg-quality-section">
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
          <FadeIn id="mfg-quality-header" className="about-strength-header">
            <PreSectionTitle title={badge} variant="bg-dark" />
            <div className="about-strength-title-row">
              <span className="about-strength-accent" aria-hidden="true" />
              <h2 className="section-title text-white about-strength-title">{title}</h2>
            </div>
            <p className="about-strength-description">{description}</p>
          </FadeIn>

          <div className="about-strength-grid mfg-quality-grid">
            {items.map((item, index) => (
              <FadeIn
                key={item.id}
                id={`mfg-quality-${item.id}`}
                className="about-strength-card mfg-quality-card"
                delay={index * 50}
              >
                <div className="about-strength-card-number">{item.number}</div>
                <div className="about-strength-card-content">
                  <h3 className="about-strength-card-title">{item.title}</h3>
                  <p className="about-strength-card-description">{item.description}</p>
                </div>
                <img
                  src={item.image}
                  loading="lazy"
                  alt={item.imageAlt}
                  className="mfg-quality-card-image"
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
