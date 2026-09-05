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

  useHorizontalScroll(scrollRef, {
    enableWheel: false,
  })

  return (
    <section
      id={id ?? `${idPrefix}-washing-processes`}
      className="il-washing-processes"
    >
      <div className="il-washing-processes__main">
        {/* Header */}

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

        {/* Processes */}

        <div
          ref={scrollRef}
          className="il-washing-processes__scroll"
        >
          <div
            className="il-washing-processes__track"
            data-solution-animate-group
          >
            {items.map((item) => {
              if (item.featured) {
                return (
                  <article
                    key={item.id}
                    id={`${idPrefix}-washing-process-${item.id}`}
                    className="
                      il-washing-processes__card
                      il-washing-processes__card--featured
                    "
                    data-solution-animate="tilt-card"
                  >
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      width={620}
                      height={500}
                      loading="lazy"
                      draggable={false}
                      className="il-washing-processes__featured-image"
                    />

                    <div
                      className="il-washing-processes__featured-overlay"
                      aria-hidden="true"
                    />

                    <span className="il-washing-processes__number il-washing-processes__number--featured">
                      {item.number}
                    </span>

                    <div className="il-washing-processes__featured-content">
                      <h3 className="il-washing-processes__featured-title">
                        {item.title}
                      </h3>

                      <p className="il-washing-processes__featured-description">
                        {item.description}
                      </p>
                    </div>
                  </article>
                )
              }

              return (
                <article
                  key={item.id}
                  id={`${idPrefix}-washing-process-${item.id}`}
                  className="il-washing-processes__card"
                  data-solution-animate="tilt-card"
                >
                  <div className="il-washing-processes__image-area">
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      width={400}
                      height={350}
                      loading="lazy"
                      draggable={false}
                      className="il-washing-processes__image"
                    />

                    <span className="il-washing-processes__number">
                      {item.number}
                    </span>
                  </div>

                  <div className="il-washing-processes__content">
                    <h3 className="il-washing-processes__card-title">
                      {item.title}
                    </h3>

                    <p className="il-washing-processes__card-description">
                      {item.description}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>

      <SectionLines border="grey" />
    </section>
  )
}