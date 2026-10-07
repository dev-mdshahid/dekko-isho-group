import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
  type CSSProperties,
  type Key,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
} from 'react'
import './LogoLoop.css'

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 }
const DRAG_THRESHOLD_PX = 4

export type LogoNodeItem = {
  node: ReactNode
  title?: string
  href?: string
  ariaLabel?: string
}

export type LogoImageItem = {
  src: string
  srcSet?: string
  sizes?: string
  width?: number
  height?: number
  alt?: string
  title?: string
  href?: string
}

export type LogoItem = LogoNodeItem | LogoImageItem

export type LogoLoopProps = {
  logos: LogoItem[]
  speed?: number
  direction?: 'left' | 'right' | 'up' | 'down'
  width?: number | string
  logoHeight?: number
  gap?: number
  pauseOnHover?: boolean
  hoverSpeed?: number
  fadeOut?: boolean
  fadeOutColor?: string
  scaleOnHover?: boolean
  renderItem?: (item: LogoItem, key: Key) => ReactNode
  /** When true, pointer drag scrubs the loop left/right (horizontal only). */
  draggable?: boolean
  ariaLabel?: string
  className?: string
  style?: CSSProperties
}

const toCssLength = (value: number | string | undefined) =>
  typeof value === 'number' ? `${value}px` : (value ?? undefined)

const useResizeObserver = (
  callback: () => void,
  elements: RefObject<Element | null>[],
  dependencies: unknown[],
) => {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback()
      window.addEventListener('resize', handleResize)
      callback()
      return () => window.removeEventListener('resize', handleResize)
    }
    const observers = elements.map((ref) => {
      if (!ref.current) return null
      const observer = new ResizeObserver(callback)
      observer.observe(ref.current)
      return observer
    })
    callback()
    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- matches upstream dependency contract
  }, [callback, elements, ...dependencies])
}

const useImageLoader = (
  seqRef: RefObject<HTMLUListElement | null>,
  onLoad: () => void,
  dependencies: unknown[],
) => {
  useEffect(() => {
    const images = seqRef.current?.querySelectorAll('img') ?? []
    if (images.length === 0) {
      onLoad()
      return
    }
    let remainingImages = images.length
    const handleImageLoad = () => {
      remainingImages -= 1
      if (remainingImages === 0) onLoad()
    }
    images.forEach((img) => {
      const htmlImg = img
      if (htmlImg.complete) {
        handleImageLoad()
      } else {
        htmlImg.addEventListener('load', handleImageLoad, { once: true })
        htmlImg.addEventListener('error', handleImageLoad, { once: true })
      }
    })
    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', handleImageLoad)
        img.removeEventListener('error', handleImageLoad)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- matches upstream dependency contract
  }, [onLoad, seqRef, ...dependencies])
}

const wrapOffset = (value: number, seqSize: number) =>
  seqSize > 0 ? ((value % seqSize) + seqSize) % seqSize : value

const useAnimationLoop = (
  trackRef: RefObject<HTMLDivElement | null>,
  targetVelocity: number,
  seqWidth: number,
  seqHeight: number,
  isHovered: boolean,
  hoverSpeed: number | undefined,
  isVertical: boolean,
  offsetRef: MutableRefObject<number>,
  isDraggingRef: RefObject<boolean>,
) => {
  const rafRef = useRef<number | null>(null)
  const lastTimestampRef = useRef<number | null>(null)
  const velocityRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const seqSize = isVertical ? seqHeight : seqWidth

    if (seqSize > 0) {
      offsetRef.current = wrapOffset(offsetRef.current, seqSize)
      const transformValue = isVertical
        ? `translate3d(0, ${-offsetRef.current}px, 0)`
        : `translate3d(${-offsetRef.current}px, 0, 0)`
      track.style.transform = transformValue
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000
      lastTimestampRef.current = timestamp

      if (!isDraggingRef.current) {
        const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity

        const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU)
        velocityRef.current += (target - velocityRef.current) * easingFactor

        if (seqSize > 0) {
          offsetRef.current = wrapOffset(
            offsetRef.current + velocityRef.current * deltaTime,
            seqSize,
          )
        }
      } else {
        velocityRef.current = 0
      }

      if (seqSize > 0) {
        const transformValue = isVertical
          ? `translate3d(0, ${-offsetRef.current}px, 0)`
          : `translate3d(${-offsetRef.current}px, 0, 0)`
        track.style.transform = transformValue
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      lastTimestampRef.current = null
    }
  }, [
    targetVelocity,
    seqWidth,
    seqHeight,
    isHovered,
    hoverSpeed,
    isVertical,
    trackRef,
    offsetRef,
    isDraggingRef,
  ])
}

