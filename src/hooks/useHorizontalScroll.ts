import { type RefObject, useEffect } from 'react'

type HorizontalScrollOptions = {
  /** When false, only pointer-drag scrolls horizontally; vertical wheel passes through to the page. */
  enableWheel?: boolean
}

const DRAG_THRESHOLD_PX = 8

/** Pointer-drag horizontal scrolling for overflow containers. Optional wheel mapping on desktop. */
export function useHorizontalScroll(
  ref: RefObject<HTMLElement | null>,
  { enableWheel = true }: HorizontalScrollOptions = {},
) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    let isPointerDown = false
    let isDragging = false
    let suppressClick = false
    let startX = 0
    let scrollStart = 0
    let activePointerId: number | null = null

    const canScroll = () => element.scrollWidth > element.clientWidth

    const onWheel = (event: WheelEvent) => {
      if (!enableWheel || !canScroll()) return

      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      if (delta === 0) return

      event.preventDefault()
      element.scrollLeft += delta
    }

    const onDragStart = (event: DragEvent) => {
      event.preventDefault()
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!isPointerDown || event.pointerId !== activePointerId) return

      const deltaX = event.clientX - startX

      if (!isDragging) {
        if (Math.abs(deltaX) <= DRAG_THRESHOLD_PX) return

        isDragging = true
        suppressClick = true
        element.setPointerCapture(event.pointerId)
        element.classList.add('is-dragging')
      }

      event.preventDefault()
      element.scrollLeft = scrollStart - deltaX
    }

    const endPointer = (event: PointerEvent) => {
      if (!isPointerDown || event.pointerId !== activePointerId) return

      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', endPointer)
      document.removeEventListener('pointercancel', endPointer)

      if (isDragging) {
        if (element.hasPointerCapture(event.pointerId)) {
          element.releasePointerCapture(event.pointerId)
        }
        element.classList.remove('is-dragging')
      }

      isPointerDown = false
      isDragging = false
      activePointerId = null
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || !canScroll()) return

      isPointerDown = true
      isDragging = false
      suppressClick = false
      activePointerId = event.pointerId
      startX = event.clientX
      scrollStart = element.scrollLeft

      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', endPointer)
      document.addEventListener('pointercancel', endPointer)
    }

    const onClick = (event: MouseEvent) => {
      if (!suppressClick) return

      event.preventDefault()
      event.stopPropagation()
      suppressClick = false
    }

    if (enableWheel) {
      element.addEventListener('wheel', onWheel, { passive: false })
    }
    element.addEventListener('dragstart', onDragStart)
    element.addEventListener('pointerdown', onPointerDown)
    element.addEventListener('click', onClick, true)

    return () => {
      if (enableWheel) {
        element.removeEventListener('wheel', onWheel)
      }
      element.removeEventListener('dragstart', onDragStart)
      element.removeEventListener('pointerdown', onPointerDown)
      element.removeEventListener('click', onClick, true)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', endPointer)
      document.removeEventListener('pointercancel', endPointer)
      element.classList.remove('is-dragging')
    }
  }, [ref, enableWheel])
}
