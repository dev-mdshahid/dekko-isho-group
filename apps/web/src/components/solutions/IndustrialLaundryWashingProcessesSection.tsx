import { useEffect, useRef, useState } from 'react'

import { useHorizontalScroll } from '../../hooks/useHorizontalScroll'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { SectionLines } from '../ui/SectionDecor'

// const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/red/white'

const CARDS_AUTOPLAY_MS = 3500

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
  const cardsScrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const { id, badge, title, description, items } = content
  const featuredItem = items.find((item) => item.featured) ?? items[0]
  const secondaryItems = items.filter((item) => item !== featuredItem)
  const leadItem = secondaryItems[0]
  const cardItems = secondaryItems.slice(1)

  useHorizontalScroll(cardsScrollRef, { enableWheel: false })

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMobile = () => setIsMobile(mobileQuery.matches)
    const updateMotion = () => setPrefersReducedMotion(motionQuery.matches)
    updateMobile()
    updateMotion()
    mobileQuery.addEventListener('change', updateMobile)
    motionQuery.addEventListener('change', updateMotion)
    return () => {
      mobileQuery.removeEventListener('change', updateMobile)
      motionQuery.removeEventListener('change', updateMotion)
    }
  }, [])

  useEffect(() => {
    if (!isMobile || cardItems.length < 2 || isPaused || prefersReducedMotion) return

    const viewport = cardsScrollRef.current
    if (!viewport) return

    const timer = window.setInterval(() => {
      const cards = viewport.querySelectorAll<HTMLElement>('.il-washing-processes__card')
      if (cards.length < 2) return

      const maxScroll = viewport.scrollWidth - viewport.clientWidth
      if (maxScroll <= 0) return

      const cardWidth = cards[0].offsetWidth
      const styles = getComputedStyle(viewport)
      const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0
      const step = cardWidth + gap
      const nextLeft = viewport.scrollLeft + step
      const target =
        nextLeft >= maxScroll - 2 ? 0 : Math.min(nextLeft, maxScroll)

      viewport.scrollTo({ left: target, behavior: 'smooth' })
    }, CARDS_AUTOPLAY_MS)

    return () => window.clearInterval(timer)
  }, [cardItems.length, isMobile, isPaused, prefersReducedMotion])

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
                <div
                  ref={cardsScrollRef}
                  className="il-washing-processes__cards-scroll"
                  tabIndex={0}
                  role="region"
                  aria-roledescription="carousel"
                  aria-label={`${leadItem.title} finishes`}
                  onPointerEnter={(event) => {
                    if (event.pointerType === 'mouse') setIsPaused(true)
                  }}
                  onPointerLeave={(event) => {
                    if (event.pointerType === 'mouse') setIsPaused(false)
                  }}
                  onPointerDown={() => setIsPaused(true)}
                  onPointerUp={() => setIsPaused(false)}
                  onPointerCancel={() => setIsPaused(false)}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                >
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