export const LogoLoop = memo(function LogoLoop({
  logos,
  speed = 120,
  direction = 'left',
  width = '100%',
  logoHeight = 28,
  gap = 32,
  pauseOnHover,
  hoverSpeed,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  renderItem,
  draggable = false,
  ariaLabel = 'Partner logos',
  className,
  style,
}: LogoLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const seqRef = useRef<HTMLUListElement>(null)
  const offsetRef = useRef(0)
  const isDraggingRef = useRef(false)

  const [seqWidth, setSeqWidth] = useState(0)
  const [seqHeight, setSeqHeight] = useState(0)
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES)
  const [isHovered, setIsHovered] = useState(false)

  const effectiveHoverSpeed = useMemo(() => {
    if (hoverSpeed !== undefined) return hoverSpeed
    if (pauseOnHover === true) return 0
    if (pauseOnHover === false) return undefined
    return 0
  }, [hoverSpeed, pauseOnHover])

  const isVertical = direction === 'up' || direction === 'down'
  const canDrag = draggable && !isVertical

  const targetVelocity = useMemo(() => {
    const magnitude = Math.abs(speed)
    let directionMultiplier: number
    if (isVertical) {
      directionMultiplier = direction === 'up' ? 1 : -1
    } else {
      directionMultiplier = direction === 'left' ? 1 : -1
    }
    const speedMultiplier = speed < 0 ? -1 : 1
    return magnitude * directionMultiplier * speedMultiplier
  }, [speed, direction, isVertical])

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0
    const sequenceRect = seqRef.current?.getBoundingClientRect?.()
    const sequenceWidth = sequenceRect?.width ?? 0
    const sequenceHeight = sequenceRect?.height ?? 0
    if (isVertical) {
      const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0
      if (containerRef.current && parentHeight > 0) {
        const targetHeight = Math.ceil(parentHeight)
        if (containerRef.current.style.height !== `${targetHeight}px`)
          containerRef.current.style.height = `${targetHeight}px`
      }
      if (sequenceHeight > 0) {
        setSeqHeight(Math.ceil(sequenceHeight))
        const viewport = containerRef.current?.clientHeight ?? parentHeight ?? sequenceHeight
        const copiesNeeded = Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded))
      }
    } else if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth))
      const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded))
    }
  }, [isVertical])

  useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, isVertical])

  useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical])

  useAnimationLoop(
    trackRef,
    targetVelocity,
    seqWidth,
    seqHeight,
    isHovered,
    effectiveHoverSpeed,
    isVertical,
    offsetRef,
    isDraggingRef,
  )

  useEffect(() => {
    if (!canDrag) return

    const container = containerRef.current
    if (!container) return

    let activePointerId: number | null = null
    let isPointerDown = false
    let isDragging = false
    let startX = 0
    let startOffset = 0

    const endPointer = (event: PointerEvent) => {
      if (!isPointerDown || event.pointerId !== activePointerId) return

      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', endPointer)
      document.removeEventListener('pointercancel', endPointer)

      if (isDragging) {
        if (container.hasPointerCapture(event.pointerId)) {
          container.releasePointerCapture(event.pointerId)
        }
        container.classList.remove('is-dragging')
      }

      isPointerDown = false
      isDragging = false
      isDraggingRef.current = false
      activePointerId = null
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!isPointerDown || event.pointerId !== activePointerId) return

      const deltaX = event.clientX - startX

      if (!isDragging) {
        if (Math.abs(deltaX) <= DRAG_THRESHOLD_PX) return
        isDragging = true
        isDraggingRef.current = true
        container.classList.add('is-dragging')
        container.setPointerCapture(event.pointerId)
      }

      event.preventDefault()
      offsetRef.current = wrapOffset(startOffset - deltaX, seqWidth)
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || seqWidth <= 0) return

      isPointerDown = true
      isDragging = false
      activePointerId = event.pointerId
      startX = event.clientX
      startOffset = offsetRef.current

      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', endPointer)
      document.addEventListener('pointercancel', endPointer)
    }

    const onDragStart = (event: DragEvent) => {
      event.preventDefault()
    }

    container.addEventListener('pointerdown', onPointerDown)
    container.addEventListener('dragstart', onDragStart)

    return () => {
      container.removeEventListener('pointerdown', onPointerDown)
      container.removeEventListener('dragstart', onDragStart)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', endPointer)
      document.removeEventListener('pointercancel', endPointer)
      container.classList.remove('is-dragging')
      isDraggingRef.current = false
    }
  }, [canDrag, seqWidth])

  const cssVariables = useMemo(
    () =>
      ({
        '--logoloop-gap': `${gap}px`,
        '--logoloop-logoHeight': `${logoHeight}px`,
        ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor }),
      }) as CSSProperties,
    [gap, logoHeight, fadeOutColor],
  )

  const rootClassName = useMemo(
    () =>
      [
        'logoloop',
        isVertical ? 'logoloop--vertical' : 'logoloop--horizontal',
        fadeOut && 'logoloop--fade',
        scaleOnHover && 'logoloop--scale-hover',
        canDrag && 'logoloop--draggable',
        className,
      ]
        .filter(Boolean)
        .join(' '),
    [isVertical, fadeOut, scaleOnHover, canDrag, className],
  )

  const handleMouseEnter = useCallback(() => {
    if (effectiveHoverSpeed !== undefined) setIsHovered(true)
  }, [effectiveHoverSpeed])
  const handleMouseLeave = useCallback(() => {
    if (effectiveHoverSpeed !== undefined) setIsHovered(false)
  }, [effectiveHoverSpeed])

  const renderLogoItem = useCallback(
    (item: LogoItem, key: Key) => {
      if (renderItem) {
        return (
          <li className="logoloop__item" key={key} role="listitem">
            {renderItem(item, key)}
          </li>
        )
      }
      const isNodeItem = 'node' in item
      const content = isNodeItem ? (
        <span className="logoloop__node" aria-hidden={!!item.href && !item.ariaLabel}>
          {item.node}
        </span>
      ) : (
        <img
          src={item.src}
          srcSet={item.srcSet}
          sizes={item.sizes}
          width={item.width}
          height={item.height}
          alt={item.alt ?? ''}
          title={item.title}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      )
      const itemAriaLabel = isNodeItem ? (item.ariaLabel ?? item.title) : (item.alt ?? item.title)
      const itemContent = item.href ? (
        <a
          className="logoloop__link"
          href={item.href}
          aria-label={itemAriaLabel || 'logo link'}
          target="_blank"
          rel="noreferrer noopener"
        >
          {content}
        </a>
      ) : (
        content
      )
      return (
        <li className="logoloop__item" key={key} role="listitem">
          {itemContent}
        </li>
      )
    },
    [renderItem],
  )

  const logoLists = useMemo(
    () =>
      Array.from({ length: copyCount }, (_, copyIndex) => (
        <ul
          className="logoloop__list"
          key={`copy-${copyIndex}`}
          role="list"
          aria-hidden={copyIndex > 0}
          ref={copyIndex === 0 ? seqRef : undefined}
        >
          {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
        </ul>
      )),
    [copyCount, logos, renderLogoItem],
  )

  const containerStyle = useMemo(
    () => ({
      width: isVertical
        ? toCssLength(width) === '100%'
          ? undefined
          : toCssLength(width)
        : (toCssLength(width) ?? '100%'),
      ...cssVariables,
      ...style,
    }),
    [width, cssVariables, style, isVertical],
  )

  return (
    <div
      ref={containerRef}
      className={rootClassName}
      style={containerStyle}
      role="region"
      aria-label={ariaLabel}
    >
      <div
        className="logoloop__track"
        ref={trackRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {logoLists}
      </div>
    </div>
  )
})

LogoLoop.displayName = 'LogoLoop'

export default LogoLoop
