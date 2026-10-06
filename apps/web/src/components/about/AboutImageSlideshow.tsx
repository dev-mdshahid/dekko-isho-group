import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { gsap } from 'gsap'

import { CarouselArrow } from '../ui/CarouselArrow'

const SLIDE_INTERVAL_MS = 3000
const TRANSITION_DURATION = 0.65
const SWIPE_THRESHOLD_PX = 45
const DRAG_THRESHOLD_PX = 8

const ABOUT_SLIDES = [
  {
    src: '/images/about/about-slider/about-slide-10.png',
    alt: 'Colleagues walking through a modern open-plan office at Dekko ISHO Group',
  },
  {
    src: '/images/about/about-slider/about-slide-11.png',
    alt: 'Ecovia sustainable packaging products displayed on a wooden surface',
  },
  {
    src: '/images/about/about-slider/about-slide-12.png',
    alt: 'Garment manufacturing team working at industrial sewing stations',
  },
  {
    src: '/images/about/about-slider/about-slide-13.png',
    alt: 'Craftsperson assembling furniture frames in a woodworking workshop',
  },
  {
    src: '/images/about/about-slider/about-slide-14.png',
    alt: 'Craftsperson assembling furniture frames in a woodworking workshop',
  },
] as const

type SlideDirection = 'next' | 'previous'

type TransitionState = {
  from: number
  to: number
  direction: SlideDirection
}

