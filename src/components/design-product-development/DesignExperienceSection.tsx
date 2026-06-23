import { designProductDevelopmentExperience } from '../../data/design-product-development/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function DesignExperienceSection() {
  const { badge, titleBefore, titleAccent, titleAfter, items } = designProductDevelopmentExperience

  return (
    <section className="dpd-experience-section">
      <div className="dpd-experience-glow" aria-hidden="true" />
      <div className="dpd-experience-container">
        <FadeIn id="dpd-experience-header" className="dpd-experience-header">
          <PreSectionTitle title={badge} variant="bg-dark" />
          <h2 className="dpd-experience-title">
            {titleBefore}
            <span className="dpd-experience-title-accent">{titleAccent}</span>
            {titleAfter}
          </h2>
        </FadeIn>

        <div className="dpd-experience-grid">
          {items.map((item, index) => (
            <FadeIn
              key={item.id}
              id={`dpd-experience-${item.id}`}
              className="dpd-experience-card"
              delay={index * 50}
            >
              <span className="dpd-experience-card-number">{item.number}</span>
              <h3 className="dpd-experience-card-title">{item.title}</h3>
              <p className="dpd-experience-card-description">{item.description}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
