import { Check } from 'lucide-react'

import { designProductDevelopmentDigitalImpact } from '../../data/design-product-development/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function DesignDigitalImpactSection() {
  const { id, badge, title, description, items } = designProductDevelopmentDigitalImpact

  return (
    <section id={id} className="dpd-digital-impact-section">
      <div className="dpd-digital-impact-container">
        <div className="dpd-digital-impact-layout">
          <FadeIn id="dpd-digital-impact-intro" className="dpd-digital-impact-intro">
            <PreSectionTitle title={badge} />
            <h2 className="dpd-digital-impact-title">{title}</h2>
            <p className="dpd-digital-impact-description">{description}</p>
          </FadeIn>

          <div className="dpd-digital-impact-list">
            {items.map((item, index) => (
              <FadeIn
                key={item.id}
                id={`dpd-digital-impact-${item.id}`}
                className="dpd-digital-impact-item"
                delay={index * 40}
              >
                <Check
                  className="dpd-digital-impact-icon"
                  aria-hidden="true"
                  strokeWidth={2.5}
                />
                <div className="dpd-digital-impact-item-copy">
                  <h3 className="dpd-digital-impact-item-title">{item.title}</h3>
                  <p className="dpd-digital-impact-item-description">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
