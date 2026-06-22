import { complianceSustainabilityQuality } from '../../data/compliance-sustainability/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function ComplianceQualitySection() {
  const { badge, title, description, primaryImage, gridImages, bannerImage, pillars } =
    complianceSustainabilityQuality

  return (
    <section className="cs-quality-section">
      <div className="cs-quality-container">
        <FadeIn id="cs-quality-header" className="cs-quality-header">
          <PreSectionTitle title={badge} />
          <h2 className="cs-quality-title">{title}</h2>
          <p className="cs-quality-description">{description}</p>
        </FadeIn>

        <FadeIn id="cs-quality-gallery" className="cs-quality-gallery" delay={60}>
          <div className="cs-quality-gallery-row">
            <div className="cs-quality-gallery-primary">
              <img
                src={primaryImage.src}
                loading="lazy"
                alt={primaryImage.alt}
                className="cs-quality-gallery-image"
              />
            </div>

            <div className="cs-quality-gallery-grid">
              {gridImages.map((image) => (
                <div key={image.src} className="cs-quality-gallery-grid-item">
                  <img
                    src={image.src}
                    loading="lazy"
                    alt={image.alt}
                    className="cs-quality-gallery-image"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="cs-quality-gallery-banner">
            <img
              src={bannerImage.src}
              loading="lazy"
              alt={bannerImage.alt}
              className="cs-quality-gallery-image"
            />
          </div>
        </FadeIn>

        <div className="cs-quality-pillars-wrap">
          <div className="cs-quality-pillars">
            {pillars.map((pillar, index) => (
              <FadeIn
                key={pillar.id}
                id={`cs-quality-pillar-${pillar.id}`}
                className="cs-quality-pillar"
                delay={index * 50}
              >
                <span
                  className="cs-quality-pillar-accent"
                  style={{ backgroundColor: pillar.accent }}
                  aria-hidden="true"
                />
                <span className="cs-quality-pillar-number" style={{ color: pillar.accent }}>
                  {pillar.number}
                </span>
                <h3 className="cs-quality-pillar-title">{pillar.title}</h3>
                <ul className="cs-quality-pillar-list">
                  {pillar.items.map((item) => (
                    <li key={item} className="cs-quality-pillar-list-item">
                      {item}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
