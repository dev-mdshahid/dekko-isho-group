import { manufacturingOperation } from '../../data/manufacturing/content'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function ManufacturingOperationSection() {
  const { badge, title, description, cards } = manufacturingOperation

  return (
    <section className="mfg-operation-section">
      <div className="mfg-operation-container">
        <div className="mfg-operation-header">
          <PreSectionTitle title={badge} />
          <h2 className="mfg-operation-title">{title}</h2>
          <p className="mfg-operation-description">{description}</p>
        </div>
        <div className="mfg-operation-cards">
          {cards.map((card) => (
            <div key={card.id} className="mfg-operation-card">
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
