import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { resetScrollPosition } from '../../lib/resetRouteScroll'

/** Scrolls to the top when navigating to a new route (unless targeting a hash). */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  // Layout effect runs before child layout effects so ScrollTrigger start positions
  // are measured after the scroll position has been reset on route entry.
  useLayoutEffect(() => {
    if (hash) return

    resetScrollPosition()
  }, [pathname, hash])

  useLayoutEffect(() => {
    if (hash) return

    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh(true)
    })

    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
