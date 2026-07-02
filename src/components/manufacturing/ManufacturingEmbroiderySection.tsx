import { manufacturingEmbroidery } from '../../data/manufacturing/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function ManufacturingEmbroiderySection() {
  const { badge, title, cards } = manufacturingEmbroidery

  return (
    <section className="service-category-section mfg-embroidery-section">
      <div className="container">
        <div className="service-category-main mfg-embroidery-main">
          <FadeIn id="mfg-embroidery-header" className="mfg-embroidery-header">
            <PreSectionTitle title={badge} variant="bg-dark" />
            <h2 className="category-title mfg-embroidery-title">{title}</h2>
          </FadeIn>

          <div className="mfg-embroidery-grid">
            {cards.map((card, index) => (
              <FadeIn
                key={card.id}
                id={`mfg-embroidery-${card.id}`}
                className="mfg-embroidery-card"
                delay={index * 60}
              >
                <img
                  src={card.image}
                  loading="lazy"
                  alt={card.imageAlt}
                  className="mfg-embroidery-card-image"
                />
                <div className="mfg-embroidery-card-body">
                  <h3 className="mfg-embroidery-card-title">{card.title}</h3>
                  <div className="mfg-embroidery-card-points">
                    {card.points.map((point) => (
                      <p key={point} className="mfg-embroidery-card-point">
                        {point}
                      </p>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
