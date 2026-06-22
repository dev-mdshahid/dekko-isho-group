import { designProductDevelopmentFacilities } from '../../data/design-product-development/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function DesignFacilitiesSection() {
  const { badge, title, columnLabels, items } = designProductDevelopmentFacilities

  return (
    <section className="service-category-section dpd-facilities-section">
      <div className="dpd-facilities-container">
        <div className="service-category-main dpd-facilities-main">
          <div className="service-category-inner">
            <div className="w-layout-grid grid-category-title dpd-facilities-header">
              <FadeIn id="dpd-facilities-badge" className="title-grid-left">
                <PreSectionTitle title={badge} variant="bg-dark" />
              </FadeIn>
              <div className="dpd-facilities-spacer" aria-hidden="true" />
              <FadeIn id="dpd-facilities-title" className="title-grid-right">
                <h2 className="category-title dpd-facilities-title">{title}</h2>
              </FadeIn>
            </div>

            <div className="category-content-wrap dpd-facilities-table">
              <FadeIn id="dpd-facilities-columns" className="w-layout-grid grid-category-inner">
                <div className="category-inner-left">
                  <div className="category-text dpd-facilities-column-label">
                    {columnLabels.category}
                  </div>
                </div>
                <div className="dpd-facilities-spacer" aria-hidden="true" />
                <div className="category-inner-right">
                  <div className="category-text dpd-facilities-column-label">
                    {columnLabels.details}
                  </div>
                </div>
              </FadeIn>

              {items.map((item, index) => (
                <FadeIn
                  key={item.id}
                  id={`dpd-facilities-${item.id}`}
                  className={`w-layout-grid grid-category-info dpd-facilities-row${index === items.length - 1 ? ' last' : ''}`}
                  delay={index * 50}
                >
                  <div className="category-name-wrap">
                    <div className="category-name dpd-facilities-category">{item.category}</div>
                  </div>
                  <div className="dpd-facilities-spacer" aria-hidden="true" />
                  <div className="category-details-wrap">
                    <ul className="dpd-facilities-details-list">
                      {item.details.map((detail) => (
                        <li key={detail} className="dpd-facilities-details-item">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
