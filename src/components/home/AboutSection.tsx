import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type FocusEvent,
  type TransitionEvent,
} from 'react'
import { Link } from 'react-router-dom'

import { solutionPath } from '../../data/solutions/solutions'
import { resetScrollPosition } from '../../lib/resetRouteScroll'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

const ABOUT_CARD_GAP = 40
const CAROUSEL_INTERVAL_MS = 2000
// Shorter lead-in so the carousel shows it moves soon after it comes into view.
const CAROUSEL_LEAD_IN_MS = 300

const INDUSTRY_DESCRIPTION =
  'Innovation to advance fashion sustainably. Customer satisfaction through true partnership.'

const ISHO_BUSINESS_IMAGE = '/images/home/business-isho.png'
const ISHO_LOGO = '/images/home/isho-logo-white.svg'
const DIVC_BUSINESS_IMAGE = '/images/home/business-divc.png'
const DIVC_LOGO = '/images/home/divc-logo.svg'
const DITECH_BUSINESS_IMAGE = '/images/home/business-ditech.png'
const DITECH_LOGO = '/images/home/ditech-logo-white.svg'
const KLUBHAUS_BUSINESS_IMAGE = '/images/home/business-klubhaus.jpg'
const KLUBHAUS_LOGO = '/images/home/klubhaus-logo.svg'
const IZAKAYA_BUSINESS_IMAGE = '/images/home/business-izakaya.jpg'
const IZAKAYA_LOGO = '/images/home/izakaya-logo.svg'
const ECOVIA_BUSINESS_IMAGE = '/images/home/business-ecovia.jpg'
const ECOVIA_LOGO = '/images/home/ecovia-logo-white.svg'

type IndustryTextItem = {
  type: 'text'
  id: string
  number: string
  title: string
  slug: string
  variant: 'light' | 'dark'
}

type BusinessLogoId = 'isho' | 'divc' | 'ditech' | 'klubhaus' | 'izakaya' | 'ecovia'

type IndustryImageItem = {
  type: 'image'
  src?: string
  alt: string
  variant?: 'default' | 'business'
  logo?: string
  logoId?: BusinessLogoId
  href?: string
}

type IndustryItem = IndustryTextItem | IndustryImageItem

const industries: IndustryItem[] = [
  {
    type: 'image',
    src: ISHO_BUSINESS_IMAGE,
    alt: 'ISHO Ltd.',
    variant: 'business',
    logo: ISHO_LOGO,
    logoId: 'isho',
    href: 'https://www.isho.com',
  },
  {
    type: 'image',
    src: DIVC_BUSINESS_IMAGE,
    alt: 'DIVC',
    variant: 'business',
    logo: DIVC_LOGO,
    logoId: 'divc',
    href: 'https://www.di.vc/',
  },
  {
    type: 'image',
    src: DITECH_BUSINESS_IMAGE,
    alt: 'DITECH',
    variant: 'business',
    logo: DITECH_LOGO,
    logoId: 'ditech',
    href: 'https://www.ditech.co',
  },
  {
    type: 'image',
    src: KLUBHAUS_BUSINESS_IMAGE,
    alt: 'Klubhaus',
    variant: 'business',
    logo: KLUBHAUS_LOGO,
    logoId: 'klubhaus',
    href: 'https://klubhaus.com.bd',
  },
  {
    type: 'image',
    src: IZAKAYA_BUSINESS_IMAGE,
    alt: 'IZAKAYA',
    variant: 'business',
    logo: IZAKAYA_LOGO,
    logoId: 'izakaya',
    href: 'https://izakaya.com.bd',
  },
  {
    type: 'image',
    src: ECOVIA_BUSINESS_IMAGE,
    alt: 'Ecovia',
    variant: 'business',
    logo: ECOVIA_LOGO,
    logoId: 'ecovia',
    href: 'https://www.ecoviaglobal.com',
  },
  // {
  //   type: 'text',
  //   id: '52b525da-7c1b-3a5f-e1d2-3e25e3d423eb',
  //   number: '01',
  //   title: 'Manufacturing',
  //   slug: 'manufacturing',
  //   variant: 'light',
  // },
  // { type: 'image', src: LAUNDRY_IMAGE, alt: 'Industrial laundry' },
  // {
  //   type: 'text',
  //   id: 'a502134d-7170-6735-c416-b637dce64a74',
  //   number: '02',
  //   title: 'Industrial Laundry',
  //   slug: 'industrial-laundry',
  //   variant: 'dark',
  // },
  // { type: 'image', src: COMPLIANCE_IMAGE, alt: 'Compliance and sustainability' },
  // {
  //   type: 'text',
  //   id: 'e0a0517f-1ee8-9dfc-bba2-14c8a6a448da',
  //   number: '03',
  //   title: 'Compliance & Sustainability',
  //   slug: 'compliance-sustainability',
  //   variant: 'light',
  // },
  // { type: 'image', src: DESIGN_IMAGE, alt: 'Design and product development' },
  // {
  //   type: 'text',
  //   id: 'about-industry-04',
  //   number: '04',
  //   title: 'Design & Product Development',
  //   slug: 'design-product-development',
  //   variant: 'light',
  // },
  // { type: 'image', src: INTEGRATION_IMAGE, alt: 'Technology integration' },
  // {
  //   type: 'text',
  //   id: 'about-industry-05',
  //   number: '05',
  //   title: 'Technology Integration',
  //   slug: 'technology-integration',
  //   variant: 'dark',
  // },
]

