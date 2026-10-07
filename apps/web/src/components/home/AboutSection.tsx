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
import { CarouselArrow } from '../ui/CarouselArrow'
import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

const CAROUSEL_INTERVAL_MS = 2000
// Shorter lead-in so the carousel shows it moves soon after it comes into view.
const CAROUSEL_LEAD_IN_MS = 300
const CAROUSEL_DRAG_THRESHOLD_PX = 8
const CAROUSEL_SWIPE_MIN_PX = 48
// Must stay in sync with `.about-carousel-track` transition duration in home.css
const CAROUSEL_TRANSITION_MS = 1150
// Short snap used only for drag/swipe (mobile gallery feel); buttons keep 1.15s CSS.
const GALLERY_DRAG_SETTLE_MS = 300

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

function getVisibleCardCount(viewportWidth: number) {
  if (viewportWidth <= 767) return 1
  if (viewportWidth <= 991) return 2
  return 3
}

// Full copies on both sides so multi-step drags never land past the clone buffer
// (mobile only pads 1 card when using visibleCount, which caused an empty flash).
const CAROUSEL_LOOP_OFFSET = industries.length

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
  | {
      type: 'MOVE'
      direction: CarouselDirection
      manual: boolean
      instant: boolean
      /** How many cards to advance. Defaults to 1 (next/prev/autoplay). */
      steps?: number
    }
  | { type: 'TRANSITION_END' }
  | { type: 'RESET_COMPLETE' }
  | { type: 'LAYOUT_CHANGE'; visibleCount: number }
  | { type: 'SETTLE' }

const initialCarouselState: CarouselState = {
  trackIndex: CAROUSEL_LOOP_OFFSET,
  visibleCount: 3,
  phase: 'idle',
  queue: [],
  suppressTransition: false,
  interactionVersion: 0,
}

function wrapLogicalIndex(index: number) {
  return ((index % industries.length) + industries.length) % industries.length
}

