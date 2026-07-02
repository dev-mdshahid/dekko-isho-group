import { manufacturingCapacityDetails } from '../../data/manufacturing/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function ManufacturingCapacityDetailsSection() {
  const { badge, title, items } = manufacturingCapacityDetails

  return (
    <section className="service-inner-section mfg-capacity-details-section">
      <div className="container">
        <div className="service-inner-main section-spacing">
          <FadeIn id="mfg-details-header" className="section-title-center one mfg-details-header">
            <PreSectionTitle title={badge} />
            <h2 className="section-title title-center">{title}</h2>
          </FadeIn>

          <div className="mfg-details-list">
            {items.map((item, index) => (
              <FadeIn
                key={item.id}
                id={`mfg-detail-${item.id}`}
                className="mfg-details-card"
                delay={index * 50}
              >
                <div className="mfg-details-number mfg-brand-text">{item.number}</div>
                <h3 className="mfg-details-title">{item.title}</h3>
                <p className="mfg-details-description">{item.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
