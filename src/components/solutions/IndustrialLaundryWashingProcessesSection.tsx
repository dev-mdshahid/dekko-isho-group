import { useRef } from 'react'

import { useHorizontalScroll } from '../../hooks/useHorizontalScroll'

import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { SectionLines } from '../ui/SectionDecor'

type WashingProcessItem = {
  id: string
  number: string
  title: string
  description: string
  image: string
  imageAlt: string
  featured?: boolean
}

export type IndustrialLaundryWashingProcessesContent = {
  id?: string
  badge: string
  title: string
  description: string
  items: WashingProcessItem[]
}

type IndustrialLaundryWashingProcessesSectionProps = {
  idPrefix: string
  content: IndustrialLaundryWashingProcessesContent
}

export function IndustrialLaundryWashingProcessesSection({
  idPrefix,
  content,
}: IndustrialLaundryWashingProcessesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const { id, badge, title, description, items } = content
  const featuredItem = items.find((item) => item.featured) ?? items[0]
  const secondaryItems = items.filter((item) => item !== featuredItem)
  const leadItem = secondaryItems[0]
  const cardItems = secondaryItems.slice(1)

  useHorizontalScroll(scrollRef, {
    enableWheel: false,
  })

  return (
    <section
      id={id ?? `${idPrefix}-washing-processes`}
      className="il-washing-processes"
    >
      <div className="il-washing-processes__main">
        <FadeIn
          id={`${idPrefix}-washing-processes-header`}
          className="il-washing-processes__header"
          variant="slide-in-bottom"
        >
          <PreSectionTitle title={badge} />

          <h2 className="section-title il-washing-processes__title">
            {title}
          </h2>

          <p className="il-washing-processes__description">
            {description}
          </p>
        </FadeIn>

        <div
          className="il-washing-processes__groups"
          data-solution-animate-group
        >
          {featuredItem && (
            <article
              id={`${idPrefix}-washing-process-${featuredItem.id}`}
              className="il-washing-processes__feature"
              data-solution-animate="card"
            >
              <div className="il-washing-processes__feature-copy">
                <h3 className="il-washing-processes__feature-title">
                  {featuredItem.title}
                </h3>
                <p className="il-washing-processes__feature-description">
                  {featuredItem.description}
                </p>
              </div>
            </article>
          )}

          {leadItem && (
            <div
              className="il-washing-processes__secondary-group"
              data-solution-animate="card"
            >
              <article
                id={`${idPrefix}-washing-process-${leadItem.id}`}
                className="il-washing-processes__lead"
              >
                <div className="il-washing-processes__lead-copy">
                  <h3 className="il-washing-processes__lead-title">
                    {leadItem.title}
                  </h3>
                  <p className="il-washing-processes__lead-description">
                    {leadItem.description}
                  </p>
                </div>
              </article>

              {cardItems.length > 0 && (
                <div
                  ref={scrollRef}
                  className="il-washing-processes__cards-scroll"
                  role="region"
                  aria-label="Additional washing processes"
                  tabIndex={0}
                >
                  <div className="il-washing-processes__cards">
                    {cardItems.map((item) => (
                      <article
                        key={item.id}
                        id={`${idPrefix}-washing-process-${item.id}`}
                        className="il-washing-processes__card"
                      >
                        <h3 className="il-washing-processes__card-title">
                          {item.title}
                        </h3>
                        <p className="il-washing-processes__card-description">
                          {item.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <SectionLines border="grey" />
    </section>
  )
}
