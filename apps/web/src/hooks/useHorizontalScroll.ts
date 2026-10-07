import { type RefObject, useEffect } from 'react'

type HorizontalScrollOptions = {
  /** When false, only pointer-drag scrolls horizontally; vertical wheel passes through to the page. */
  enableWheel?: boolean
  /**
   * Touch uses native overflow scrolling (smoother on mobile).
   * Mouse/pen keep JS pointer-drag.
   */
  preferNativeTouch?: boolean
}

const DRAG_THRESHOLD_PX = 8

/** Pointer-drag horizontal scrolling for overflow containers. Optional wheel mapping on desktop. */
export function useHorizontalScroll(
  ref: RefObject<HTMLElement | null>,
  { enableWheel = true, preferNativeTouch = false }: HorizontalScrollOptions = {},
) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    let isPointerDown = false
    let isDragging = false
    let suppressClick = false
    let startX = 0
    let startY = 0
    let lastX = 0
    let activePointerId: number | null = null

    const canScroll = () => element.scrollWidth > element.clientWidth

    const detachPointerListeners = () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', endPointer)
      document.removeEventListener('pointercancel', endPointer)
    }

    const onWheel = (event: WheelEvent) => {
      if (!canScroll()) return

      if (!enableWheel) {
        // Drag-only mode: block wheel/trackpad horizontal scroll, allow vertical page scroll.
        const isHorizontalIntent =
          event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)
        if (isHorizontalIntent) event.preventDefault()
        return
      }

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
      const deltaY = event.clientY - startY

      if (!isDragging) {
        const absX = Math.abs(deltaX)
        const absY = Math.abs(deltaY)
        if (absX <= DRAG_THRESHOLD_PX && absY <= DRAG_THRESHOLD_PX) return

        // Vertical intent → let the page scroll.
        if (absY > absX) {
          isPointerDown = false
          activePointerId = null
          detachPointerListeners()
          return
        }

        isDragging = true
        suppressClick = true
        lastX = event.clientX
        element.setPointerCapture(event.pointerId)
        element.classList.add('is-dragging')
        window.getSelection()?.removeAllRanges()
      }

      event.preventDefault()
      const dx = event.clientX - lastX
      lastX = event.clientX
      element.scrollLeft -= dx
    }

    const endPointer = (event: PointerEvent) => {
      if (!isPointerDown || event.pointerId !== activePointerId) return

      detachPointerListeners()

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
      // Native touch scrolling is much smoother on mobile than JS scrollLeft.
      if (preferNativeTouch && event.pointerType === 'touch') return

      isPointerDown = true
      isDragging = false
      suppressClick = false
      activePointerId = event.pointerId
      startX = event.clientX
      startY = event.clientY
      lastX = event.clientX

      document.addEventListener('pointermove', onPointerMove, { passive: false })
      document.addEventListener('pointerup', endPointer)
      document.addEventListener('pointercancel', endPointer)
    }

    const onClick = (event: MouseEvent) => {
      if (!suppressClick) return

      event.preventDefault()
      event.stopPropagation()
      suppressClick = false
    }

    element.addEventListener('wheel', onWheel, { passive: false })
    element.addEventListener('dragstart', onDragStart)
    element.addEventListener('pointerdown', onPointerDown)
    element.addEventListener('click', onClick, true)

    return () => {
      element.removeEventListener('wheel', onWheel)
      element.removeEventListener('dragstart', onDragStart)
      element.removeEventListener('pointerdown', onPointerDown)
      element.removeEventListener('click', onClick, true)
      detachPointerListeners()
      element.classList.remove('is-dragging')
    }
  }, [ref, enableWheel, preferNativeTouch])
}
