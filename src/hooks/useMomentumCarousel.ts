import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

type MomentumCarouselOptions = {
  /** Reports the current group position, starting from zero. */
  onActiveIndexChange?: (index: number) => void
}

type MomentumCarouselController = {
  positionCount: number
  goToIndex: (index: number) => void
}

const DRAG_THRESHOLD_PX = 6
const MAX_VELOCITY = 3.2
const FRICTION = 0.92
const MIN_VELOCITY = 0.04
const SETTLE_DURATION = 0.85

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/** Drag + inertia horizontal carousel with smooth snap settle. */
export function useMomentumCarousel(
  viewportRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLElement | null>,
  { onActiveIndexChange }: MomentumCarouselOptions = {},
): MomentumCarouselController {
  const goToIndexRef = useRef<(index: number) => void>(() => undefined)
  const [positionCount, setPositionCount] = useState(0)

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    let offset = 0
    let maxOffset = 0
    let isPointerDown = false
    let isDragging = false
    let startX = 0
    let startOffset = 0
    let lastX = 0
    let lastTime = 0
    let velocity = 0
    let activePointerId: number | null = null
    let settleTween: gsap.core.Tween | null = null
    let inertiaFrame = 0
    let resizeObserver: ResizeObserver | null = null
    let lastReportedIndex = -1
    let navigationTargetIndex: number | null = null
    let positions: number[] = []

    const cards = () => Array.from(track.children) as HTMLElement[]

    const nearestIndex = () => positions.reduce((closest, position, index) => {
      return Math.abs(position - offset) < Math.abs(positions[closest]! - offset)
        ? index
        : closest
    }, 0)

    const reportActiveIndex = (forcedIndex?: number) => {
      const activeIndex = forcedIndex ?? nearestIndex()

      if (activeIndex === lastReportedIndex) return
      lastReportedIndex = activeIndex
      onActiveIndexChange?.(activeIndex)
    }

    const measure = () => {
      const currentIndex = navigationTargetIndex ?? nearestIndex()
      stopInertia()
      const items = cards()
      const rects = items.map(card => card.getBoundingClientRect())
      const firstLeft = rects[0]?.left ?? 0
      const lastRight = rects[rects.length - 1]?.right ?? firstLeft
      maxOffset = Math.max(0, lastRight - firstLeft - viewport.getBoundingClientRect().width)

      // Clamp to the final complete group and merge repeated end positions.
      // Rects retain fractional pixels, avoiding accumulated rounding errors.
      positions = []
      for (const rect of rects) {
        const position = clamp(rect.left - firstLeft, 0, maxOffset)
        if (positions.length === 0 || position - positions[positions.length - 1]! > 0.5) {
          positions.push(position)
        }
      }
      setPositionCount(positions.length)
      applyOffset(positions[Math.min(currentIndex, positions.length - 1)] ?? 0, false)

      if (activePointerId !== null && viewport.hasPointerCapture(activePointerId)) {
        viewport.releasePointerCapture(activePointerId)
      }
      isPointerDown = false
      isDragging = false
      activePointerId = null
      viewport.classList.remove('is-dragging')
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', endPointer)
      document.removeEventListener('pointercancel', endPointer)
    }

    const applyOffset = (value: number, withTransition: boolean) => {
      settleTween?.kill()
      settleTween = null

      if (withTransition && !prefersReducedMotion()) {
        const position = { value: offset }

        settleTween = gsap.to(position, {
          value,
          duration: SETTLE_DURATION,
          ease: 'power3.out',
          overwrite: true,
          onUpdate: () => {
            offset = position.value
            gsap.set(track, { x: -offset })
            reportActiveIndex(navigationTargetIndex ?? undefined)
          },
          onComplete: () => {
            offset = value
            gsap.set(track, { x: -offset })
            navigationTargetIndex = null
            reportActiveIndex()
            settleTween = null
          },
        })
        return
      }

      offset = value
      gsap.set(track, { x: -offset })
      navigationTargetIndex = null
      reportActiveIndex()
    }

    const nearestSnapOffset = (from: number, direction: number) => {
      let best = positions[0] ?? 0
      let bestDistance = Math.abs(from - best)

      for (const position of positions) {
        const distance = Math.abs(from - position)
        const prefersDirection =
          direction === 0 ||
          (direction > 0 && position >= from - 1) ||
          (direction < 0 && position <= from + 1)

        if (distance < bestDistance - 0.5 || (Math.abs(distance - bestDistance) < 0.5 && prefersDirection)) {
          best = position
          bestDistance = distance
        }
      }

      return clamp(best, 0, maxOffset)
    }

    const stopInertia = () => {
      if (inertiaFrame) {
        cancelAnimationFrame(inertiaFrame)
        inertiaFrame = 0
      }
    }

    const settleToSnap = (offsetDirection = 0) => {
      const target = nearestSnapOffset(offset, offsetDirection)
      applyOffset(target, true)
    }

    const runInertia = () => {
      stopInertia()

      // Pointer velocity is screen-space (right = positive); offset grows when content moves left.
      const offsetVelocity = -velocity

      if (prefersReducedMotion() || Math.abs(offsetVelocity) < MIN_VELOCITY) {
        settleToSnap(Math.sign(offsetVelocity))
        return
      }

      let currentVelocity = offsetVelocity

      const tick = () => {
        offset = clamp(offset + currentVelocity * 16, 0, maxOffset)
        gsap.set(track, { x: -offset })
        reportActiveIndex()
        currentVelocity *= FRICTION

        const atEdge =
          (offset <= 0 && currentVelocity < 0) || (offset >= maxOffset && currentVelocity > 0)
        if (atEdge) currentVelocity *= 0.4

        if (Math.abs(currentVelocity) < MIN_VELOCITY || (atEdge && Math.abs(currentVelocity) < 0.15)) {
          inertiaFrame = 0
          settleToSnap(Math.sign(currentVelocity || 0))
          return
        }

        inertiaFrame = requestAnimationFrame(tick)
      }

      inertiaFrame = requestAnimationFrame(tick)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!isPointerDown || event.pointerId !== activePointerId) return

      const deltaX = event.clientX - startX
      const now = event.timeStamp

      if (!isDragging) {
        if (Math.abs(deltaX) <= DRAG_THRESHOLD_PX) return
        isDragging = true
        viewport.classList.add('is-dragging')
        viewport.setPointerCapture(event.pointerId)
      }

      event.preventDefault()

      const nextOffset = clamp(startOffset - deltaX, 0, maxOffset)
      const dt = Math.max(1, now - lastTime)
      const instantVelocity = (event.clientX - lastX) / dt

      velocity = clamp(instantVelocity, -MAX_VELOCITY, MAX_VELOCITY)
      lastX = event.clientX
      lastTime = now

      applyOffset(nextOffset, false)
    }

    const endPointer = (event: PointerEvent) => {
      if (!isPointerDown || event.pointerId !== activePointerId) return

      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', endPointer)
      document.removeEventListener('pointercancel', endPointer)

      if (isDragging) {
        if (viewport.hasPointerCapture(event.pointerId)) {
          viewport.releasePointerCapture(event.pointerId)
        }
        viewport.classList.remove('is-dragging')
        runInertia()
      }

      isPointerDown = false
      isDragging = false
      activePointerId = null
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || maxOffset <= 0) return

      stopInertia()
      settleTween?.kill()
      settleTween = null
      navigationTargetIndex = null

      isPointerDown = true
      isDragging = false
      activePointerId = event.pointerId
      startX = event.clientX
      startOffset = offset
      lastX = event.clientX
      lastTime = event.timeStamp
      velocity = 0

      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', endPointer)
      document.addEventListener('pointercancel', endPointer)
    }

    const onDragStart = (event: DragEvent) => {
      event.preventDefault()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (maxOffset <= 0) return

      if (positions.length === 0) return

      const currentIndex = navigationTargetIndex ?? nearestIndex()

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        const next = Math.min(positions.length - 1, currentIndex + 1)
        goToIndexRef.current(next)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        const prev = Math.max(0, currentIndex - 1)
        goToIndexRef.current(prev)
      } else if (event.key === 'Home') {
        event.preventDefault()
        goToIndexRef.current(0)
      } else if (event.key === 'End') {
        event.preventDefault()
        goToIndexRef.current(positions.length - 1)
      }
    }

    goToIndexRef.current = (requestedIndex: number) => {
      if (positions.length === 0) return

      const index = clamp(Math.round(requestedIndex), 0, positions.length - 1)

      stopInertia()
      settleTween?.kill()
      settleTween = null
      navigationTargetIndex = index
      reportActiveIndex(index)
      applyOffset(positions[index]!, true)
    }

    measure()
    resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(viewport)
    resizeObserver.observe(track)

    viewport.addEventListener('pointerdown', onPointerDown)
    viewport.addEventListener('dragstart', onDragStart)
    viewport.addEventListener('keydown', onKeyDown)

    return () => {
      stopInertia()
      settleTween?.kill()
      resizeObserver?.disconnect()
      viewport.removeEventListener('pointerdown', onPointerDown)
      viewport.removeEventListener('dragstart', onDragStart)
      viewport.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', endPointer)
      document.removeEventListener('pointercancel', endPointer)
      viewport.classList.remove('is-dragging')
      goToIndexRef.current = () => undefined
      gsap.set(track, { clearProps: 'transform' })
    }
  }, [viewportRef, trackRef, onActiveIndexChange])

  const goToIndex = useCallback((index: number) => {
    goToIndexRef.current(index)
  }, [])

  return { goToIndex, positionCount }
}