function IndustryTextCircle({ id, number, title, slug, variant }: IndustryTextItem) {
  const boxClass = variant === 'dark' ? 'about-info-box box-bg-dark' : 'about-info-box box-bg-white'
  const descriptionClass =
    variant === 'dark' ? 'about-info-description' : 'about-content-description'

  return (
    <FadeIn id={id}>
      <Link
        to={solutionPath(slug)}
        className={boxClass}
        onClick={() => resetScrollPosition()}
      >
        <div className="about-info-inner-wrap">
          <div className="about-content">{number}</div>
          <div className="about-info-text">{title}</div>
          <p className={descriptionClass}>{INDUSTRY_DESCRIPTION}</p>
        </div>
      </Link>
    </FadeIn>
  )
}

function ArrowUpRightIcon() {
  return (
    <svg
      className="about-business-card__arrow"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://')
}

function IndustryImageCircle({ src, alt, variant = 'default', logo, logoId, href }: IndustryImageItem) {
  if (variant === 'business' && src) {
    const card = (
      <>
        <img
          src={src}
          loading="eager"
          decoding="async"
          alt=""
          className="about-business-card__media"
        />
        <div className="about-business-card__overlay" aria-hidden="true" />
        {logo ? (
          <img
            src={logo}
            alt=""
            className="about-business-card__logo"
            data-logo={logoId}
            aria-hidden="true"
          />
        ) : null}
        <ArrowUpRightIcon />
      </>
    )

    if (href) {
      if (isExternalHref(href)) {
        return (
          <a
            href={href}
            className="about-business-card"
            data-home-animate="about-card"
            aria-label={alt}
            target="_blank"
            rel="noopener noreferrer"
          >
            {card}
          </a>
        )
      }

      return (
        <Link
          to={href}
          className="about-business-card"
          data-home-animate="about-card"
          aria-label={alt}
          onClick={() => resetScrollPosition()}
        >
          {card}
        </Link>
      )
    }

    return (
      <div className="about-business-card" data-home-animate="about-card">
        {card}
      </div>
    )
  }

  if (src) {
    return (
      <img
        src={src}
        loading="lazy"
        alt={alt}
        draggable={false}
        className="about-image-box"
      />
    )
  }

  return <div className="about-image-box about-image-placeholder" role="img" aria-label={alt} />
}

function CarouselArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      className="about-carousel-arrow__icon"
      viewBox="0 0 16 12"
      fill="none"
      aria-hidden="true"
    >
      {direction === 'left' ? (
        <path
          d="M1.57496 6.22461L6.57496 1.22461M1.57496 6.22461L6.57496 11.2246M1.57496 6.22461H14.425"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M14.425 6.22461L9.42501 1.22461M14.425 6.22461L9.42501 11.2246M14.425 6.22461H1.57501"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

function AboutCarouselArrow({
  direction,
  onClick,
}: {
  direction: 'left' | 'right'
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`about-carousel-arrow about-carousel-arrow--${direction}`}
      onClick={onClick}
      aria-label={direction === 'left' ? 'Previous card' : 'Next card'}
    >
      <CarouselArrowIcon direction={direction} />
    </button>
  )
}

function getVisibleCardCount(viewportWidth: number) {
  if (viewportWidth <= 767) return 1
  if (viewportWidth <= 991) return 2
  return 3
}

type CarouselDirection = -1 | 1

type CarouselState = {
  trackIndex: number
  visibleCount: number
  phase: 'idle' | 'moving' | 'resetting'
  queue: CarouselDirection[]
  suppressTransition: boolean
  interactionVersion: number
}

type CarouselAction =
  | { type: 'MOVE'; direction: CarouselDirection; manual: boolean; instant: boolean }
  | { type: 'TRANSITION_END' }
  | { type: 'RESET_COMPLETE' }
  | { type: 'LAYOUT_CHANGE'; visibleCount: number }
  | { type: 'SETTLE' }

const initialCarouselState: CarouselState = {
  trackIndex: 3,
  visibleCount: 3,
  phase: 'idle',
  queue: [],
  suppressTransition: false,
  interactionVersion: 0,
}

function wrapLogicalIndex(index: number) {
  return ((index % industries.length) + industries.length) % industries.length
}

function startQueuedMove(state: CarouselState, trackIndex: number): CarouselState {
  const [direction, ...queue] = state.queue
  if (direction === undefined) {
    return { ...state, trackIndex, queue, phase: 'idle', suppressTransition: false }
  }

  return {
    ...state,
    trackIndex: trackIndex + direction,
    queue,
    phase: 'moving',
    suppressTransition: false,
  }
}

function carouselReducer(state: CarouselState, action: CarouselAction): CarouselState {
  switch (action.type) {
    case 'MOVE': {
      const interactionVersion = state.interactionVersion + (action.manual ? 1 : 0)

      if (action.instant) {
        const logicalIndex = wrapLogicalIndex(
          state.trackIndex - state.visibleCount + action.direction,
        )
        return {
          ...state,
          trackIndex: state.visibleCount + logicalIndex,
          interactionVersion,
        }
      }

      if (state.phase !== 'idle') {
        if (!action.manual) return state
        return {
          ...state,
          queue: [...state.queue, action.direction],
          interactionVersion,
        }
      }

      return {
        ...state,
        trackIndex: state.trackIndex + action.direction,
        phase: 'moving',
        interactionVersion,
      }
    }

    case 'TRANSITION_END': {
      if (state.phase !== 'moving') return state

      const firstOriginalIndex = state.visibleCount
      const afterLastOriginalIndex = firstOriginalIndex + industries.length
      let normalizedIndex = state.trackIndex

      if (state.trackIndex < firstOriginalIndex) {
        normalizedIndex += industries.length
      } else if (state.trackIndex >= afterLastOriginalIndex) {
        normalizedIndex -= industries.length
      }

      if (normalizedIndex !== state.trackIndex) {
        return {
          ...state,
          trackIndex: normalizedIndex,
          phase: 'resetting',
          suppressTransition: true,
        }
      }

      return startQueuedMove(state, normalizedIndex)
    }

    case 'RESET_COMPLETE':
      if (state.phase !== 'resetting') return state
      return startQueuedMove(state, state.trackIndex)

    case 'LAYOUT_CHANGE': {
      if (action.visibleCount === state.visibleCount) return state
      const logicalIndex = wrapLogicalIndex(state.trackIndex - state.visibleCount)
      return {
        ...state,
        visibleCount: action.visibleCount,
        trackIndex: action.visibleCount + logicalIndex,
        phase: 'resetting',
        queue: [],
        suppressTransition: true,
      }
    }

    case 'SETTLE': {
      const logicalIndex = wrapLogicalIndex(state.trackIndex - state.visibleCount)
      return {
        ...state,
        trackIndex: state.visibleCount + logicalIndex,
        phase: 'idle',
        queue: [],
        suppressTransition: false,
      }
    }
  }
}

export function AboutSection() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const wrapFrameRef = useRef<number | null>(null)
  const hasAdvancedRef = useRef(false)
  const [carouselState, dispatchCarousel] = useReducer(carouselReducer, initialCarouselState)
  const [slideStep, setSlideStep] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isInView, setIsInView] = useState(() => typeof IntersectionObserver === 'undefined')
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const loopedIndustries = useMemo(
    () => [
      ...industries.slice(-carouselState.visibleCount),
      ...industries,
      ...industries.slice(0, carouselState.visibleCount),
    ],
    [carouselState.visibleCount],
  )

  const goToPrevious = useCallback(() => {
    dispatchCarousel({ type: 'MOVE', direction: -1, manual: true, instant: prefersReducedMotion })
  }, [prefersReducedMotion])

  const goToNext = useCallback(() => {
    dispatchCarousel({ type: 'MOVE', direction: 1, manual: true, instant: prefersReducedMotion })
  }, [prefersReducedMotion])

  const handleTrackTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.target !== trackRef.current) return
      if (event.propertyName !== 'transform') return
      dispatchCarousel({ type: 'TRANSITION_END' })
    },
    [],
  )

  useEffect(() => {
    if (!prefersReducedMotion) return
    dispatchCarousel({ type: 'SETTLE' })
  }, [prefersReducedMotion])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updateMotionPreference()
    mediaQuery.addEventListener('change', updateMotionPreference)
    return () => mediaQuery.removeEventListener('change', updateMotionPreference)
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const updateLayout = () => {
      const nextVisibleCount = getVisibleCardCount(viewport.clientWidth)
      dispatchCarousel({ type: 'LAYOUT_CHANGE', visibleCount: nextVisibleCount })

      const card = trackRef.current?.querySelector<HTMLElement>('.about-business-card')
      if (!card) return

      setSlideStep(card.offsetWidth + ABOUT_CARD_GAP)
    }

    updateLayout()

    const resizeObserver = new ResizeObserver(updateLayout)
    resizeObserver.observe(viewport)

    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    if (carouselState.phase !== 'resetting') return

    if (wrapFrameRef.current !== null) {
      window.cancelAnimationFrame(wrapFrameRef.current)
    }

    wrapFrameRef.current = window.requestAnimationFrame(() => {
      wrapFrameRef.current = window.requestAnimationFrame(() => {
        dispatchCarousel({ type: 'RESET_COMPLETE' })
        wrapFrameRef.current = null
      })
    })

    return () => {
      if (wrapFrameRef.current !== null) {
        window.cancelAnimationFrame(wrapFrameRef.current)
        wrapFrameRef.current = null
      }
    }
  }, [carouselState.phase, carouselState.trackIndex, carouselState.visibleCount])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        setIsInView(true)
        observer.disconnect()
      },
      { threshold: 0.25 },
    )

    observer.observe(viewport)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (
      !isInView ||
      isPaused ||
      prefersReducedMotion ||
      carouselState.phase !== 'idle' ||
      carouselState.queue.length > 0 ||
      industries.length <= 1
    ) return

    const delay = hasAdvancedRef.current ? CAROUSEL_INTERVAL_MS : CAROUSEL_LEAD_IN_MS
    const timeoutId = window.setTimeout(() => {
      hasAdvancedRef.current = true
      dispatchCarousel({ type: 'MOVE', direction: 1, manual: false, instant: false })
    }, delay)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [
    carouselState.interactionVersion,
    carouselState.phase,
    carouselState.queue.length,
    isInView,
    isPaused,
    prefersReducedMotion,
  ])

  useEffect(() => {
    return () => {
      if (wrapFrameRef.current !== null) {
        window.cancelAnimationFrame(wrapFrameRef.current)
      }
    }
  }, [])

  const pauseCarousel = useCallback(() => setIsPaused(true), [])
  const resumeCarousel = useCallback(() => setIsPaused(false), [])
  const handleCarouselBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return
    setIsPaused(false)
  }, [])

  const trackMotionClass = [
    prefersReducedMotion ? 'is-reduced-motion' : '',
    carouselState.suppressTransition ? 'is-suppressing-transition' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section id="About-Section" className="about-section">
      <div className="about-main">
        <div className="about-inner">
          <div className="about-header">
            <FadeIn id="710a89bc-f9dd-2ab9-dd91-b12ed4a78144" variant="slide-in-bottom" className="about-section-title">
              <h2 className="section-title about-section-heading title-center">
                Turning <span className="text-linear-gradient">Possibility</span> into Purpose
              </h2>
            </FadeIn>
            <FadeIn id="017b83dc-7656-67a6-b23e-69b6032ef810" variant="slide-in-bottom" delay={150} className="about-description">
              <p>Six industries. One vision. We don’t follow the future, we craft it.</p>
            </FadeIn>
            <FadeIn id="5a23ee6f-035d-2255-fd4f-73aa8e89689a" variant="slide-in-bottom" delay={300} className="about-button-wrap">
              <ButtonArrow to="/about" label="Learn more about us" />
            </FadeIn>
          </div>

          <div
            className="about-carousel"
            data-home-animate="about-carousel"
            onMouseEnter={pauseCarousel}
            onMouseLeave={resumeCarousel}
            onFocusCapture={pauseCarousel}
            onBlurCapture={handleCarouselBlur}
          >
            <div
              ref={viewportRef}
              className="about-scroll-viewport about-carousel-viewport"
            >
              <div
                ref={trackRef}
                className={`about-info-inner is-scroll about-carousel-track${trackMotionClass ? ` ${trackMotionClass}` : ''}`}
                style={
                  slideStep
                    ? {
                        transform: `translate3d(-${carouselState.trackIndex * slideStep}px, 0, 0)`,
                      }
                    : undefined
                }
                onTransitionEnd={handleTrackTransitionEnd}
              >
                {loopedIndustries.map((item, index) =>
                  item.type === 'text' ? (
                    <IndustryTextCircle key={`${item.id}-${index}`} {...item} />
                  ) : (
                    <IndustryImageCircle key={`${item.alt}-${index}`} {...item} />
                  ),
                )}
              </div>
            </div>
            <div className="about-carousel-nav">
              <AboutCarouselArrow direction="left" onClick={goToPrevious} />
              <AboutCarouselArrow direction="right" onClick={goToNext} />
            </div>
          </div>
        </div>
        <SectionLines />
        <NoiseOverlay />
      </div>
    </section>
  )
}
