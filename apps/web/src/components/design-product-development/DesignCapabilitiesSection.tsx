import { designProductDevelopmentCapabilities } from '../../data/design-product-development/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function DesignCapabilitiesSection() {
  const { id, badge, title, description, items } = designProductDevelopmentCapabilities

  return (
    <section id={id} className="dpd-capabilities-section">
      <div className="dpd-capabilities-container">
        <FadeIn
          id="dpd-capabilities-header"
          className="dpd-capabilities-header"
          variant="slide-in-bottom"
        >
          <PreSectionTitle title={badge} />
          <h2 className="dpd-capabilities-title">{title}</h2>
          <p className="dpd-capabilities-description">{description}</p>
        </FadeIn>

        <div className="dpd-capabilities-grid" data-solution-animate-group>
          {items.map((item) => (
            <div
              key={item.id}
              id={`dpd-capability-${item.id}`}
              className="dpd-capabilities-card"
              data-solution-animate="tilt-card"
            >
              <div className="dpd-capabilities-card-media">
                <img
                  src={item.image}
                  loading="lazy"
                  alt={item.imageAlt}
                  className="dpd-capabilities-card-image"
                />
              </div>
              <div className="dpd-capabilities-card-body">
                <h3 className="dpd-capabilities-card-title">{item.title}</h3>
                <p className="dpd-capabilities-card-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
