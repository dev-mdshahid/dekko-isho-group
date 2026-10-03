import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { MOBILE_NAV_QUERY } from './useMediaQuery'

/**
 * Mobile drawer open/close with body scroll lock, Escape, route close, and resize close.
 */
export function useNavMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { pathname } = useLocation()

  const closeMenu = useCallback(() => setIsOpen(false), [])
  const toggleMenu = useCallback(() => setIsOpen((value) => !value), [])

  useEffect(() => {
    closeMenu()
  }, [pathname, closeMenu])

  // If the viewport leaves the mobile breakpoint while the drawer is open, close it.
  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_NAV_QUERY)

    function handleChange(event: MediaQueryListEvent) {
      if (!event.matches) {
        closeMenu()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [closeMenu])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeMenu])

  return {
    isOpen,
    toggleMenu,
    closeMenu,
  }
}
