import { designProductDevelopmentServices } from '../../data/design-product-development/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function DesignServicesSection() {
  const { id, badge, title, description, image, imageAlt, steps } =
    designProductDevelopmentServices

  return (
    <section id={id} className="dpd-services-section">
      <div className="container">
        <FadeIn id="dpd-services-header" className="dpd-services-header">
          <PreSectionTitle title={badge} />
          <h2 className="dpd-services-title">{title}</h2>
          <p className="dpd-services-description">{description}</p>
        </FadeIn>

        <FadeIn id="dpd-services-image" className="dpd-services-image-wrap" delay={60}>
          <img src={image} loading="lazy" alt={imageAlt} className="dpd-services-image" />
        </FadeIn>

        <div className="dpd-services-steps">
          {steps.map((step, index) => (
            <FadeIn
              key={step.id}
              id={`dpd-services-step-${step.id}`}
              className="dpd-services-step-card"
              delay={index * 60}
            >
              <span className="dpd-services-step-number">{step.number}</span>
              <h3 className="dpd-services-step-title">{step.title}</h3>
              <ul className="dpd-services-step-list">
                {step.items.map((item) => (
                  <li key={item} className="dpd-services-step-list-item">
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
