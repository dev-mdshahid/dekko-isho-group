import { FadeIn } from './FadeIn'
import { PreSectionTitle } from './PreSectionTitle'

export type SplitFeatureListItem = {
  id: string
  title: string
  description: string
}

export type SplitFeatureListSectionProps = {
  badge: string
  title: string
  description: string
  items: SplitFeatureListItem[]
  id?: string
  className?: string
}

export function SplitFeatureListSection({
  badge,
  title,
  description,
  items,
  id,
  className,
}: SplitFeatureListSectionProps) {
  return (
    <section
      id={id}
      className={`split-feature-list-section${className ? ` ${className}` : ''}`}
    >
      <div className="split-feature-list-container">
        <div className="split-feature-list-layout">
          <FadeIn
            id={`${id ?? 'split-feature'}-intro`}
            className="split-feature-list-intro"
            variant="slide-in-bottom"
          >
            <PreSectionTitle title={badge} />
            <h2 className="split-feature-list-title">{title}</h2>
            <p className="split-feature-list-description">{description}</p>
          </FadeIn>

          <FadeIn
            id={`${id ?? 'split-feature'}-items`}
            className="split-feature-list-items"
            delay={60}
            variant="slide-in-bottom"
          >
            {items.map((item) => (
              <div key={item.id} className="split-feature-list-item">
                <h3 className="split-feature-list-item-title">{item.title}</h3>
                <p className="split-feature-list-item-description">{item.description}</p>
              </div>
            ))}
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
