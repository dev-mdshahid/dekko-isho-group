import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export type SolutionCapacityRow = {
  id: string
  title: string
  items: string[]
}

export type SolutionCapacityContent = {
  badge: string
  title: string
  description: string
  rows: SolutionCapacityRow[]
}

type SolutionCapacitySectionProps = {
  idPrefix: string
  content: SolutionCapacityContent
}

export function SolutionCapacitySection({ idPrefix, content }: SolutionCapacitySectionProps) {
  const { badge, title, description, rows } = content

  return (
    <section className="service-category-section solution-capacity-section">
      <div className="solution-capacity-container">
        <div className="solution-capacity-layout">
          <FadeIn id={`${idPrefix}-capacity-intro`} className="solution-capacity-intro">
            <PreSectionTitle title={badge} variant="bg-dark" />
            <h2 className="solution-capacity-title">{title}</h2>
            <p className="solution-capacity-description">{description}</p>
          </FadeIn>

          <div className="solution-capacity-table">
            {rows.map((row, index) => (
              <FadeIn
                key={row.id}
                id={`${idPrefix}-capacity-${row.id}`}
                className={`solution-capacity-row${index === rows.length - 1 ? ' last' : ''}`}
                delay={index * 60}
              >
                <h3 className="solution-capacity-row-title">{row.title}</h3>
                <ol className="solution-capacity-row-list">
                  {row.items.map((item) => (
                    <li key={item} className="solution-capacity-row-item">
                      {item}
                    </li>
                  ))}
                </ol>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
