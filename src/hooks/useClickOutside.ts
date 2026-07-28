import { useEffect, useEffectEvent, type RefObject } from 'react'

/**
 * Call `onClickOutside` when a pointer goes down outside the given element.
 * Callback identity does not rebind the listener (useEffectEvent).
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onClickOutside: () => void,
  enabled = true,
) {
  const handleOutside = useEffectEvent((event: PointerEvent) => {
    const target = event.target
    if (!(target instanceof Node)) {
      return
    }
    if (ref.current?.contains(target)) {
      return
    }
    onClickOutside()
  })

  useEffect(() => {
    if (!enabled) {
      return undefined
    }

    // pointerdown covers mouse + touch; runs before click so toggle stays consistent.
    document.addEventListener('pointerdown', handleOutside)
    return () => document.removeEventListener('pointerdown', handleOutside)
  }, [enabled, handleOutside])
}
