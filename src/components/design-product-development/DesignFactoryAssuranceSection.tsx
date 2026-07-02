import { designProductDevelopmentFactoryAssurance } from '../../data/design-product-development/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function DesignFactoryAssuranceSection() {
  const { badge, title, items } = designProductDevelopmentFactoryAssurance

  return (
    <section className="dpd-factory-section">
      <div className="dpd-factory-glow" aria-hidden="true" />
      <div className="dpd-factory-container">
        <div className="dpd-factory-header">
          <FadeIn id="dpd-factory-badge" className="dpd-factory-badge">
            <PreSectionTitle title={badge} variant="bg-dark" />
          </FadeIn>
          <FadeIn id="dpd-factory-title-wrap" className="dpd-factory-title-wrap">
            <h2 className="dpd-factory-title">{title}</h2>
          </FadeIn>
        </div>

        <div className="dpd-factory-grid">
          {items.map((item, index) => (
            <FadeIn
              key={item.id}
              id={`dpd-factory-${item.id}`}
              className="dpd-factory-card"
              delay={index * 50}
            >
              <span
                className="dpd-factory-card-accent"
                style={{ backgroundColor: item.accent }}
                aria-hidden="true"
              />
              <span className="dpd-factory-card-number" style={{ color: item.accent }}>
                {item.number}
              </span>
              <h3 className="dpd-factory-card-title">{item.title}</h3>
              {item.items && item.items.length > 0 ? (
                <ul className="dpd-factory-card-list">
                  {item.items.map((detail) => (
                    <li key={detail} className="dpd-factory-card-list-item">
                      {detail}
                    </li>
                  ))}
                </ul>
              ) : item.description ? (
                <p className="dpd-factory-card-description">{item.description}</p>
              ) : null}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
