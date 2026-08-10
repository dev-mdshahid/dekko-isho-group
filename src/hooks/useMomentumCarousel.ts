import { type RefObject, useEffect } from 'react'
import gsap from 'gsap'

type MomentumCarouselOptions = {
  /** Extra end padding so the last card can align with the start gutter. */
  endPadding?: number
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
  { endPadding = 0 }: MomentumCarouselOptions = {},
) {
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

    const cards = () => Array.from(track.children) as HTMLElement[]

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
      offset = value
      settleTween?.kill()
      settleTween = null

      if (withTransition && !prefersReducedMotion()) {
        settleTween = gsap.to(track, {
          x: -offset,
          duration: SETTLE_DURATION,
          ease: 'power3.out',
          overwrite: true,
        })
        return
      }

      gsap.set(track, { x: -offset })
    }

    const nearestSnapOffset = (from: number, direction: number) => {
      const items = cards()
      if (items.length === 0) return 0

      const positions = items.map((card) => card.offsetLeft)
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
        return Math.abs(card.offsetLeft - offset) < Math.abs(items[closest]!.offsetLeft - offset)
          ? index
          : closest
      }, 0)

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        const next = Math.min(items.length - 1, currentIndex + 1)
        applyOffset(clamp(items[next]!.offsetLeft, 0, maxOffset), true)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        const prev = Math.max(0, currentIndex - 1)
        applyOffset(clamp(items[prev]!.offsetLeft, 0, maxOffset), true)
      } else if (event.key === 'Home') {
        event.preventDefault()
        applyOffset(0, true)
      } else if (event.key === 'End') {
        event.preventDefault()
        applyOffset(maxOffset, true)
      }
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
      gsap.set(track, { clearProps: 'transform' })
    }
  }, [viewportRef, trackRef, endPadding])
}
