import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
} from 'react'

import { CarouselArrow } from './CarouselArrow'
import { FadeIn } from './FadeIn'
import { PreSectionTitle } from './PreSectionTitle'
import { SectionLines } from './SectionDecor'

const CAROUSEL_INTERVAL_MS = 2000
const CAROUSEL_SLIDE_MS = 600
const SWIPE_THRESHOLD_PX = 45
const FALLBACK_IMAGE = 'https://placehold.co/600x400/red/white'
type SlideDirection = 'forward' | 'backward'

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
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)
  const [isFocusWithin, setIsFocusWithin] = useState(false)
  const [isPointerActive, setIsPointerActive] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [autoplayKey, setAutoplayKey] = useState(0)
  const [slideEpoch, setSlideEpoch] = useState(0)
  const [slideDirection, setSlideDirection] =
    useState<SlideDirection>('forward')

  const pointerStartX = useRef<number | null>(null)
  const activePointerId = useRef<number | null>(null)
  const isDraggingRef = useRef(false)
  const suppressNextClick = useRef(false)
  const activeIndexRef = useRef(0)

  activeIndexRef.current = activeIndex

  const hasIcons = items.some((item) => Boolean(item.icon))
  const isCarousel = variant === 'carousel' && items.length > 0
  const hasMultipleSlides = isCarousel && items.length > 1

  const baseId = id ?? 'split-feature'

  const resolveDirection = useCallback(
    (currentIndex: number, nextIndex: number): SlideDirection => {
      // Index-only wrap detection is ambiguous with exactly 2 slides
      // (0→1 and 1→0 are both adjacent and wrap transitions). Prefer an
      // explicit direction from goNext/goPrevious; fall back to index order
      // for dot jumps.
      if (items.length === 2) {
        return nextIndex < currentIndex ? 'backward' : 'forward'
      }

      const wrappingForward =
        currentIndex === items.length - 1 && nextIndex === 0
      const wrappingBackward =
        currentIndex === 0 && nextIndex === items.length - 1

      if (wrappingBackward) return 'backward'
      if (wrappingForward) return 'forward'
      return nextIndex < currentIndex ? 'backward' : 'forward'
    },
    [items.length],
  )

  const goTo = useCallback(
    (
      index: number,
      options?: { fromAutoplay?: boolean; direction?: SlideDirection },
    ) => {
      if (!items.length) return

      const nextIndex =
        ((index % items.length) + items.length) % items.length
      const currentIndex = activeIndexRef.current

      if (nextIndex === currentIndex) return

      setSlideDirection(
        options?.direction ??
          resolveDirection(currentIndex, nextIndex),
      )
      // One atomic update — never clear previousIndex first (that flashed the
      // current slide alone during continuous swipes).
      if (prefersReducedMotion) {
        setPreviousIndex(null)
        setActiveIndex(nextIndex)
      } else {
        setPreviousIndex(currentIndex)
        setActiveIndex(nextIndex)
        setSlideEpoch((epoch) => epoch + 1)
      }
      if (!options?.fromAutoplay) {
        setAutoplayKey((key) => key + 1)
      }
    },
    [items.length, prefersReducedMotion, resolveDirection],
  )

  const goPrevious = useCallback(() => {
    goTo(activeIndexRef.current - 1, { direction: 'backward' })
  }, [goTo])

  const goNext = useCallback((options?: { fromAutoplay?: boolean }) => {
    goTo(activeIndexRef.current + 1, {
      ...options,
      direction: 'forward',
    })
  }, [goTo])

  useEffect(() => {
    if (previousIndex === null || prefersReducedMotion) {
      return
    }

    const timeout = window.setTimeout(() => {
      setPreviousIndex(null)
    }, CAROUSEL_SLIDE_MS)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [activeIndex, previousIndex, prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) {
      setPreviousIndex(null)
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    if (!isCarousel) return

    const mediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    updatePreference()

    mediaQuery.addEventListener('change', updatePreference)

    return () => {
      mediaQuery.removeEventListener('change', updatePreference)
    }
  }, [isCarousel])

  useEffect(() => {
    if (
      !hasMultipleSlides ||
      isFocusWithin ||
      isPointerActive ||
      prefersReducedMotion
    ) {
      return
    }

    const interval = window.setInterval(() => {
      goNext({ fromAutoplay: true })
    }, CAROUSEL_INTERVAL_MS)

    return () => {
      window.clearInterval(interval)
    }
  }, [
    autoplayKey,
    goNext,
    hasMultipleSlides,
    isFocusWithin,
    isPointerActive,
    prefersReducedMotion,
  ])

  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goPrevious()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      goNext()
    }
  }

  const resetPointerState = (
    target?: HTMLDivElement | null,
    pointerId?: number | null,
  ) => {
    if (
      target &&
      pointerId != null &&
      target.hasPointerCapture(pointerId)
    ) {
      target.releasePointerCapture(pointerId)
    }

    target?.classList.remove('is-dragging')
    pointerStartX.current = null
    activePointerId.current = null
    isDraggingRef.current = false
  }

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (
      !hasMultipleSlides ||
      !event.isPrimary ||
      event.button !== 0
    ) {
      return
    }

    if (
      (event.target as HTMLElement).closest(
        '.split-feature-list-carousel-nav, .split-feature-list-carousel-dots',
      )
    ) {
      return
    }

    suppressNextClick.current = false
    isDraggingRef.current = false
    pointerStartX.current = event.clientX
    activePointerId.current = event.pointerId
    setIsPointerActive(true)
  }

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (
      pointerStartX.current === null ||
      activePointerId.current !== event.pointerId ||
      !event.isPrimary
    ) {
      return
    }

    const distance = event.clientX - pointerStartX.current

    if (!isDraggingRef.current) {
      if (Math.abs(distance) < 8) return

      isDraggingRef.current = true
      event.currentTarget.classList.add('is-dragging')
      event.currentTarget.setPointerCapture(event.pointerId)
      window.getSelection()?.removeAllRanges()
    }

    event.preventDefault()
  }

  const handlePointerUp = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (
      pointerStartX.current === null ||
      activePointerId.current !== event.pointerId ||
      !event.isPrimary
    ) {
      return
    }

    const distance = event.clientX - pointerStartX.current
    const wasDragging = isDraggingRef.current

    resetPointerState(event.currentTarget, event.pointerId)
    setIsPointerActive(false)

    if (!wasDragging || Math.abs(distance) < SWIPE_THRESHOLD_PX) {
      return
    }

    suppressNextClick.current = true

    if (distance > 0) {
      goPrevious()
    } else {
      goNext()
    }
  }

  const handleCarouselClick = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    if (!hasMultipleSlides) return

    if (suppressNextClick.current) {
      suppressNextClick.current = false
      event.preventDefault()
      event.stopPropagation()
      return
    }

    if (
      (event.target as HTMLElement).closest(
        '.split-feature-list-carousel-dots',
      )
    ) {
      return
    }

    goNext()
  }

  const sectionClassName = [
    'split-feature-list-section',
    isCarousel
      ? 'split-feature-list-section--carousel'
      : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section
      id={id}
      className={sectionClassName}
    >
      <div className="split-feature-list-container">
        <div className="split-feature-list-layout">
          {/* LEFT CONTENT */}
          <FadeIn
            id={`${baseId}-intro`}
            className="split-feature-list-intro"
            variant="slide-in-bottom"
          >
            <PreSectionTitle title={badge} />

            <h2 className="split-feature-list-title">
              {title}
            </h2>

            <p className="split-feature-list-description">
              {description}
            </p>
          </FadeIn>

          {/* RIGHT CONTENT */}
          {isCarousel ? (
            <FadeIn
              id={`${baseId}-items`}
              className="split-feature-list-carousel"
              delay={60}
              variant="slide-in-bottom"
            >
              {/*
                The frame creates the diagonal slicing
                on BOTH sides of the carousel.
              */}
              <div className="split-feature-list-carousel-frame">
                <div
                  className={`split-feature-list-carousel-viewport carousel-arrow-host${
                    hasMultipleSlides
                      ? ' is-clickable'
                      : ''
                  }`}
                  role="region"
                  aria-roledescription="carousel"
                  aria-label={`${title} capabilities`}
                  aria-live="polite"
                  aria-atomic="true"
                  tabIndex={0}
                  onKeyDown={handleKeyDown}
                  onFocusCapture={() =>
                    setIsFocusWithin(true)
                  }
                  onBlurCapture={(event) => {
                    if (
                      event.currentTarget.contains(
                        event.relatedTarget as Node | null,
                      )
                    ) {
                      return
                    }

                    setIsFocusWithin(false)
                  }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onClick={handleCarouselClick}
                  onPointerCancel={(event) => {
                    resetPointerState(
                      event.currentTarget,
                      event.pointerId,
                    )
                    suppressNextClick.current = false
                    setIsPointerActive(false)
                  }}
                >
                  {items.map((item, index) => {
                    const isActive = index === activeIndex
                    const isExiting =
                      previousIndex !== null &&
                      index === previousIndex &&
                      !prefersReducedMotion

                    return (
                    <article
                      key={
                        isActive || isExiting
                          ? `${item.id}-${slideEpoch}`
                          : item.id
                      }
                      id={`${baseId}-slide-${item.id}`}
                      className={`split-feature-list-carousel-slide${
                        isActive
                          ? ` is-active is-entering is-entering--${slideDirection}`
                          : ''
                      }${
                        isExiting
                          ? ` is-exiting is-exiting--${slideDirection}`
                          : ''
                      }`}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`${index + 1} of ${
                        items.length
                      }`}
                      aria-hidden={
                        !isActive && !isExiting
                      }
                    >
                      <img
                        src={
                          item.image ??
                          FALLBACK_IMAGE
                        }
                        alt={
                          item.imageAlt ??
                          `${item.title} capability`
                        }
                        className="split-feature-list-carousel-image"
                        loading={
                          index === 0
                            ? 'eager'
                            : 'lazy'
                        }
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
                          <h3 className="split-feature-list-carousel-title">
                            {item.title}
                          </h3>

                          <p className="split-feature-list-carousel-description">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </article>
                    )
                  })}
                  {hasMultipleSlides ? (
                    <div
                      className="split-feature-list-carousel-nav"
                      onPointerDown={(event) => event.stopPropagation()}
                      onPointerUp={(event) => event.stopPropagation()}
                    >
                      <CarouselArrow
                        direction="previous"
                        onClick={(event) => {
                          event.stopPropagation()
                          goPrevious()
                        }}
                      />
                      <CarouselArrow
                        direction="next"
                        onClick={(event) => {
                          event.stopPropagation()
                          goNext()
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              {/*
                Carousel controller sits at the
                bottom-left of the carousel, aligned
                with the slide title and description.
              */}
              {hasMultipleSlides ? (
                <div
                  className="split-feature-list-carousel-dots"
                  role="tablist"
                  aria-label={`${title} slides`}
                >
                  {items.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={
                        index === activeIndex
                      }
                      aria-controls={`${baseId}-slide-${item.id}`}
                      aria-label={`Show ${
                        item.title
                      }, slide ${
                        index + 1
                      } of ${items.length}`}
                      className={`split-feature-list-carousel-dot${
                        index === activeIndex
                          ? ' is-active'
                          : ''
                      }`}
                      onClick={(event) => {
                        event.stopPropagation()
                        goTo(index)
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </FadeIn>
          ) : (
            <FadeIn
              id={`${baseId}-items`}
              className={`split-feature-list-items${
                hasIcons
                  ? ' split-feature-list-items--with-icons'
                  : ''
              }`}
              delay={60}
              variant="slide-in-bottom"
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className="split-feature-list-item"
                >
                  {hasIcons ? (
                    <div
                      className="split-feature-list-item-icon-wrap"
                      aria-hidden="true"
                    >
                      {item.icon ? (
                        <img
                          src={item.icon}
                          alt=""
                          className="split-feature-list-item-icon"
                        />
                      ) : null}
                    </div>
                  ) : null}

                  <h3 className="split-feature-list-item-title">
                    {item.title}
                  </h3>

                  <p className="split-feature-list-item-description">
                    {item.description}
                  </p>
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
