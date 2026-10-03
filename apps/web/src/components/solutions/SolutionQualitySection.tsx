import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export type SolutionQualityItem = {
  id: string
  number: string
  title: string
  description: string
  image: string
  imageAlt: string
}

export type SolutionQualityContent = {
  badge: string
  title: string
  description: string
  items: SolutionQualityItem[]
}

type SolutionQualitySectionProps = {
  idPrefix: string
  content: SolutionQualityContent
}

export function SolutionQualitySection({ idPrefix, content }: SolutionQualitySectionProps) {
  const { badge, title, description, items } = content

  return (
    <section className="solution-quality-section">
      <div className="solution-quality-container">
        <FadeIn id={`${idPrefix}-quality-header`} className="solution-quality-header">
          <PreSectionTitle title={badge} variant="bg-dark" />
          <h2 className="solution-quality-title">{title}</h2>
          <p className="solution-quality-description">{description}</p>
        </FadeIn>

        <div className="solution-quality-grid">
          {items.map((item, index) => (
            <FadeIn
              key={item.id}
              id={`${idPrefix}-quality-${item.id}`}
              className="solution-quality-card"
              delay={index * 50}
            >
              <div className="solution-quality-card-body">
                <span className="solution-quality-card-number">{item.number}</span>
                <div className="solution-quality-card-content">
                  <h3 className="solution-quality-card-title">{item.title}</h3>
                  <p className="solution-quality-card-description">{item.description}</p>
                </div>
              </div>
              <div className="solution-quality-card-media">
                <img
                  src={item.image}
                  loading="lazy"
                  alt={item.imageAlt}
                  className="solution-quality-card-image"
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
