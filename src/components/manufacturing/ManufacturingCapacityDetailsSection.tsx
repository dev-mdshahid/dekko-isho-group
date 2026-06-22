import { manufacturingCapacityDetails } from '../../data/manufacturing/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function ManufacturingCapacityDetailsSection() {
  const { badge, title, columnLabels, items } = manufacturingCapacityDetails

  return (
    <section className="service-inner-section mfg-capacity-details-section">
      <div className="container">
        <div className="service-inner-main section-spacing">
          <FadeIn id="mfg-details-header" className="section-title-center one">
            <PreSectionTitle title={badge} />
            <h2 className="section-title title-center">{title}</h2>
          </FadeIn>

          <div className="category-content-wrap mfg-capacity-details-wrap">
            <FadeIn id="mfg-details-columns" className="w-layout-grid grid-category-inner mfg-details-columns">
              <div className="category-inner-left">
                <div className="mfg-details-column-label">{columnLabels.left}</div>
              </div>
              <div className="category-inner-right">
                <div className="mfg-details-column-label">{columnLabels.right}</div>
              </div>
            </FadeIn>

            {items.map((item, index) => (
              <FadeIn
                key={item.id}
                id={`mfg-detail-${item.id}`}
                className={`w-layout-grid grid-category-info mfg-details-row${item.last ? ' last' : ''}`}
                delay={index * 50}
              >
                <div className="category-name-wrap">
                  <div className="category-name mfg-details-category">{item.category}</div>
                </div>
                <div className="category-details-wrap">
                  <div className="category-details w-richtext mfg-details-list">
                    <ul>
                      {item.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
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
