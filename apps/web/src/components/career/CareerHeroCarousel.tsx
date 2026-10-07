import { useCallback, useEffect, useRef, useState } from 'react'

import type { CareerHeroCarouselSlide } from '../../data/career/content'
import { CarouselArrow } from '../ui/CarouselArrow'

const SLIDE_INTERVAL_MS = 2500
const SWIPE_THRESHOLD_PX = 45
const DRAG_THRESHOLD_PX = 8

type Props = {
  images: CareerHeroCarouselSlide[]
}

export function CareerHeroCarousel({ images }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const activeIndexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isPointerActive, setIsPointerActive] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [autoplayKey, setAutoplayKey] = useState(0)
  const hasMultiple = images.length > 1
  const isPaused = isHovered || isFocused || isPointerActive

  activeIndexRef.current = activeIndex

  const advance = useCallback(() => {
    setActiveIndex((index) => (index + 1) % images.length)
  }, [images.length])

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % images.length) + images.length) % images.length)
      setAutoplayKey((key) => key + 1)
    },
    [images.length],
  )

  const goPrev = useCallback(() => {
    goTo(activeIndexRef.current - 1)
  }, [goTo])

  const goNext = useCallback(() => {
    goTo(activeIndexRef.current + 1)
  }, [goTo])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!hasMultiple || isPaused || prefersReducedMotion) return

    const interval = window.setInterval(advance, SLIDE_INTERVAL_MS)
    return () => window.clearInterval(interval)
  }, [advance, autoplayKey, hasMultiple, isPaused, prefersReducedMotion])

  useEffect(() => {
    const root = rootRef.current
    if (!root || !hasMultiple) return

    let activePointerId: number | null = null
    let isPointerDown = false
    let isDragging = false
    let startX = 0

    const endPointer = (event: PointerEvent) => {
      if (!isPointerDown || event.pointerId !== activePointerId) return

      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', endPointer)
      document.removeEventListener('pointercancel', endPointer)

      const deltaX = event.clientX - startX

      if (isDragging) {
        if (root.hasPointerCapture(event.pointerId)) {
          root.releasePointerCapture(event.pointerId)
        }
        root.classList.remove('is-dragging')

        if (Math.abs(deltaX) >= SWIPE_THRESHOLD_PX) {
          if (deltaX > 0) {
            goPrev()
          } else {
            goNext()
          }
        }
      }

      isPointerDown = false
      isDragging = false
      activePointerId = null
      setIsPointerActive(false)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!isPointerDown || event.pointerId !== activePointerId) return

      const deltaX = event.clientX - startX

      if (!isDragging) {
        if (Math.abs(deltaX) <= DRAG_THRESHOLD_PX) return
        isDragging = true
        root.classList.add('is-dragging')
        root.setPointerCapture(event.pointerId)
        window.getSelection()?.removeAllRanges()
      }

      event.preventDefault()
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      if (
        (event.target as HTMLElement).closest(
          '.career-hero-carousel__arrow, .career-hero-carousel__dots',
        )
      ) {
        return
      }

      isPointerDown = true
      isDragging = false
      activePointerId = event.pointerId
      startX = event.clientX
      setIsPointerActive(true)

      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', endPointer)
      document.addEventListener('pointercancel', endPointer)
    }

    const onDragStart = (event: DragEvent) => {
      event.preventDefault()
    }

    const onSelectStart = (event: Event) => {
      event.preventDefault()
    }

    root.addEventListener('pointerdown', onPointerDown)
    root.addEventListener('dragstart', onDragStart)
    root.addEventListener('selectstart', onSelectStart)

    return () => {
      root.removeEventListener('pointerdown', onPointerDown)
      root.removeEventListener('dragstart', onDragStart)
      root.removeEventListener('selectstart', onSelectStart)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', endPointer)
      document.removeEventListener('pointercancel', endPointer)
      root.classList.remove('is-dragging')
      setIsPointerActive(false)
    }
  }, [goNext, goPrev, hasMultiple])

  if (!hasMultiple) {
    const image = images[0]
    return (
      <div className="career-hero-carousel">
        <img
          src={image.src}
          alt={image.alt}
          loading="eager"
          decoding="async"
          className="career-hero-carousel__image is-active"
        />
      </div>
    )
  }

  return (
    <div
      ref={rootRef}
      className="career-hero-carousel carousel-arrow-host"
      role="region"
      aria-roledescription="carousel"
      aria-label="Life at Dekko ISHO. Drag left or right to browse."
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
        setIsFocused(false)
      }}
    >
      {images.map((image, index) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className={`career-hero-carousel__image${index === activeIndex ? ' is-active' : ''}`}
          aria-hidden={index !== activeIndex}
          draggable={false}
        />
      ))}

      <CarouselArrow
        direction="previous"
        label="Previous image"
        className="career-hero-carousel__arrow career-hero-carousel__arrow--prev"
        onClick={goPrev}
      />
      <CarouselArrow
        direction="next"
        label="Next image"
        className="career-hero-carousel__arrow career-hero-carousel__arrow--next"
        onClick={goNext}
      />

      <div className="career-hero-carousel__dots" role="tablist" aria-label="Carousel slides">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Show image ${index + 1} of ${images.length}`}
            className={`career-hero-carousel__dot${index === activeIndex ? ' is-active' : ''}`}
            onClick={(event) => {
              goTo(index)
              if (event.detail > 0) event.currentTarget.blur()
            }}
          />
        ))}
      </div>
    </div>
  )
}