export function AboutImageSlideshow() {
  const rootRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLImageElement>(null)
  const outgoingRef = useRef<HTMLImageElement>(null)
  const incomingRef = useRef<HTMLImageElement>(null)
  const activeIndexRef = useRef(0)
  const isTransitioningRef = useRef(false)
  const intervalRef = useRef<number | null>(null)
  const isHoveredRef = useRef(false)
  const isFocusWithinRef = useRef(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [transitionState, setTransitionState] = useState<TransitionState | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isInteractionPaused, setIsInteractionPaused] = useState(false)
  const [autoplayEpoch, setAutoplayEpoch] = useState(0)

  const slideCount = ABOUT_SLIDES.length
  const visibleIndex = transitionState?.to ?? activeIndex
  const visibleSlide = ABOUT_SLIDES[visibleIndex]

  const clearAutoplay = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const syncInteractionPause = useCallback(() => {
    setIsInteractionPaused(isHoveredRef.current || isFocusWithinRef.current)
  }, [])

  const completeTransition = useCallback((to: number) => {
    activeIndexRef.current = to
    setActiveIndex(to)
    setTransitionState(null)
    isTransitioningRef.current = false
  }, [])

  const transitionTo = useCallback(
    (nextIndex: number, direction: SlideDirection) => {
      if (isTransitioningRef.current || nextIndex === activeIndexRef.current) return false

      const currentIndex = activeIndexRef.current
      isTransitioningRef.current = true

      if (prefersReducedMotion) {
        gsap.to(mediaRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: 'power1.out',
          onComplete: () => {
            activeIndexRef.current = nextIndex
            setActiveIndex(nextIndex)
            gsap.fromTo(
              mediaRef.current,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.35,
                ease: 'power1.out',
                onComplete: () => {
                  isTransitioningRef.current = false
                },
              },
            )
          },
        })
        return true
      }

      setTransitionState({ from: currentIndex, to: nextIndex, direction })
      return true
    },
    [prefersReducedMotion],
  )

  const resetAutoplayTimer = useCallback(() => {
    setAutoplayEpoch((epoch) => epoch + 1)
  }, [])

  const goToPrevious = useCallback(() => {
    const previousIndex = (activeIndexRef.current - 1 + slideCount) % slideCount
    const didStart = transitionTo(previousIndex, 'previous')
    if (didStart) resetAutoplayTimer()
  }, [resetAutoplayTimer, slideCount, transitionTo])

  const goToNext = useCallback(
    (options?: { fromAutoplay?: boolean }) => {
      const nextIndex = (activeIndexRef.current + 1) % slideCount
      const didStart = transitionTo(nextIndex, 'next')
      if (didStart && !options?.fromAutoplay) resetAutoplayTimer()
    },
    [resetAutoplayTimer, slideCount, transitionTo],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goToPrevious()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        goToNext()
      }
    },
    [goToNext, goToPrevious],
  )

  useEffect(() => {
    const root = rootRef.current
    if (!root || slideCount <= 1) return

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
            goToPrevious()
          } else {
            goToNext()
          }
        }
      }

      isPointerDown = false
      isDragging = false
      activePointerId = null
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!isPointerDown || event.pointerId !== activePointerId) return

      const deltaX = event.clientX - startX

      if (!isDragging) {
        if (Math.abs(deltaX) <= DRAG_THRESHOLD_PX) return
        if (isTransitioningRef.current) {
          isPointerDown = false
          activePointerId = null
          document.removeEventListener('pointermove', onPointerMove)
          document.removeEventListener('pointerup', endPointer)
          document.removeEventListener('pointercancel', endPointer)
          return
        }
        isDragging = true
        root.classList.add('is-dragging')
        root.setPointerCapture(event.pointerId)
        window.getSelection()?.removeAllRanges()
      }

      event.preventDefault()
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || isTransitioningRef.current) return
      if ((event.target as HTMLElement).closest('.about-image-slideshow__nav')) return

      isPointerDown = true
      isDragging = false
      activePointerId = event.pointerId
      startX = event.clientX

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
    }
  }, [goToNext, goToPrevious, slideCount])

  useLayoutEffect(() => {
    if (!transitionState) return

    const outgoing = outgoingRef.current
    const incoming = incomingRef.current
    if (!outgoing || !incoming) return

    const isNext = transitionState.direction === 'next'
    const outgoingExitX = isNext ? '-100%' : '100%'
    const incomingEnterX = isNext ? '100%' : '-100%'

    gsap.set(outgoing, { x: 0 })
    gsap.set(incoming, { x: incomingEnterX })

    const timeline = gsap.timeline({
      onComplete: () => completeTransition(transitionState.to),
    })

    timeline.to(
      outgoing,
      {
        x: outgoingExitX,
        duration: TRANSITION_DURATION,
        ease: 'power2.inOut',
      },
      0,
    )

    timeline.to(
      incoming,
      {
        x: 0,
        duration: TRANSITION_DURATION,
        ease: 'power2.inOut',
      },
      0,
    )

    return () => {
      timeline.kill()
    }
  }, [completeTransition, transitionState])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updateMotionPreference()
    mediaQuery.addEventListener('change', updateMotionPreference)
    return () => mediaQuery.removeEventListener('change', updateMotionPreference)
  }, [])

  useEffect(() => {
    ABOUT_SLIDES.forEach((slide) => {
      const image = new Image()
      image.src = slide.src
    })
  }, [])

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return

    gsap.set(media, { opacity: 1, x: 0 })

    return () => {
      gsap.killTweensOf(media)
    }
  }, [])

  useEffect(() => {
    clearAutoplay()

    if (prefersReducedMotion || isInteractionPaused) return

    intervalRef.current = window.setInterval(() => {
      if (isTransitioningRef.current) return
      goToNext({ fromAutoplay: true })
    }, SLIDE_INTERVAL_MS)

    return clearAutoplay
  }, [
    autoplayEpoch,
    clearAutoplay,
    goToNext,
    isInteractionPaused,
    prefersReducedMotion,
  ])

  return (
    <div
      ref={rootRef}
      className="about-image-slideshow carousel-arrow-host"
      role="region"
      aria-roledescription="carousel"
      aria-label="About Dekko ISHO Group. Drag left or right to browse."
      aria-live="polite"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => {
        isHoveredRef.current = true
        syncInteractionPause()
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false
        syncInteractionPause()
      }}
      onFocus={() => {
        isFocusWithinRef.current = true
        syncInteractionPause()
      }}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
        isFocusWithinRef.current = false
        syncInteractionPause()
      }}
    >
      {transitionState ? (
        <>
          <img
            ref={incomingRef}
            src={ABOUT_SLIDES[transitionState.to].src}
            loading="eager"
            decoding="async"
            alt={ABOUT_SLIDES[transitionState.to].alt}
            className="about-image about-image-slide__media about-image-slide__media--layer"
            draggable={false}
          />
          <img
            ref={outgoingRef}
            src={ABOUT_SLIDES[transitionState.from].src}
            alt=""
            aria-hidden="true"
            className="about-image about-image-slide__media about-image-slide__media--layer"
            draggable={false}
          />
        </>
      ) : (
        <img
          ref={mediaRef}
          src={visibleSlide.src}
          loading={visibleIndex === 0 ? 'eager' : 'lazy'}
          decoding="async"
          alt={visibleSlide.alt}
          className="about-image about-image-slide__media"
          draggable={false}
        />
      )}

      <div className="about-image-slideshow__nav">
        <CarouselArrow direction="previous" onClick={() => goToPrevious()} />
        <CarouselArrow direction="next" onClick={() => goToNext()} />
      </div>
    </div>
  )
}
