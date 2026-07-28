import { complianceSustainabilityReporting } from '../../data/compliance-sustainability/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function ComplianceReportingSection() {
  const { badge, title, columnLabels, items } = complianceSustainabilityReporting

  return (
    <section className="service-category-section cs-reporting-section">
      <div className="cs-reporting-container">
        <div className="service-category-main cs-reporting-main">
          <div className="service-category-inner">
            <div className="w-layout-grid grid-category-title cs-reporting-header">
              <FadeIn
                id="cs-reporting-badge"
                className="title-grid-left"
                variant="slide-in-bottom"
              >
                <PreSectionTitle title={badge} variant="bg-dark" />
              </FadeIn>
              <div className="cs-reporting-spacer" aria-hidden="true" />
              <FadeIn
                id="cs-reporting-title"
                className="title-grid-right"
                variant="slide-in-bottom"
                delay={40}
              >
                <h2 className="category-title cs-reporting-title">{title}</h2>
              </FadeIn>
            </div>

            <div
              className="category-content-wrap cs-reporting-table"
              data-solution-animate-group
            >
              <FadeIn
                id="cs-reporting-columns"
                className="w-layout-grid grid-category-inner"
                variant="slide-in-bottom"
              >
                <div className="category-inner-left">
                  <div className="category-text cs-reporting-column-label">
                    {columnLabels.category}
                  </div>
                </div>
                <div className="cs-reporting-spacer" aria-hidden="true" />
                <div className="category-inner-right">
                  <div className="category-text cs-reporting-column-label">
                    {columnLabels.details}
                  </div>
                </div>
              </FadeIn>

              {items.map((item, index) => (
                <div
                  key={item.id}
                  id={`cs-reporting-${item.id}`}
                  className={`w-layout-grid grid-category-info cs-reporting-row${index === items.length - 1 ? ' last' : ''}`}
                  data-solution-animate="card"
                >
                  <div className="category-name-wrap">
                    <div className="category-name cs-reporting-category">{item.category}</div>
                  </div>
                  <div className="cs-reporting-spacer" aria-hidden="true" />
                  <div className="category-details-wrap">
                    <ul className="cs-reporting-details-list">
                      {item.details.map((detail) => (
                        <li key={detail} className="cs-reporting-details-item">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
