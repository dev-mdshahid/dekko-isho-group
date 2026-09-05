import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'

import { FadeIn } from './FadeIn'
import { PreSectionTitle } from './PreSectionTitle'
import { SectionLines } from './SectionDecor'

const CAROUSEL_INTERVAL_MS = 4200
const SWIPE_THRESHOLD_PX = 45
const FALLBACK_IMAGE = 'https://placehold.co/600x400/red/white'

export type SplitFeatureListItem = {
  id: string
  title: string
  description: string
  icon?: string
  image?: string
  imageAlt?: string
}

export type SplitFeatureListSectionProps = {
  badge: string
  title: string
  description: string
  items: SplitFeatureListItem[]
  id?: string
  className?: string
  variant?: 'list' | 'carousel'
}

export function SplitFeatureListSection({
  badge,
  title,
  description,
  items,
  id,
  className,
  variant = 'list',
}: SplitFeatureListSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [autoplayKey, setAutoplayKey] = useState(0)
  const pointerStartX = useRef<number | null>(null)
  const hasIcons = items.some((item) => Boolean(item.icon))
  const isCarousel = variant === 'carousel' && items.length > 0
  const hasMultipleSlides = isCarousel && items.length > 1

  const goTo = useCallback(
    (index: number) => {
      if (!items.length) return
      setActiveIndex(((index % items.length) + items.length) % items.length)
      setAutoplayKey((key) => key + 1)
    },
    [items.length],
  )

  const goPrevious = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  useEffect(() => {
    if (!isCarousel) return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)
    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [isCarousel])

  useEffect(() => {
    if (!hasMultipleSlides || isPaused || prefersReducedMotion) return

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % items.length)
    }, CAROUSEL_INTERVAL_MS)
    return () => window.clearInterval(interval)
  }, [autoplayKey, hasMultipleSlides, isPaused, items.length, prefersReducedMotion])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrevious()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
    }
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary) return
    pointerStartX.current = event.clientX
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null || !event.isPrimary) return
    const distance = event.clientX - pointerStartX.current
    pointerStartX.current = null

    if (Math.abs(distance) < SWIPE_THRESHOLD_PX) return
    if (distance > 0) goPrevious()
    else goNext()
  }

  const sectionClassName = [
    'split-feature-list-section',
    isCarousel ? 'split-feature-list-section--carousel' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section id={id} className={sectionClassName}>
      <div className="split-feature-list-container">
        <div className="split-feature-list-layout">
          <FadeIn
            id={`${id ?? 'split-feature'}-intro`}
            className="split-feature-list-intro"
            variant="slide-in-bottom"
          >
            <PreSectionTitle title={badge} />
            <h2 className="split-feature-list-title">{title}</h2>
            <p className="split-feature-list-description">{description}</p>

            {isCarousel && hasMultipleSlides ? (
              <div
                className="split-feature-list-carousel-dots"
                role="tablist"
                aria-label="Digital product development slides"
              >
                {items.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    aria-controls={`${id ?? 'split-feature'}-slide-${item.id}`}
                    aria-label={`Show ${item.title}, slide ${index + 1} of ${items.length}`}
                    className={`split-feature-list-carousel-dot${index === activeIndex ? ' is-active' : ''}`}
                    onClick={() => goTo(index)}
                  />
                ))}
              </div>
            ) : null}
          </FadeIn>

          {isCarousel ? (
            <FadeIn
              id={`${id ?? 'split-feature'}-items`}
              className="split-feature-list-carousel"
              delay={60}
              variant="slide-in-bottom"
            >
              <div
                className="split-feature-list-carousel-viewport"
                role="region"
                aria-roledescription="carousel"
                aria-label="Digital product development capabilities"
                aria-live="polite"
                aria-atomic="true"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onFocusCapture={() => setIsPaused(true)}
                onBlurCapture={(event) => {
                  if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
                  setIsPaused(false)
                }}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => {
                  pointerStartX.current = null
                }}
              >
                {items.map((item, index) => (
                  <article
                    key={item.id}
                    id={`${id ?? 'split-feature'}-slide-${item.id}`}
                    className={`split-feature-list-carousel-slide${index === activeIndex ? ' is-active' : ''}`}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${items.length}`}
                    aria-hidden={index !== activeIndex}
                  >
                    <img
                      src={item.image ?? FALLBACK_IMAGE}
                      alt={item.imageAlt ?? `${item.title} capability`}
                      className="split-feature-list-carousel-image"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      draggable={false}
                    />
                    <div className="split-feature-list-carousel-overlay">
                      {item.icon ? (
                        <img
                          src={item.icon}
                          alt=""
                          className="split-feature-list-carousel-icon"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="split-feature-list-carousel-copy">
                        <h3 className="split-feature-list-carousel-title">{item.title}</h3>
                        <p className="split-feature-list-carousel-description">{item.description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </FadeIn>
          ) : (
            <FadeIn
              id={`${id ?? 'split-feature'}-items`}
              className={`split-feature-list-items${hasIcons ? ' split-feature-list-items--with-icons' : ''}`}
              delay={60}
              variant="slide-in-bottom"
            >
              {items.map((item) => (
                <div key={item.id} className="split-feature-list-item">
                  {hasIcons ? (
                    <div className="split-feature-list-item-icon-wrap" aria-hidden="true">
                      {item.icon ? (
                        <img src={item.icon} alt="" className="split-feature-list-item-icon" />
                      ) : null}
                    </div>
                  ) : null}
                  <h3 className="split-feature-list-item-title">{item.title}</h3>
                  <p className="split-feature-list-item-description">{item.description}</p>
                </div>
              ))}
            </FadeIn>
          )}
        </div>
      </div>
      <SectionLines border="grey" />
    </section>
  )
}
