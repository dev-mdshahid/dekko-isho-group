import { manufacturingOperation } from '../../data/manufacturing/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function ManufacturingOperationSection() {
  const { badge, title, description, cards } = manufacturingOperation

  return (
    <section className="mfg-operation-section">
      <div className="mfg-operation-container">
        <FadeIn
          id="mfg-operation-header"
          className="mfg-operation-header"
          variant="slide-in-bottom"
        >
          <PreSectionTitle title={badge} />
          <h2 className="mfg-operation-title">{title}</h2>
          <p className="mfg-operation-description">{description}</p>
        </FadeIn>
        <div className="mfg-operation-cards" data-solution-animate-group>
          {cards.map((card) => (
            <div
              key={card.id}
              className="mfg-operation-card"
              data-solution-animate="tilt-card"
            >
              <div className="mfg-operation-card-image-wrapper">
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  className="mfg-operation-card-image"
                />
                <span className="mfg-operation-card-number">{card.number}</span>
              </div>
              <div className="mfg-operation-card-body">
                <span className="mfg-operation-card-label">{card.label}</span>
                <h3 className="mfg-operation-card-title">{card.title}</h3>
                <p className="mfg-operation-card-description">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
