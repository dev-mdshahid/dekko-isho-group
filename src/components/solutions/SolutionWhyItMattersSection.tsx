import { Check } from 'lucide-react'

import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export type SolutionWhyItMattersItem = {
  id: string
  title: string
  description: string
}

export type SolutionWhyItMattersContent = {
  id?: string
  badge?: string
  title: string
  description: string
  items: SolutionWhyItMattersItem[]
}

type SolutionWhyItMattersSectionProps = {
  idPrefix: string
  content: SolutionWhyItMattersContent
}

export function SolutionWhyItMattersSection({
  idPrefix,
  content,
}: SolutionWhyItMattersSectionProps) {
  const { id, badge, title, description, items } = content

  return (
    <section id={id} className="solution-why-it-matters-section">
      <div className="solution-why-it-matters-container">
        <div className="solution-why-it-matters-layout">
          <FadeIn id={`${idPrefix}-why-intro`} className="solution-why-it-matters-intro">
            {badge ? <PreSectionTitle title={badge} /> : null}
            <h2 className="solution-why-it-matters-title">{title}</h2>
            <p className="solution-why-it-matters-description">{description}</p>
          </FadeIn>

          <div className="solution-why-it-matters-list">
            {items.map((item, index) => (
              <FadeIn
                key={item.id}
                id={`${idPrefix}-why-${item.id}`}
                className="solution-why-it-matters-item"
                delay={index * 40}
              >
                <Check
                  className="solution-why-it-matters-icon"
                  aria-hidden="true"
                  strokeWidth={2.5}
                />
                <div className="solution-why-it-matters-item-copy">
                  <h3 className="solution-why-it-matters-item-title">{item.title}</h3>
                  <p className="solution-why-it-matters-item-description">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
