import { type RefObject, useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'

type MomentumCarouselOptions = {
  /** Extra end padding so the last card can align with the start gutter. */
  endPadding?: number
  /** Reports the card currently represented by the carousel position. */
  onActiveIndexChange?: (index: number) => void
}

type MomentumCarouselController = {
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
  { endPadding = 0, onActiveIndexChange }: MomentumCarouselOptions = {},
): MomentumCarouselController {
  const goToIndexRef = useRef<(index: number) => void>(() => undefined)

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

    const cards = () => Array.from(track.children) as HTMLElement[]

    const reportActiveIndex = (forcedIndex?: number) => {
      const items = cards()
      if (items.length === 0) return

      let activeIndex = forcedIndex

      if (activeIndex === undefined) {
        const viewportRect = viewport.getBoundingClientRect()
        const viewportCenter = viewportRect.left + viewportRect.width / 2
        let closestDistance = Number.POSITIVE_INFINITY
        activeIndex = 0

        items.forEach((card, index) => {
          const cardRect = card.getBoundingClientRect()
          const cardCenter = cardRect.left + cardRect.width / 2
          const distance = Math.abs(viewportCenter - cardCenter)

          if (distance < closestDistance) {
            closestDistance = distance
            activeIndex = index
          }
        })
      }

      if (activeIndex === lastReportedIndex) return
      lastReportedIndex = activeIndex
      onActiveIndexChange?.(activeIndex)
    }

    const centeredOffset = (card: HTMLElement) => {
      return clamp(
        card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2,
        0,
        maxOffset,
      )
    }

    const measure = () => {
      const styles = getComputedStyle(viewport)
      const padLeft = Number.parseFloat(styles.paddingLeft) || 0
      const padRight = Number.parseFloat(styles.paddingRight) || 0
      const visibleWidth = Math.max(0, viewport.clientWidth - padLeft - padRight)
      const items = cards()
      const lastCard = items[items.length - 1]
      const lastCardSnap = lastCard?.offsetLeft ?? 0

      // Allow scrolling to the last card's left snap, and far enough to keep the
      // track's right padding visible after that card.
      const endWithPadding = Math.max(0, track.scrollWidth + endPadding - visibleWidth)
      maxOffset = Math.max(0, lastCardSnap, endWithPadding)
      offset = clamp(offset, 0, maxOffset)
      applyOffset(offset, false)
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
      const items = cards()
      if (items.length === 0) return 0

      const positions = items.map(centeredOffset)
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

      const items = cards()
      if (items.length === 0) return

      const currentIndex = items.reduce((closest, card, index) => {
        return Math.abs(centeredOffset(card) - offset) < Math.abs(centeredOffset(items[closest]!) - offset)
          ? index
          : closest
      }, 0)

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        const next = Math.min(items.length - 1, currentIndex + 1)
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
        goToIndexRef.current(items.length - 1)
      }
    }

    goToIndexRef.current = (requestedIndex: number) => {
      const items = cards()
      if (items.length === 0) return

      const index = clamp(Math.round(requestedIndex), 0, items.length - 1)
      const targetCard = items[index]
      if (!targetCard) return

      stopInertia()
      settleTween?.kill()
      settleTween = null
      navigationTargetIndex = index
      reportActiveIndex(index)
      applyOffset(centeredOffset(targetCard), true)
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
  }, [viewportRef, trackRef, endPadding, onActiveIndexChange])

  const goToIndex = useCallback((index: number) => {
    goToIndexRef.current(index)
  }, [])

  return { goToIndex }
}
