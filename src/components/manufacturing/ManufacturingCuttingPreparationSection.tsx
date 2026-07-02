import { manufacturingCuttingPreparation } from '../../data/manufacturing/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function ManufacturingCuttingPreparationSection() {
  const { badge, title, description, items } = manufacturingCuttingPreparation

  return (
    <section className="service-category-section mfg-cutting-section">
      <div className="container">
        <div className="service-category-main section-spacing">
          <FadeIn id="mfg-cutting-header" className="mfg-cutting-header">
            <PreSectionTitle title={badge} variant="bg-dark" />
            <h2 className="category-title mfg-cutting-title">{title}</h2>
            <p className="mfg-cutting-description">{description}</p>
          </FadeIn>

          <div className="mfg-cutting-grid">
            {items.map((item, index) => (
              <FadeIn
                key={item.id}
                id={`mfg-cutting-${item.id}`}
                className="mfg-cutting-card"
                delay={index * 50}
              >
                <div className="mfg-cutting-card-content">
                  <div className="mfg-cutting-card-number">{item.number}</div>
                  <h3 className="mfg-cutting-card-title">{item.title}</h3>
                  <p className="mfg-cutting-card-description">{item.description}</p>
                </div>
                <img
                  src={item.image}
                  loading="lazy"
                  alt={item.imageAlt}
                  className="mfg-cutting-card-image"
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
