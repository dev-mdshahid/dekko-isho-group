import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export type SolutionAdvancedFinishingItem = {
  id: string
  title: string
  image: string
  imageAlt: string
}

export type SolutionAdvancedFinishingContent = {
  id?: string
  badge: string
  title: string
  description: string
  items: SolutionAdvancedFinishingItem[]
}

type SolutionAdvancedFinishingSectionProps = {
  idPrefix: string
  content: SolutionAdvancedFinishingContent
}

export function SolutionAdvancedFinishingSection({
  idPrefix,
  content,
}: SolutionAdvancedFinishingSectionProps) {
  const { id, badge, title, description, items } = content

  return (
    <section id={id ?? `${idPrefix}-advanced-finishing`} className="solution-advanced-finishing-section">
      <div className="container">
        <div className="solution-advanced-finishing-main">
          <FadeIn id={`${idPrefix}-advanced-finishing-header`} className="solution-advanced-finishing-header">
            <PreSectionTitle title={badge} />
            <h2 className="section-title solution-advanced-finishing-title">{title}</h2>
            <p className="solution-advanced-finishing-description">{description}</p>
          </FadeIn>

          <div className="solution-advanced-finishing-grid">
            {items.map((item, index) => (
              <FadeIn
                key={item.id}
                id={`${idPrefix}-advanced-finishing-${item.id}`}
                className="solution-advanced-finishing-card"
                delay={index * 50}
              >
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  loading="lazy"
                  width={494}
                  height={320}
                  className="solution-advanced-finishing-card-image"
                />
                <div className="solution-advanced-finishing-card-body">
                  <h3 className="solution-advanced-finishing-card-title">{item.title}</h3>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
