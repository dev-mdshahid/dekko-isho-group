import { useCallback, useEffect, useRef, useState } from 'react'

import type { AwardHonor } from '../data/awards/honors'
import { distributeHonorsColumns, getHonorsColumnCount } from '../lib/awards/distributeHonorsColumns'
import { prefersReducedMotion } from '../lib/animations/prefersReducedMotion'

const FLOAT_EXIT_MS = 450

type ColumnState = {
  y: number
  speed: number
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
  const exitingRef = useRef(false)
  const activeFloatRef = useRef<ActiveHonorFloat | null>(null)
  const ghostCardKeyRef = useRef<string | null>(null)

  const columns = distributeHonorsColumns(awards, columnCount)

  useEffect(() => {
    activeFloatRef.current = activeFloat
  }, [activeFloat])

  useEffect(() => {
    ghostCardKeyRef.current = ghostCardKey
  }, [ghostCardKey])

  const clearExitTimeout = useCallback(() => {
    if (exitTimeoutRef.current !== null) {
      window.clearTimeout(exitTimeoutRef.current)
      exitTimeoutRef.current = null
    }
  }, [])

  const dismissFloat = useCallback(() => {
    if (!activeFloatRef.current || exitingRef.current) return

    exitingRef.current = true
    setIsLit(false)
    setActiveFloat((current) => (current ? { ...current, phase: 'exiting' } : null))
    clearExitTimeout()

    exitTimeoutRef.current = window.setTimeout(() => {
      const ghostKey = ghostCardKeyRef.current
      setActiveFloat(null)
      setGhostCardKey(null)

      if (ghostKey) {
        setReenteringCardKey(ghostKey)
        if (reentryTimeoutRef.current !== null) {
          window.clearTimeout(reentryTimeoutRef.current)
        }
        reentryTimeoutRef.current = window.setTimeout(() => {
          setReenteringCardKey(null)
          reentryTimeoutRef.current = null
        }, 1000)
      }

      exitingRef.current = false
      exitTimeoutRef.current = null
    }, FLOAT_EXIT_MS)
  }, [clearExitTimeout])

  const activateFloat = useCallback(
    (cardKey: string, award: AwardHonor, cardElement: HTMLElement) => {
      if (reducedMotion || exitingRef.current || activeFloatRef.current) {
        return
      }

      const rect = cardElement.getBoundingClientRect()
      setGhostCardKey(cardKey)
      setIsLit(true)
      setActiveFloat({
        award,
        cardKey,
        rect,
        phase: 'entering',
      })

      requestAnimationFrame(() => {
        setActiveFloat((current) =>
          current?.cardKey === cardKey ? { ...current, phase: 'active' } : current,
        )
      })
    },
    [reducedMotion],
  )

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
    dismissFloat()
    columnInnerRefs.current = []
    columnStatesRef.current = []
  }, [columnCount, awards.length, dismissFloat])

  useEffect(() => {
    if (reducedMotion) return

    columnStatesRef.current = columns.map((_, index) => ({
      y: Math.random() * 200,
      speed: index % 2 === 0 ? 0.9 : 1.2,
    }))

    const tick = () => {
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

      animationFrameRef.current = window.requestAnimationFrame(tick)
    }

    animationFrameRef.current = window.requestAnimationFrame(tick)

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [columns, reducedMotion])

  useEffect(() => {
    const handleDismiss = () => dismissFloat()

    window.addEventListener('scroll', handleDismiss, { passive: true })
    window.addEventListener('resize', handleDismiss)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismissFloat()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('scroll', handleDismiss)
      window.removeEventListener('resize', handleDismiss)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [dismissFloat])

  const handleReentryEnd = useCallback((cardKey: string) => {
    setReenteringCardKey((current) => (current === cardKey ? null : current))
  }, [])

  useEffect(() => {
    return () => {
      clearExitTimeout()
      if (reentryTimeoutRef.current !== null) {
        window.clearTimeout(reentryTimeoutRef.current)
      }
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [clearExitTimeout])

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
    dismissFloat,
    setColumnRef,
    handleReentryEnd,
  }
}
