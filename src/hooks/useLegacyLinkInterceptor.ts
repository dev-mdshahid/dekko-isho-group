import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { resetScrollPosition } from '../lib/resetRouteScroll'

export function useLegacyLinkInterceptor(containerRef: React.RefObject<HTMLElement | null>) {
  const navigate = useNavigate()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest('a')
      if (!target || !container.contains(target)) return

      // Let React Router <Link> handle navigation — same path as footer/nav links.
      if (target.hasAttribute('data-discover')) return

      const href = target.getAttribute('href')
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return
      }

      if (href.startsWith('#')) return

      if (
        href.startsWith('/legacy/') ||
        href.startsWith('/documents/') ||
        target.hasAttribute('target')
      ) {
        return
      }

      if (href.startsWith('/')) {
        event.preventDefault()
        resetScrollPosition()
        navigate(href)
      }
    }

    container.addEventListener('click', onClick)
    return () => container.removeEventListener('click', onClick)
  }, [containerRef, navigate])
}
