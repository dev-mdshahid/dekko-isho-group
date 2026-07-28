import { useRef } from 'react'

import { useHorizontalScroll } from '../../hooks/useHorizontalScroll'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export type SolutionCapabilityCardItem = {
  id: string
  title: string
  image: string
  imageAlt: string
}

export type SolutionCapabilityCardsContent = {
  id?: string
  badge: string
  title: string
  titleBefore?: string
  titleAccent?: string
  titleAfter?: string
  description: string
  items: SolutionCapabilityCardItem[]
}

type SolutionCapabilityCardsSectionProps = {
  idPrefix: string
  content: SolutionCapabilityCardsContent
  /** Fallback section id segment when content.id is omitted */
  sectionKey?: string
}

export function SolutionCapabilityCardsSection({
  idPrefix,
  content,
  sectionKey = 'capability-cards',
}: SolutionCapabilityCardsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { id, badge, title, titleBefore, titleAccent, titleAfter, description, items } = content
  useHorizontalScroll(scrollRef, { enableWheel: false })

  const hasAccentTitle = Boolean(titleBefore && titleAccent)

  return (
    <section id={id ?? `${idPrefix}-${sectionKey}`} className="solution-capability-cards-section">
      <div className="solution-capability-cards-main">
        <FadeIn
          id={`${idPrefix}-${sectionKey}-header`}
          className="solution-capability-cards-header"
          variant="slide-in-bottom"
        >
          <PreSectionTitle title={badge} />
          <h2 className="section-title solution-capability-cards-title">
            {hasAccentTitle ? (
              <>
                {titleBefore}{' '}
                <span className="solution-capability-cards-title-accent">{titleAccent}</span>
                {titleAfter ? ` ${titleAfter}` : null}
              </>
            ) : (
              title
            )}
          </h2>
          <p className="solution-capability-cards-description">{description}</p>
        </FadeIn>

        <div ref={scrollRef} className="solution-capability-cards-scroll">
          <div className="solution-capability-cards-track" data-solution-animate-group>
            {items.map((item) => (
              <div
                key={item.id}
                id={`${idPrefix}-${sectionKey}-${item.id}`}
                className="solution-capability-cards-card"
                data-solution-animate="tilt-card"
              >
                <img
                  src={item.image}
                  loading="lazy"
                  alt={item.imageAlt}
                  width={400}
                  height={350}
                  draggable={false}
                  className="solution-capability-cards-card-image"
                />
                <div className="solution-capability-cards-card-overlay" aria-hidden="true" />
                <h3 className="solution-capability-cards-card-title">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
