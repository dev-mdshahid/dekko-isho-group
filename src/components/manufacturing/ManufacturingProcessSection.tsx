import { manufacturingProcess } from '../../data/manufacturing/content'
import { useAccordion } from '../../hooks/useAccordion'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { SectionLines } from '../ui/SectionDecor'

export function ManufacturingProcessSection() {
  const { openIndex, toggle } = useAccordion(0)
  const { badge, title, steps } = manufacturingProcess

  return (
    <section className="service-category-section mfg-process-section">
      <div className="container">
        <div className="service-category-main section-spacing">
          <div className="service-category-inner">
            <FadeIn id="mfg-process-header" className="w-layout-grid grid-category-title">
              <div className="title-grid-left">
                <PreSectionTitle title={badge} variant="bg-dark" />
              </div>
              <div className="title-grid-right">
                <h2 className="category-title">{title}</h2>
              </div>
            </FadeIn>

            <div className="mfg-process-layout">
              <div className="mfg-process-steps" role="tablist" aria-label="Manufacturing process steps">
                {steps.map((step, index) => {
                  const isOpen = openIndex === index
                  return (
                    <button
                      key={step.id}
                      type="button"
                      role="tab"
                      aria-selected={isOpen}
                      aria-controls={`mfg-process-panel-${step.id}`}
                      id={`mfg-process-tab-${step.id}`}
                      className={`mfg-process-step${isOpen ? ' is-active' : ''}`}
                      onClick={() => toggle(index)}
                    >
                      <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
                      <span className="step-title-one text-white">{step.title}</span>
                    </button>
                  )
                })}
              </div>

              <div className="mfg-process-panels">
                {steps.map((step, index) => {
                  const isOpen = openIndex === index
                  return (
                    <div
                      key={step.id}
                      id={`mfg-process-panel-${step.id}`}
                      role="tabpanel"
                      aria-labelledby={`mfg-process-tab-${step.id}`}
                      className={`mfg-process-panel${isOpen ? ' is-active' : ''}`}
                      hidden={!isOpen}
                    >
                      <FadeIn id={`mfg-process-content-${step.id}`}>
                        <h3 className="category-title">{step.title}</h3>
                        <p className="category-details">{step.description}</p>
                      </FadeIn>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SectionLines border="dark" />
      <div className="bg-gradient" aria-hidden="true" />
    </section>
  )
}
