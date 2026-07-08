import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { AwardHonor } from '../data/awards/honors'
import { distributeHonorsColumns, getHonorsColumnCount } from '../lib/awards/distributeHonorsColumns'
import { prefersReducedMotion } from '../lib/animations/prefersReducedMotion'

const FLOAT_EXIT_MS = 520

type ColumnState = {
  y: number
  speed: number
}

type HoveredCard = {
  cardKey: string
  award: AwardHonor
  element: HTMLElement
}

export type ActiveHonorFloat = {
  award: AwardHonor
  cardKey: string
  rect: DOMRect
  phase: 'entering' | 'active' | 'exiting'
}

type Options = {
  awards: AwardHonor[]
}

export function useAwardsHonorsWall({ awards }: Options) {
  const [columnCount, setColumnCount] = useState(() =>
    typeof window !== 'undefined' ? getHonorsColumnCount(window.innerWidth) : 4,
  )
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' ? prefersReducedMotion() : false,
  )
  const [isLit, setIsLit] = useState(false)
  const [ghostCardKey, setGhostCardKey] = useState<string | null>(null)
  const [reenteringCardKey, setReenteringCardKey] = useState<string | null>(null)
  const [activeFloat, setActiveFloat] = useState<ActiveHonorFloat | null>(null)

  const columnInnerRefs = useRef<(HTMLDivElement | null)[]>([])
  const columnStatesRef = useRef<ColumnState[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const exitTimeoutRef = useRef<number | null>(null)
  const reentryTimeoutRef = useRef<number | null>(null)
  const pendingDismissTimeoutRef = useRef<number | null>(null)
  const enterFrameRef = useRef<number | null>(null)
  const isPausedRef = useRef(false)
  const exitingRef = useRef(false)
  const activeFloatRef = useRef<ActiveHonorFloat | null>(null)
  const ghostCardKeyRef = useRef<string | null>(null)
  const hoveredCardRef = useRef<HoveredCard | null>(null)

  const columns = useMemo(
    () => distributeHonorsColumns(awards, columnCount),
    [awards, columnCount],
  )

  useEffect(() => {
    ghostCardKeyRef.current = ghostCardKey
  }, [ghostCardKey])

  const clearExitTimeout = useCallback(() => {
    if (exitTimeoutRef.current !== null) {
      window.clearTimeout(exitTimeoutRef.current)
      exitTimeoutRef.current = null
    }
  }, [])

  const clearPendingDismiss = useCallback(() => {
    if (pendingDismissTimeoutRef.current !== null) {
      window.clearTimeout(pendingDismissTimeoutRef.current)
      pendingDismissTimeoutRef.current = null
    }
  }, [])

  const clearEnterFrame = useCallback(() => {
    if (enterFrameRef.current !== null) {
      window.cancelAnimationFrame(enterFrameRef.current)
      enterFrameRef.current = null
    }
  }, [])

  const scheduleReentry = useCallback((cardKey: string) => {
    setReenteringCardKey(cardKey)
    if (reentryTimeoutRef.current !== null) {
      window.clearTimeout(reentryTimeoutRef.current)
    }
    reentryTimeoutRef.current = window.setTimeout(() => {
      setReenteringCardKey(null)
      reentryTimeoutRef.current = null
    }, 500)
  }, [])

  const setPaused = useCallback((paused: boolean) => {
    isPausedRef.current = paused
  }, [])

  const commitFloat = useCallback((next: ActiveHonorFloat | null) => {
    activeFloatRef.current = next
    setActiveFloat(next)
  }, [])

  const activateFloat = useCallback(
    (cardKey: string, award: AwardHonor, cardElement: HTMLElement) => {
      if (reducedMotion || !cardElement.isConnected) return

      hoveredCardRef.current = { cardKey, award, element: cardElement }
      clearPendingDismiss()
      clearEnterFrame()

      const current = activeFloatRef.current
      if (current?.cardKey === cardKey && current.phase !== 'exiting' && !exitingRef.current) {
        return
      }

      clearExitTimeout()
      exitingRef.current = false
      setPaused(true)

      const previousGhost = ghostCardKeyRef.current
      if (previousGhost && previousGhost !== cardKey) {
        scheduleReentry(previousGhost)
      }

      const rect = cardElement.getBoundingClientRect()
      setGhostCardKey(cardKey)
      setIsLit(true)

      // Already open (or mid-exit): morph the same float to the next card.
      if (current) {
        commitFloat({
          award,
          cardKey,
          rect,
          phase: 'active',
        })
        return
      }

      commitFloat({
        award,
        cardKey,
        rect,
        phase: 'entering',
      })

      // Wait two frames so the float paints in its resting state before animating open.
      enterFrameRef.current = window.requestAnimationFrame(() => {
        enterFrameRef.current = window.requestAnimationFrame(() => {
          enterFrameRef.current = null
          const active = activeFloatRef.current
          if (!active || active.cardKey !== cardKey || active.phase !== 'entering') return
          commitFloat({ ...active, phase: 'active' })
        })
      })
    },
    [
      clearEnterFrame,
      clearExitTimeout,
      clearPendingDismiss,
      commitFloat,
      reducedMotion,
      scheduleReentry,
      setPaused,
    ],
  )

  const dismissFloat = useCallback(() => {
    clearPendingDismiss()
    clearEnterFrame()
    if (!activeFloatRef.current || exitingRef.current) return

    exitingRef.current = true
    setIsLit(false)
    commitFloat(
      activeFloatRef.current
        ? { ...activeFloatRef.current, phase: 'exiting' }
        : null,
    )
    clearExitTimeout()

    exitTimeoutRef.current = window.setTimeout(() => {
      const ghostKey = ghostCardKeyRef.current
      commitFloat(null)
      setGhostCardKey(null)
      exitingRef.current = false
      exitTimeoutRef.current = null

      const hovered = hoveredCardRef.current
      if (hovered?.element.isConnected) {
        // Cursor never left (or already entered another card) during the close animation.
        activateFloat(hovered.cardKey, hovered.award, hovered.element)
        return
      }

      if (ghostKey) {
        scheduleReentry(ghostKey)
      }

      setPaused(false)
    }, FLOAT_EXIT_MS)
  }, [
    activateFloat,
    clearEnterFrame,
    clearExitTimeout,
    clearPendingDismiss,
    commitFloat,
    scheduleReentry,
    setPaused,
  ])

  const requestDismissFloat = useCallback(
    (cardKey?: string) => {
      if (!activeFloatRef.current) return
      if (cardKey && activeFloatRef.current.cardKey !== cardKey) return

      if (hoveredCardRef.current?.cardKey === cardKey || !cardKey) {
        hoveredCardRef.current = null
      }

      clearPendingDismiss()
      pendingDismissTimeoutRef.current = window.setTimeout(() => {
        pendingDismissTimeoutRef.current = null
        // Another card may have been hovered in the meantime.
        if (hoveredCardRef.current) return
        dismissFloat()
      }, 0)
    },
    [clearPendingDismiss, dismissFloat],
  )

  const clearHoverAndDismiss = useCallback(() => {
    hoveredCardRef.current = null
    dismissFloat()
  }, [dismissFloat])

  useEffect(() => {
    const updateColumnCount = () => setColumnCount(getHonorsColumnCount(window.innerWidth))
    const updateReducedMotion = () => setReducedMotion(prefersReducedMotion())

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    updateColumnCount()
    updateReducedMotion()

    window.addEventListener('resize', updateColumnCount)
    motionQuery.addEventListener('change', updateReducedMotion)

    return () => {
      window.removeEventListener('resize', updateColumnCount)
      motionQuery.removeEventListener('change', updateReducedMotion)
    }
  }, [])

  useEffect(() => {
    hoveredCardRef.current = null
    clearPendingDismiss()
    clearEnterFrame()
    clearExitTimeout()
    exitingRef.current = false
    activeFloatRef.current = null
    setActiveFloat(null)
    setGhostCardKey(null)
    setReenteringCardKey(null)
    setIsLit(false)
    setPaused(false)
    columnInnerRefs.current = []
    columnStatesRef.current = []
  }, [columnCount, awards.length, clearEnterFrame, clearExitTimeout, clearPendingDismiss, setPaused])

  useEffect(() => {
    if (reducedMotion) return

    columnStatesRef.current = Array.from({ length: columnCount }, (_, index) => ({
      y: Math.random() * 200,
      speed: index % 2 === 0 ? 0.9 : 1.2,
    }))

    const tick = () => {
      if (!isPausedRef.current) {
        columnInnerRefs.current.forEach((element, index) => {
          const state = columnStatesRef.current[index]
          if (!element || !state) return

          state.y += state.speed
          const halfHeight = element.scrollHeight / 2

          if (halfHeight > 0 && state.y >= halfHeight) {
            state.y -= halfHeight
          }

          element.style.transform = `translate3d(0, ${-state.y}px, 0)`
        })
      }

      animationFrameRef.current = window.requestAnimationFrame(tick)
    }

    animationFrameRef.current = window.requestAnimationFrame(tick)

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [columnCount, reducedMotion])

  useEffect(() => {
    const handleDismiss = () => clearHoverAndDismiss()

    window.addEventListener('scroll', handleDismiss, { passive: true })
    window.addEventListener('resize', handleDismiss)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearHoverAndDismiss()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('scroll', handleDismiss)
      window.removeEventListener('resize', handleDismiss)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [clearHoverAndDismiss])

  const handleReentryEnd = useCallback((cardKey: string) => {
    setReenteringCardKey((current) => (current === cardKey ? null : current))
  }, [])

  useEffect(() => {
    return () => {
      clearExitTimeout()
      clearPendingDismiss()
      clearEnterFrame()
      if (reentryTimeoutRef.current !== null) {
        window.clearTimeout(reentryTimeoutRef.current)
      }
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [clearEnterFrame, clearExitTimeout, clearPendingDismiss])

  const setColumnRef = useCallback((index: number, element: HTMLDivElement | null) => {
    columnInnerRefs.current[index] = element
  }, [])

  return {
    columns,
    reducedMotion,
    isLit,
    ghostCardKey,
    reenteringCardKey,
    activeFloat,
    activateFloat,
    dismissFloat: clearHoverAndDismiss,
    requestDismissFloat,
    setColumnRef,
    handleReentryEnd,
  }
}
