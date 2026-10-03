import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { SectionLines } from '../ui/SectionDecor'

// const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/red/white'

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
  const { id, badge, title, description, items } = content
  const featuredItem = items.find((item) => item.featured) ?? items[0]
  const secondaryItems = items.filter((item) => item !== featuredItem)
  const leadItem = secondaryItems[0]
  const cardItems = secondaryItems.slice(1)

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
              <img
                className="il-washing-processes__visual-image"
                src={"/images/industrial-laundry/garment_dyeing.png"}
                alt=""
              />
              <div className="il-washing-processes__visual-overlay" />
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
            <article
              id={`${idPrefix}-washing-process-${leadItem.id}`}
              className="il-washing-processes__lead"
              data-solution-animate="card"
            >
              <img
                className="il-washing-processes__visual-image"
                src={"/images/industrial-laundry/denim_wash.png"}
                alt=""
              />
              <div className="il-washing-processes__visual-overlay" />
              <div className="il-washing-processes__lead-copy">
                <h3 className="il-washing-processes__lead-title">
                  {leadItem.title}
                </h3>
                <p className="il-washing-processes__lead-description">
                  {leadItem.description}
                </p>
              </div>

              {cardItems.length > 0 && (
                <div className="il-washing-processes__cards">
                  {cardItems.map((item) => (
                    <article
                      key={item.id}
                      id={`${idPrefix}-washing-process-${item.id}`}
                      className="il-washing-processes__card"
                      data-solution-animate="card"
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
              )}
            </article>
          )}
        </div>
      </div>

      <SectionLines border="grey" />
    </section>
  )
}
