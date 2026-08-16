import { manufacturingAutomation } from '../../data/manufacturing/content'
import { FadeIn } from '../ui/FadeIn'

/**
 * Automation machinery grid — header pattern adapted from AboutStrength
 * (accent bar + dual-tone title); cards follow embroidery image+footer layout
 * in a 3-column manufacturing grid.
 */
export function ManufacturingAutomationSection() {
  const { id, description, items } = manufacturingAutomation

  return (
    <section id={id} className="mfg-automation-section">
      <div className="container mfg-automation-container">
        <div className="mfg-automation-main">
          <FadeIn id="mfg-automation-header" className="mfg-automation-header">
            <div className="mfg-automation-title-row">
              <span className="mfg-automation-accent" aria-hidden="true" />
              <h2 className="section-title mfg-automation-title">
                Integrating{' '}
                <span className="mfg-capacity-title-accent mfg-capacity-title-accent--amaranth">
                  Automation
                </span>
                <br />
                for Enhanced{' '}
                <span className="mfg-capacity-title-accent">Precision</span>.
              </h2>
            </div>
            <p className="mfg-automation-description">{description}</p>
          </FadeIn>

          <div className="mfg-automation-grid" data-solution-animate-group>
            {items.map((item, index) => (
              <FadeIn
                key={item.id}
                id={`mfg-automation-${item.id}`}
                className="mfg-automation-card"
                delay={index * 50}
              >
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  loading="lazy"
                  decoding="async"
                  className="mfg-automation-card-image"
                />
                <div className="mfg-automation-card-footer">
                  <h3 className="mfg-automation-card-label">{item.label}</h3>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
