import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export type SolutionSustainableTechItem = {
  id: string
  number: string
  title: string
  image: string
  imageAlt: string
}

export type SolutionSustainableTechContent = {
  id?: string
  title: string
  description: string
  items: SolutionSustainableTechItem[]
}

type SolutionSustainableTechSectionProps = {
  idPrefix: string
  content: SolutionSustainableTechContent
}

export function SolutionSustainableTechSection({
  idPrefix,
  content,
}: SolutionSustainableTechSectionProps) {
  const { id, title, description, items } = content

  return (
    <section
      id={id ?? `${idPrefix}-sustainable-tech`}
      className="solution-sustainable-tech-section"
    >
      <div className="solution-sustainable-tech-container">
        <FadeIn
          id={`${idPrefix}-sustainable-tech-header`}
          className="solution-sustainable-tech-header"
          variant="slide-in-bottom"
        >
          <h2 className="solution-sustainable-tech-title">{title}</h2>
          <p className="solution-sustainable-tech-description">{description}</p>
        </FadeIn>

        <div className="solution-sustainable-tech-grid" data-solution-animate-group>
          {items.map((item) => (
            <div
              key={item.id}
              id={`${idPrefix}-sustainable-tech-${item.id}`}
              className="solution-sustainable-tech-card"
              data-solution-animate="tilt-card"
            >
              <div className="solution-sustainable-tech-card-media">
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  loading="lazy"
                  width={494}
                  height={320}
                  className="solution-sustainable-tech-card-image"
                />
                <span className="solution-sustainable-tech-card-number">{item.number}</span>
              </div>
              <div className="solution-sustainable-tech-card-body">
                <h3 className="solution-sustainable-tech-card-title">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
