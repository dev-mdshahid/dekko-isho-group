import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  businessNavGroups,
  isNavLinkActive,
  type NavLinkGroup,
} from '../data/navigation/navLinks'
import { getLenis } from '../lib/smoothScroll'

export type DesktopDropdownId = 'solutions' | 'businesses' | 'media'

const SCROLL_CLOSE_GRACE_MS = 150
const SCROLL_CLOSE_DELTA_PX = 10

function findActiveBusinessGroup(pathname: string): NavLinkGroup['id'] | null {
  for (const group of businessNavGroups) {
    if (group.links.some((link) => isNavLinkActive(pathname, link.to))) {
      return group.id
    }
  }
  return null
}

/**
 * Single source of truth for desktop nav dropdown open/close + nested Businesses panel.
 * Handles route changes, Escape, scroll (with layout-shift grace), and mobile disable.
 */
export function useNavDropdowns(enabled: boolean) {
  const { pathname } = useLocation()
  const [openId, setOpenId] = useState<DesktopDropdownId | null>(null)
  const [expandedGroupId, setExpandedGroupId] = useState<NavLinkGroup['id'] | null>(null)
  const openIdRef = useRef(openId)
  openIdRef.current = openId

  const closeAll = useCallback(() => {
    setOpenId(null)
    setExpandedGroupId(null)
  }, [])

  const toggle = useCallback(
    (id: DesktopDropdownId) => {
      if (openIdRef.current === id) {
        setOpenId(null)
        setExpandedGroupId(null)
        return
      }

      setOpenId(id)
      setExpandedGroupId(id === 'businesses' ? findActiveBusinessGroup(pathname) : null)
    },
    [pathname],
  )

  const expandGroup = useCallback((groupId: NavLinkGroup['id']) => {
    setExpandedGroupId(groupId)
  }, [])

  const toggleGroup = useCallback((groupId: NavLinkGroup['id']) => {
    setExpandedGroupId((current) => (current === groupId ? null : groupId))
  }, [])

  // Close when navigating.
  useEffect(() => {
    closeAll()
  }, [pathname, closeAll])

  // Close when switching to mobile layout (desktop menus unmount).
  useEffect(() => {
    if (!enabled) {
      closeAll()
    }
  }, [enabled, closeAll])

  // Escape closes any open panel.
  useEffect(() => {
    if (!enabled || openId === null) {
      return undefined
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeAll()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enabled, openId, closeAll])

  // Close on real user scroll; ignore tiny shifts right after open (sticky/nav height).
  useEffect(() => {
    if (!enabled || openId === null) {
      return undefined
    }

    const openedAt = Date.now()
    let lastY = window.scrollY

    function handleScroll() {
      if (Date.now() - openedAt < SCROLL_CLOSE_GRACE_MS) {
        lastY = window.scrollY
        return
      }

      const y = window.scrollY
      if (Math.abs(y - lastY) < SCROLL_CLOSE_DELTA_PX) {
        return
      }

      closeAll()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    const lenis = getLenis()
    lenis?.on('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      lenis?.off('scroll', handleScroll)
    }
  }, [enabled, openId, closeAll])

  return {
    openId,
    expandedGroupId,
    isOpen: (id: DesktopDropdownId) => openId === id,
    toggle,
    closeAll,
    expandGroup,
    toggleGroup,
  }
}
