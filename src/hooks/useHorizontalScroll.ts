import { type RefObject, useEffect } from 'react'

/** Wheel + mouse-drag horizontal scrolling for overflow containers on desktop. */
export function useHorizontalScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    let isDragging = false
    let startX = 0
    let scrollStart = 0
    let activePointerId: number | null = null

    const canScroll = () => element.scrollWidth > element.clientWidth

    const onWheel = (event: WheelEvent) => {
      if (!canScroll()) return

      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      if (delta === 0) return

      event.preventDefault()
      element.scrollLeft += delta
    }

    const onDragStart = (event: DragEvent) => {
      event.preventDefault()
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0 || !canScroll()) return

      event.preventDefault()
      isDragging = true
      activePointerId = event.pointerId
      startX = event.clientX
      scrollStart = element.scrollLeft
      element.setPointerCapture(event.pointerId)
      element.classList.add('is-dragging')
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!isDragging || event.pointerId !== activePointerId) return

      event.preventDefault()
      element.scrollLeft = scrollStart - (event.clientX - startX)
    }

    const endDrag = (event: PointerEvent) => {
      if (!isDragging || event.pointerId !== activePointerId) return

      isDragging = false
      activePointerId = null
      element.classList.remove('is-dragging')
      element.releasePointerCapture(event.pointerId)
    }

    element.addEventListener('wheel', onWheel, { passive: false })
    element.addEventListener('dragstart', onDragStart)
    element.addEventListener('pointerdown', onPointerDown)
    element.addEventListener('pointermove', onPointerMove)
    element.addEventListener('pointerup', endDrag)
    element.addEventListener('pointercancel', endDrag)

    return () => {
      element.removeEventListener('wheel', onWheel)
      element.removeEventListener('dragstart', onDragStart)
      element.removeEventListener('pointerdown', onPointerDown)
      element.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerup', endDrag)
      element.removeEventListener('pointercancel', endDrag)
      element.classList.remove('is-dragging')
    }
  }, [ref])
}
