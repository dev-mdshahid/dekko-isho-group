import { manufacturingHowItWorks } from '../../data/manufacturing/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function ManufacturingHowItWorksSection() {
  const { badge, title, columnLabels, items } = manufacturingHowItWorks

  return (
    <section className="service-category-section mfg-how-it-works-section">
      <div className="mfg-how-it-works-container">
        <div className="service-category-main mfg-how-it-works-main">
          <div className="service-category-inner">
            <div className="w-layout-grid grid-category-title mfg-how-it-works-header">
              <FadeIn id="mfg-how-it-works-badge" className="title-grid-left">
                <PreSectionTitle title={badge} variant="bg-dark" />
              </FadeIn>
              <div className="mfg-how-it-works-spacer" aria-hidden="true" />
              <FadeIn id="mfg-how-it-works-title" className="title-grid-right">
                <h2 className="category-title mfg-how-it-works-title">{title}</h2>
              </FadeIn>
            </div>

            <div className="category-content-wrap mfg-how-it-works-table">
              <FadeIn id="mfg-how-it-works-columns" className="w-layout-grid grid-category-inner">
                <div className="category-inner-left">
                  <div className="category-text mfg-how-it-works-column-label">
                    {columnLabels.category}
                  </div>
                </div>
                <div className="mfg-how-it-works-spacer" aria-hidden="true" />
                <div className="category-inner-right">
                  <div className="category-text mfg-how-it-works-column-label">
                    {columnLabels.details}
                  </div>
                </div>
              </FadeIn>

              {items.map((item, index) => (
                <FadeIn
                  key={item.id}
                  id={`mfg-how-it-works-${item.id}`}
                  className={`w-layout-grid grid-category-info mfg-how-it-works-row${index === items.length - 1 ? ' last' : ''}`}
                  delay={index * 50}
                >
                  <div className="category-name-wrap">
                    <div className="category-name mfg-how-it-works-category">{item.category}</div>
                  </div>
                  <div className="mfg-how-it-works-spacer" aria-hidden="true" />
                  <div className="category-details-wrap">
                    <div className="category-details mfg-how-it-works-details">{item.details}</div>
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
