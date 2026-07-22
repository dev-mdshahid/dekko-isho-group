import { designProductDevelopmentFactoryAssurance } from '../../data/design-product-development/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function DesignFactoryAssuranceSection() {
  const { badge, titleBefore, titleAccent, titleAfter, image, imageAlt, items } =
    designProductDevelopmentFactoryAssurance

  return (
    <section className="dpd-factory-section">
      <div className="dpd-factory-container">
        <header className="dpd-factory-header">
          <FadeIn id="dpd-factory-badge" className="dpd-factory-badge">
            <PreSectionTitle title={badge} />
          </FadeIn>
          <FadeIn id="dpd-factory-title-wrap" className="dpd-factory-title-wrap">
            <h2 className="dpd-factory-title">
              {titleBefore}
              <span className="dpd-factory-title-accent">{titleAccent}</span>
              {titleAfter}
            </h2>
          </FadeIn>
        </header>

        <FadeIn id="dpd-factory-media" className="dpd-factory-media" delay={40}>
          <img src={image} loading="lazy" alt={imageAlt} className="dpd-factory-image" />
        </FadeIn>

        <div className="dpd-factory-content">
          <div className="dpd-factory-accent-bar" aria-hidden="true">
            {items.map((item) => (
              <span
                key={item.id}
                className="dpd-factory-accent-segment"
                style={{ backgroundColor: item.accent }}
              />
            ))}
          </div>

          <div className="dpd-factory-grid">
            {items.map((item, index) => (
              <FadeIn
                key={item.id}
                id={`dpd-factory-${item.id}`}
                className="dpd-factory-card"
                delay={index * 50}
              >
                <span className="dpd-factory-card-number" style={{ color: item.accent }}>
                  {item.number}
                </span>
                <h3 className="dpd-factory-card-title">{item.title}</h3>
                <p className="dpd-factory-card-description">{item.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
