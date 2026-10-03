import {
  useEffect,
  useRef,
  useState,
} from 'react'

import { careerLifeAt } from '../../data/career/content'
import { useMomentumCarousel } from '../../hooks/useMomentumCarousel'
import { FadeIn } from '../ui/FadeIn'

const AUTOPLAY_INTERVAL_MS = 4000

export function CareerLifeSection() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isPointerDown, setIsPointerDown] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const { title, subtitle, cards } = careerLifeAt

  const { goToIndex, positionCount } = useMomentumCarousel(viewportRef, trackRef, {
    onActiveIndexChange: setActiveIndex,
  })
  const visibleCardCount = cards.length - positionCount + 1
  const isPaused = isHovered || isFocused || isPointerDown

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!isPointerDown) return
    const release = () => setIsPointerDown(false)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    return () => {
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
  }, [isPointerDown])

  // Restarts whenever the position changes, so a swipe or dot click gets a full interval.
  useEffect(() => {
    if (positionCount < 2 || isPaused || prefersReducedMotion) return
    const timer = window.setTimeout(() => goToIndex((activeIndex + 1) % positionCount), AUTOPLAY_INTERVAL_MS)
    return () => window.clearTimeout(timer)
  }, [activeIndex, goToIndex, isPaused, positionCount, prefersReducedMotion])

  return (
    <section
      className="career-life-section"
      aria-labelledby="career-life-title"
      onFocusCapture={(event) => {
        if (event.target instanceof HTMLElement && event.target.closest('.career-life-carousel, .career-life-carousel-controls')) setIsFocused(true)
      }}
      onBlurCapture={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
        setIsFocused(false)
      }}
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
        className="career-life-carousel"
        onPointerEnter={(event) => event.pointerType === 'mouse' && setIsHovered(true)}
        onPointerLeave={(event) => event.pointerType === 'mouse' && setIsHovered(false)}
        onPointerDown={() => setIsPointerDown(true)}
      >
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
            id="career-life-track"
            className="career-life-track"
          >
            {cards.map((card, index) => (
              <article
                key={card.id}
                id={card.id}
                className="career-life-card"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${cards.length}`}
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
                  style={{ objectPosition: card.imagePosition }}
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
      </div>

      {/* ================================
          CAROUSEL CONTROLS
      ================================= */}
      {positionCount > 1 && (
        <div
          className="career-life-carousel-controls"
          role="group"
          aria-label="Life at Dekko carousel navigation"
        >
          {Array.from({ length: positionCount }, (_, index) => {
            const isActive =
              index === activeIndex

            return (
              <button
                key={index}
                type="button"
                aria-current={isActive ? 'true' : undefined}
                aria-controls="career-life-track"
                aria-label={`Show cards ${index + 1} to ${index + visibleCardCount} of ${cards.length}`}
                className={`career-life-carousel-control${isActive ? ' is-active' : ''
                  }`}
                onClick={() => goToIndex(index)}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}
