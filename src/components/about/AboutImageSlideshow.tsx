import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { gsap } from 'gsap'

const SLIDE_INTERVAL_MS = 3000
const TRANSITION_DURATION = 0.65

const ABOUT_SLIDES = [
  {
    src: '/images/about/about-slider/about-slide-01.png',
    alt: 'Colleagues walking through a modern open-plan office at Dekko Isho Group',
  },
  {
    src: '/images/about/about-slider/about-slide-02.png',
    alt: 'DIVC team presenting startup portfolio in a modern venture capital office',
  },
  {
    src: '/images/about/about-slider/about-slide-03.png',
    alt: 'Ecovia sustainable packaging products displayed on a wooden surface',
  },
  {
    src: '/images/about/about-slider/about-slide-04.png',
    alt: 'Garment manufacturing team working at industrial sewing stations',
  },
  {
    src: '/images/about/about-slider/about-slide-05.png',
    alt: 'Team members reviewing apparel samples in a fashion showroom',
  },
  {
    src: '/images/about/about-slider/about-slide-06.png',
    alt: 'Craftsperson assembling furniture frames in a woodworking workshop',
  },
] as const

type SlideDirection = 'next' | 'previous'

type TransitionState = {
  from: number
  to: number
  direction: SlideDirection
}

function SlideshowArrowIcon({ direction }: { direction: 'previous' | 'next' }) {
  return (
    <svg
      className="about-image-slideshow__arrow-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={direction === 'previous' ? 'M14.5 5.5 7.5 12l7 6.5' : 'M9.5 5.5 16.5 12l-7 6.5'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AboutImageSlideshow() {
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
      className="about-image-slideshow"
      role="region"
      aria-roledescription="carousel"
      aria-label="About Dekko Isho Group"
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
        <button
          type="button"
          className="about-image-slideshow__arrow about-image-slideshow__arrow--previous"
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          <SlideshowArrowIcon direction="previous" />
        </button>
        <button
          type="button"
          className="about-image-slideshow__arrow about-image-slideshow__arrow--next"
          onClick={() => goToNext()}
          aria-label="Next slide"
        >
          <SlideshowArrowIcon direction="next" />
        </button>
      </div>
    </div>
  )
}
