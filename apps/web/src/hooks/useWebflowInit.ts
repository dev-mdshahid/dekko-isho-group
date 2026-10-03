import { type RefObject, useEffect } from 'react'
import { reinitWebflow } from '../lib/webflow'

/** Load Webflow scripts and re-init IX2/tabs/slider after React content is in the DOM. */
export function useWebflowInit(containerRef?: RefObject<HTMLElement | null>, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    let frame = 0

    frame = requestAnimationFrame(() => {
      void (async () => {
        try {
          await reinitWebflow()
          if (!cancelled && containerRef?.current) {
            // Second pass after layout settles (StrictMode-safe)
            requestAnimationFrame(() => {
              if (!cancelled) void reinitWebflow()
            })
          }
        } catch (err) {
          console.error(err)
        }
      })()
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [containerRef, enabled])
}
