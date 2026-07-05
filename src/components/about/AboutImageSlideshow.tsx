import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { gsap } from 'gsap'

const SLIDE_INTERVAL_MS = 3000
const TRANSITION_DURATION = 0.85
const GLASS_INTRO_DURATION = 0.4
const SLICE_COUNT = 14
const STAGGER_PER_SLICE = 0.04

const ABOUT_SLIDES = [
  {
    src: '/images/about/about-1.png',
    alt: 'Dekko Isho team collaborating in a modern corporate office',
  },
  {
    src: '/images/about/about-2.png',
    alt: 'Garment manufacturing team working at industrial sewing stations',
  },
  {
    src: '/images/about/about-3.png',
    alt: 'Dekko Isho production facility showcasing operational excellence',
  },
  {
    src: '/images/about/about-4.png',
    alt: 'Employees engaged in quality-focused manufacturing work',
  },
  {
    src: '/images/about/about-5.png',
    alt: 'Dekko Isho workspace reflecting decades of industry leadership',
  },
  {
    src: '/images/about/about-6.png',
    alt: 'DIVC team presenting startup portfolio in a modern venture capital office',
  },
  {
    src: '/images/about/about-7.png',
    alt: 'Ecovia sustainable packaging products displayed on a wooden surface',
  },
] as const

type TransitionState = {
  from: number
  to: number
}

export function AboutImageSlideshow() {
  const mediaRef = useRef<HTMLImageElement>(null)
  const shutterRef = useRef<HTMLDivElement>(null)
  const activeIndexRef = useRef(0)
  const isTransitioningRef = useRef(false)
  const intervalRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [transitionState, setTransitionState] = useState<TransitionState | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const visibleIndex = transitionState?.to ?? activeIndex
  const visibleSlide = ABOUT_SLIDES[visibleIndex]

  const completeTransition = useCallback((to: number) => {
    activeIndexRef.current = to
    setActiveIndex(to)
    setTransitionState(null)
    isTransitioningRef.current = false
    gsap.set(mediaRef.current, { filter: 'blur(0px) brightness(1) saturate(1)' })
  }, [])

  const transitionTo = useCallback(
    (nextIndex: number) => {
      if (isTransitioningRef.current || nextIndex === activeIndexRef.current) return

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
        return
      }

      setTransitionState({ from: currentIndex, to: nextIndex })
    },
    [prefersReducedMotion],
  )

  useLayoutEffect(() => {
    if (!transitionState) return

    const shutter = shutterRef.current
    const media = mediaRef.current
    const slices = shutter?.querySelectorAll<HTMLElement>('.about-image-shutter-slice')
    if (!slices?.length || !media) return

    const staggerSpan = STAGGER_PER_SLICE * (SLICE_COUNT - 1)
    const revealDuration = TRANSITION_DURATION + staggerSpan

    const sliceMedia = Array.from(slices).map((slice) =>
      slice.querySelector<HTMLElement>('.about-image-shutter-slice__media'),
    )
    const sliceGlass = Array.from(slices).map((slice) =>
      slice.querySelector<HTMLElement>('.about-image-shutter-slice__glass'),
    )

    gsap.set(media, {
      filter: 'blur(0px) brightness(1) saturate(1)',
    })

    sliceMedia.forEach((element) => {
      if (!element) return
      gsap.set(element, { filter: 'blur(0px) brightness(1) saturate(1)' })
    })

    sliceGlass.forEach((element) => {
      if (!element) return
      gsap.set(element, { opacity: 0 })
    })

    gsap.set(slices, { scaleY: 1, transformOrigin: '50% 0%' })

    const timeline = gsap.timeline({
      onComplete: () => completeTransition(transitionState.to),
    })

    timeline.to(
      sliceGlass.filter(Boolean),
      {
        opacity: 0.55,
        duration: GLASS_INTRO_DURATION,
        ease: 'power2.out',
        stagger: {
          each: STAGGER_PER_SLICE * 0.75,
          from: 'start',
        },
      },
      0,
    )

    timeline.to(
      media,
      {
        filter: 'blur(10px) brightness(1.08) saturate(1.15)',
        duration: GLASS_INTRO_DURATION,
        ease: 'power2.inOut',
      },
      0,
    )

    timeline.to(
      media,
      {
        filter: 'blur(0px) brightness(1) saturate(1)',
        duration: revealDuration,
        ease: 'power2.out',
      },
      GLASS_INTRO_DURATION,
    )

    timeline.to(
      slices,
      {
        scaleY: 0,
        duration: TRANSITION_DURATION,
        ease: 'power3.inOut',
        stagger: {
          each: STAGGER_PER_SLICE,
          from: 'start',
        },
      },
      GLASS_INTRO_DURATION,
    )

    timeline.to(
      sliceMedia.filter(Boolean),
      {
        filter: 'blur(16px) brightness(1.25) saturate(0.9)',
        duration: TRANSITION_DURATION * 0.65,
        ease: 'power2.in',
        stagger: {
          each: STAGGER_PER_SLICE,
          from: 'start',
        },
      },
      GLASS_INTRO_DURATION,
    )

    timeline.to(
      sliceGlass.filter(Boolean),
      {
        opacity: 0.95,
        duration: TRANSITION_DURATION * 0.45,
        ease: 'power2.out',
        stagger: {
          each: STAGGER_PER_SLICE,
          from: 'start',
        },
      },
      GLASS_INTRO_DURATION,
    )

    return () => {
      timeline.kill()
    }
  }, [completeTransition, transitionState])

  const advanceSlide = useCallback(() => {
    const nextIndex = (activeIndexRef.current + 1) % ABOUT_SLIDES.length
    transitionTo(nextIndex)
  }, [transitionTo])

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

    gsap.set(media, { opacity: 1, filter: 'blur(0px)' })

    return () => {
      gsap.killTweensOf(media)
    }
  }, [])

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = window.setInterval(advanceSlide, SLIDE_INTERVAL_MS)

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [advanceSlide, isPaused])

  return (
    <div
      className="about-image-slideshow"
      role="region"
      aria-roledescription="carousel"
      aria-label="About Dekko Isho Group"
      aria-live="polite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false)
        }
      }}
    >
      <img
        ref={mediaRef}
        src={visibleSlide.src}
        loading={visibleIndex === 0 ? 'eager' : 'lazy'}
        decoding="async"
        alt={visibleSlide.alt}
        className="about-image about-image-slide__media"
        draggable={false}
      />

      {transitionState && (
        <div ref={shutterRef} className="about-image-shutter" aria-hidden="true">
          {Array.from({ length: SLICE_COUNT }, (_, sliceIndex) => (
            <div
              key={sliceIndex}
              className="about-image-shutter-slice"
              style={
                {
                  '--slice-index': sliceIndex,
                  '--slice-count': SLICE_COUNT,
                } as CSSProperties
              }
            >
              <img
                src={ABOUT_SLIDES[transitionState.from].src}
                alt=""
                className="about-image about-image-shutter-slice__media"
                draggable={false}
              />
              <div className="about-image-shutter-slice__glass" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
