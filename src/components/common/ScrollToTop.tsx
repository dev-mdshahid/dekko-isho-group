import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { resetRouteScroll } from '../../lib/resetRouteScroll'

/** Scrolls to the top when navigating to a new route (unless targeting a hash). */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return

    resetRouteScroll()

    const frame = requestAnimationFrame(() => {
      resetRouteScroll()
      ScrollTrigger.refresh()
    })

    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
