import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { careerLifeAt } from '../../data/career/content'
import { useMomentumCarousel } from '../../hooks/useMomentumCarousel'
import { FadeIn } from '../ui/FadeIn'

export function CareerLifeSection() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const [activeIndex, setActiveIndex] = useState(0)

  const { title, subtitle, cards } = careerLifeAt

  useMomentumCarousel(viewportRef, trackRef)

  /**
   * Find which card is currently closest
   * to the center of the carousel.
   *
   * This keeps the controller dots synced
   * when the user drags / scrolls manually.
   */
  const updateActiveCard = useCallback(() => {
    const viewport = viewportRef.current
    const track = trackRef.current

    if (!viewport || !track) return

    const cardElements = Array.from(
      track.querySelectorAll<HTMLElement>('.career-life-card'),
    )

    if (!cardElements.length) return

    const viewportRect = viewport.getBoundingClientRect()
    const viewportCenter =
      viewportRect.left + viewportRect.width / 2

    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    cardElements.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect()
      const cardCenter =
        cardRect.left + cardRect.width / 2

      const distance = Math.abs(
        viewportCenter - cardCenter,
      )

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    setActiveIndex(closestIndex)
  }, [])

  /**
   * Keep active controller synced
   * with native / momentum scrolling.
   */
  useEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) return

    let animationFrame: number | null = null

    const handleScroll = () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame)
      }

      animationFrame = requestAnimationFrame(() => {
        updateActiveCard()
      })
    }

    viewport.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    window.addEventListener('resize', handleScroll)

    // Set the correct initial active card.
    updateActiveCard()

    return () => {
      viewport.removeEventListener(
        'scroll',
        handleScroll,
      )

      window.removeEventListener(
        'resize',
        handleScroll,
      )

      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [updateActiveCard])

  /**
   * Scroll to a specific card
   * when a controller dot is clicked.
   */
  const goToCard = useCallback(
    (index: number) => {
      const viewport = viewportRef.current
      const track = trackRef.current

      if (!viewport || !track) return

      const cardElements = Array.from(
        track.querySelectorAll<HTMLElement>(
          '.career-life-card',
        ),
      )

      const targetCard = cardElements[index]

      if (!targetCard) return

      /**
       * Position target card roughly
       * in the center of the viewport.
       */
      const targetLeft =
        targetCard.offsetLeft -
        (viewport.clientWidth -
          targetCard.offsetWidth) /
        2

      viewport.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: 'smooth',
      })

      setActiveIndex(index)
    },
    [],
  )

  return (
    <section
      className="career-life-section"
      aria-labelledby="career-life-title"
    >
      {/* ================================
          HEADER
      ================================= */}
      <div className="career-content-container">
        <FadeIn
          id="career-life-header"
          className="career-life-header"
        >
          <h2
            id="career-life-title"
            className="career-life-title"
          >
            {title}
          </h2>

          <p className="career-life-subtitle">
            {subtitle}
          </p>
        </FadeIn>
      </div>

      {/* ================================
          CAROUSEL
      ================================= */}
      <div
        ref={viewportRef}
        className="career-life-scroll"
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
        tabIndex={0}
      >
        <div
          ref={trackRef}
          className="career-life-track"
        >
          {cards.map((card, index) => (
            <article
              key={card.id}
              id={card.id}
              className="career-life-card"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${cards.length
                }`}
            >
              <img
                src={card.image}
                alt={card.imageAlt}
                width={480}
                height={720}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="career-life-card-image"
              />

              <div
                className="career-life-card-overlay"
                aria-hidden="true"
              />

              <div className="career-life-card-content">
                <h3 className="career-life-card-title">
                  {card.title}
                </h3>

                <p className="career-life-card-description">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ================================
          CAROUSEL CONTROLS
      ================================= */}
      {cards.length > 1 && (
        <div
          className="career-life-carousel-controls"
          role="tablist"
          aria-label="Life at Dekko carousel navigation"
        >
          {cards.map((card, index) => {
            const isActive =
              index === activeIndex

            return (
              <button
                key={card.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={card.id}
                aria-label={`Go to ${card.title}`}
                className={`career-life-carousel-control${isActive ? ' is-active' : ''
                  }`}
                onClick={() => goToCard(index)}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}