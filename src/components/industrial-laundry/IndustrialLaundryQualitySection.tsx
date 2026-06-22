import { industrialLaundryQuality } from '../../data/industrial-laundry/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function IndustrialLaundryQualitySection() {
  const { badge, title, description, items } = industrialLaundryQuality

  return (
    <section className="il-quality-section">
      <div className="il-quality-container">
        <FadeIn id="il-quality-header" className="il-quality-header">
          <PreSectionTitle title={badge} variant="bg-dark" />
          <h2 className="il-quality-title">{title}</h2>
          <p className="il-quality-description">{description}</p>
        </FadeIn>

        <div className="il-quality-grid">
          {items.map((item, index) => (
            <FadeIn
              key={item.id}
              id={`il-quality-${item.id}`}
              className="il-quality-card"
              delay={index * 50}
            >
              <div className="il-quality-card-body">
                <span className="il-quality-card-number">{item.number}</span>
                <div className="il-quality-card-content">
                  <h3 className="il-quality-card-title">{item.title}</h3>
                  <p className="il-quality-card-description">{item.description}</p>
                </div>
              </div>
              <div className="il-quality-card-media">
                <img
                  src={item.image}
                  loading="lazy"
                  alt={item.imageAlt}
                  className="il-quality-card-image"
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