function toTrackIndex(logicalIndex: number) {
  return CAROUSEL_LOOP_OFFSET + wrapLogicalIndex(logicalIndex)
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
      const steps = Math.max(1, Math.min(action.steps ?? 1, industries.length))
      const interactionVersion = state.interactionVersion + (action.manual ? 1 : 0)
      const delta = action.direction * steps

      if (action.instant) {
        return {
          ...state,
          trackIndex: toTrackIndex(state.trackIndex - CAROUSEL_LOOP_OFFSET + delta),
          phase: 'idle',
          queue: [],
          suppressTransition: false,
          interactionVersion,
        }
      }

      if (state.phase !== 'idle') {
        if (!action.manual) return state
        return {
          ...state,
          queue: [
            ...state.queue,
            ...Array.from({ length: steps }, () => action.direction),
          ],
          interactionVersion,
        }
      }

      return {
        ...state,
        trackIndex: state.trackIndex + delta,
        phase: 'moving',
        interactionVersion,
      }
    }

    case 'TRANSITION_END': {
      if (state.phase !== 'moving') return state

      const firstOriginalIndex = CAROUSEL_LOOP_OFFSET
      const afterLastOriginalIndex = firstOriginalIndex + industries.length
      let normalizedIndex = state.trackIndex

      while (normalizedIndex < firstOriginalIndex) {
        normalizedIndex += industries.length
      }
      while (normalizedIndex >= afterLastOriginalIndex) {
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
      return {
        ...state,
        visibleCount: action.visibleCount,
        trackIndex: toTrackIndex(state.trackIndex - CAROUSEL_LOOP_OFFSET),
        phase: 'resetting',
        queue: [],
        suppressTransition: true,
      }
    }

    case 'SETTLE': {
      return {
        ...state,
        trackIndex: toTrackIndex(state.trackIndex - CAROUSEL_LOOP_OFFSET),
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
  const suppressClickRef = useRef(false)
  const phaseRef = useRef<CarouselState['phase']>('idle')
  const visibleCountRef = useRef(initialCarouselState.visibleCount)
  const [carouselState, dispatchCarousel] = useReducer(carouselReducer, initialCarouselState)
  const [slideStep, setSlideStep] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isGallerySettling, setIsGallerySettling] = useState(false)
  // Pause autoplay from pointer-down (not only after drag threshold).
  const [isPointerActive, setIsPointerActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isInView, setIsInView] = useState(() => typeof IntersectionObserver === 'undefined')
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  phaseRef.current = carouselState.phase
  visibleCountRef.current = carouselState.visibleCount

  const loopedIndustries = useMemo(
    () => [...industries, ...industries, ...industries],
    [],
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
    const track = trackRef.current
    if (!viewport) return

    const updateLayout = () => {
      const nextVisibleCount = getVisibleCardCount(viewport.clientWidth)
      dispatchCarousel({ type: 'LAYOUT_CHANGE', visibleCount: nextVisibleCount })

      const cards = trackRef.current?.querySelectorAll<HTMLElement>('.about-business-card')
      if (!cards || cards.length < 2) return

      // Use real center-to-center distance so mobile 1-card width can't be mis-measured
      // as a multi-card desktop step (which made swipes jump 3–4 items).
      const measuredStep = cards[1].offsetLeft - cards[0].offsetLeft
      if (measuredStep > 0) setSlideStep(measuredStep)
    }

    updateLayout()

    const resizeObserver = new ResizeObserver(updateLayout)
    resizeObserver.observe(viewport)
    if (track) resizeObserver.observe(track)

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

  // If transform doesn't change (common after a full-card drag), transitionend never
  // fires and phase stays "moving" — which blocks all further slides. Force settle.
  useEffect(() => {
    if (carouselState.phase !== 'moving') return

    const timeoutId = window.setTimeout(() => {
      dispatchCarousel({ type: 'TRANSITION_END' })
    }, CAROUSEL_TRANSITION_MS + 150)

    return () => window.clearTimeout(timeoutId)
  }, [carouselState.phase, carouselState.trackIndex])

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
      isDragging ||
      isGallerySettling ||
      isPointerActive ||
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
    isDragging,
    isGallerySettling,
    isInView,
    isPaused,
    isPointerActive,
    prefersReducedMotion,
  ])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || slideStep <= 0) return

    let activePointerId: number | null = null
    let isPointerDown = false
    let dragging = false
    // Swipe while an animation is running (mobile): queue next slide, don't free-drag.
    let queueSwipeOnly = false
    let startX = 0
    let startY = 0
    let lastDeltaX = 0
    let hasTrackedDelta = false
    let settleFrame = 0
    let gallerySettleTimer = 0
    let pendingGallery: { direction: CarouselDirection; steps: number } | null = null

    const swipeThreshold = Math.max(CAROUSEL_SWIPE_MIN_PX, slideStep * 0.2)
    // One visible card (mobile) → always 1 slide per swipe, unlike desktop multi-skip.
    const isSingleSlideDrag = () =>
      visibleCountRef.current === 1 || viewport.clientWidth <= 767

    const clampDragDelta = (deltaX: number) => {
      if (!isSingleSlideDrag()) return deltaX
      return Math.max(-slideStep, Math.min(slideStep, deltaX))
    }

    const detachPointerListeners = () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', endPointer)
      document.removeEventListener('pointercancel', endPointer)
    }

    const commitGalleryMove = (direction: CarouselDirection, steps: number) => {
      pendingGallery = null
      setIsDragging(true)
      setIsGallerySettling(false)
      setDragOffset(0)
      dispatchCarousel({
        type: 'MOVE',
        direction,
        manual: true,
        instant: true,
        steps,
      })
      settleFrame = window.requestAnimationFrame(() => {
        setIsDragging(false)
        settleFrame = 0
      })
    }

    /** Finish or cancel an in-flight gallery snap so the next drag can start immediately. */
    const flushGallerySettle = () => {
      if (gallerySettleTimer !== 0) {
        window.clearTimeout(gallerySettleTimer)
        gallerySettleTimer = 0
      }
      if (settleFrame !== 0) {
        window.cancelAnimationFrame(settleFrame)
        settleFrame = 0
      }
      if (pendingGallery) {
        const { direction, steps } = pendingGallery
        commitGalleryMove(direction, steps)
      } else {
        setIsGallerySettling(false)
      }
    }

    /** Finger-follow, then short snap — like a mobile image gallery. */
    const settleLikeGallery = (
      direction: CarouselDirection | 0,
      steps: number,
      fromOffset: number,
    ) => {
      const targetOffset = direction === 0 ? 0 : -direction * steps * slideStep
      pendingGallery =
        direction !== 0 && steps > 0 ? { direction, steps } : null

      if (prefersReducedMotion || fromOffset === targetOffset) {
        if (pendingGallery) {
          commitGalleryMove(pendingGallery.direction, pendingGallery.steps)
        } else {
          setIsDragging(false)
          setIsGallerySettling(false)
          setDragOffset(0)
        }
        return
      }

      setIsDragging(false)
      setIsGallerySettling(true)
      // Keep current offset for one frame so the short transition can run to the snap.
      settleFrame = window.requestAnimationFrame(() => {
        setDragOffset(targetOffset)
        settleFrame = 0
      })

      gallerySettleTimer = window.setTimeout(() => {
        gallerySettleTimer = 0
        if (pendingGallery) {
          commitGalleryMove(pendingGallery.direction, pendingGallery.steps)
        } else {
          setIsDragging(false)
          setIsGallerySettling(false)
          setDragOffset(0)
        }
      }, GALLERY_DRAG_SETTLE_MS)
    }

    const endPointer = (event: PointerEvent) => {
      if (!isPointerDown || event.pointerId !== activePointerId) return

      detachPointerListeners()
      setIsPointerActive(false)

      // Prefer last tracked delta — pointercancel often has a stale clientX on iOS.
      const deltaX = clampDragDelta(hasTrackedDelta ? lastDeltaX : event.clientX - startX)

      if (dragging) {
        if (viewport.hasPointerCapture(event.pointerId)) {
          viewport.releasePointerCapture(event.pointerId)
        }
        viewport.classList.remove('is-dragging')
        suppressClickRef.current = true

        const absDelta = Math.abs(deltaX)
        const direction: CarouselDirection | 0 =
          deltaX <= -swipeThreshold ? 1 : deltaX >= swipeThreshold ? -1 : 0
        const singleSlide = isSingleSlideDrag()
        const steps =
          direction === 0
            ? 0
            : singleSlide
              ? 1
              : Math.min(
                  industries.length,
                  Math.max(1, Math.round(absDelta / slideStep)),
                )

        if (queueSwipeOnly || phaseRef.current !== 'idle') {
          // Mid-motion swipe: commit without fighting the in-flight track animation.
          if (direction !== 0 && steps > 0) {
            commitGalleryMove(direction, steps)
          } else {
            setIsDragging(false)
            setDragOffset(0)
          }
        } else {
          settleLikeGallery(direction, steps, deltaX)
        }
      }

      isPointerDown = false
      dragging = false
      queueSwipeOnly = false
      activePointerId = null
      lastDeltaX = 0
      hasTrackedDelta = false
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!isPointerDown || event.pointerId !== activePointerId) return

      const deltaX = event.clientX - startX
      const deltaY = event.clientY - startY

      if (!dragging) {
        const absX = Math.abs(deltaX)
        const absY = Math.abs(deltaY)
        if (absX <= CAROUSEL_DRAG_THRESHOLD_PX && absY <= CAROUSEL_DRAG_THRESHOLD_PX) {
          return
        }
        // Vertical intent → let the page scroll; don't hijack the gesture.
        if (absY > absX) {
          isPointerDown = false
          activePointerId = null
          lastDeltaX = 0
          hasTrackedDelta = false
          setIsPointerActive(false)
          detachPointerListeners()
          return
        }
        // All devices: allow continuous drag — queue a swipe if still animating/settling.
        if (phaseRef.current !== 'idle') {
          dragging = true
          queueSwipeOnly = true
          viewport.setPointerCapture(event.pointerId)
          window.getSelection()?.removeAllRanges()
        } else {
          dragging = true
          queueSwipeOnly = false
          setIsDragging(true)
          viewport.classList.add('is-dragging')
          viewport.setPointerCapture(event.pointerId)
          window.getSelection()?.removeAllRanges()
        }
      }

      const limitedDeltaX = clampDragDelta(deltaX)
      lastDeltaX = limitedDeltaX
      hasTrackedDelta = true
      event.preventDefault()
      if (!queueSwipeOnly) setDragOffset(limitedDeltaX)
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return

      // Commit any in-flight gallery snap so the next drag can start right away
      // (desktop + mobile continuous flicking).
      flushGallerySettle()

      isPointerDown = true
      dragging = false
      queueSwipeOnly = false
      activePointerId = event.pointerId
      startX = event.clientX
      startY = event.clientY
      lastDeltaX = 0
      hasTrackedDelta = false
      setIsPointerActive(true)

      document.addEventListener('pointermove', onPointerMove, { passive: false })
      document.addEventListener('pointerup', endPointer)
      document.addEventListener('pointercancel', endPointer)
    }

    const onDragStart = (event: DragEvent) => {
      event.preventDefault()
    }

    const onSelectStart = (event: Event) => {
      event.preventDefault()
    }

    const onClickCapture = (event: MouseEvent) => {
      if (!suppressClickRef.current) return
      event.preventDefault()
      event.stopPropagation()
      suppressClickRef.current = false
    }

    viewport.addEventListener('pointerdown', onPointerDown)
    viewport.addEventListener('dragstart', onDragStart)
    viewport.addEventListener('selectstart', onSelectStart)
    viewport.addEventListener('click', onClickCapture, true)

    return () => {
      viewport.removeEventListener('pointerdown', onPointerDown)
      viewport.removeEventListener('dragstart', onDragStart)
      viewport.removeEventListener('selectstart', onSelectStart)
      viewport.removeEventListener('click', onClickCapture, true)
      detachPointerListeners()
      if (settleFrame !== 0) window.cancelAnimationFrame(settleFrame)
      if (gallerySettleTimer !== 0) window.clearTimeout(gallerySettleTimer)
      viewport.classList.remove('is-dragging')
      setIsDragging(false)
      setIsGallerySettling(false)
      setIsPointerActive(false)
      setDragOffset(0)
    }
  }, [prefersReducedMotion, slideStep])

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
    carouselState.suppressTransition || isDragging ? 'is-suppressing-transition' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const trackStyle =
    slideStep > 0
      ? {
          transform: `translate3d(-${carouselState.trackIndex * slideStep - dragOffset}px, 0, 0)`,
          // Drag settle only — does not change next/prev/autoplay CSS transition.
          ...(isGallerySettling && !isDragging
            ? {
                transition: `transform ${GALLERY_DRAG_SETTLE_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
              }
            : {}),
        }
      : undefined

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
              aria-label="Business cards. Drag left or right to browse."
            >
              <div
                ref={trackRef}
                className={`about-info-inner is-scroll about-carousel-track${trackMotionClass ? ` ${trackMotionClass}` : ''}`}
                style={trackStyle}
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
              <CarouselArrow
                direction="previous"
                label="Previous card"
                surface="light"
                onClick={goToPrevious}
              />
              <CarouselArrow
                direction="next"
                label="Next card"
                surface="light"
                onClick={goToNext}
              />
            </div>
          </div>
        </div>
        <SectionLines />
        <NoiseOverlay />
      </div>
    </section>
  )
}
