import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'

import type { AwardHonor } from '../data/awards/honors'
import { distributeHonorsColumns, getHonorsColumnCount } from '../lib/awards/distributeHonorsColumns'
import { prefersReducedMotion } from '../lib/animations/prefersReducedMotion'

const FLOAT_EXIT_MS = 450
const FLOAT_GUARD_PAD = 6

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
  const [exitingFloat, setExitingFloat] = useState<ActiveHonorFloat | null>(null)

  const columnInnerRefs = useRef<(HTMLDivElement | null)[]>([])
  const columnStatesRef = useRef<ColumnState[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const exitTimeoutRef = useRef<number | null>(null)
  const reentryTimeoutRef = useRef<number | null>(null)
  const activeFloatRef = useRef<ActiveHonorFloat | null>(null)
  const floatElRef = useRef<HTMLDivElement | null>(null)
  const ghostCardKeyRef = useRef<string | null>(null)
  const awardsByIdRef = useRef<Map<string, AwardHonor>>(new Map())

  const columns = useMemo(
    () => distributeHonorsColumns(awards, columnCount),
    [awards, columnCount],
  )

  useEffect(() => {
    awardsByIdRef.current = new Map(awards.map((award) => [award.id, award]))
  }, [awards])

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
    const current = activeFloatRef.current
    if (!current) return

    const ghostKey = ghostCardKeyRef.current
    activeFloatRef.current = null
    floatElRef.current = null
    setActiveFloat(null)
    setGhostCardKey(null)
    setIsLit(false)
    setExitingFloat({ ...current, phase: 'exiting' })
    clearExitTimeout()

    exitTimeoutRef.current = window.setTimeout(() => {
      setExitingFloat(null)

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

      exitTimeoutRef.current = null
    }, FLOAT_EXIT_MS)
  }, [clearExitTimeout])

  const openFloat = useCallback(
    (cardKey: string, award: AwardHonor, cardElement: HTMLDivElement) => {
      if (reducedMotion || activeFloatRef.current) return

      const rect = cardElement.getBoundingClientRect()
      const nextFloat: ActiveHonorFloat = {
        award,
        cardKey,
        rect,
        phase: 'entering',
      }

      setGhostCardKey(cardKey)
      setIsLit(true)
      activeFloatRef.current = nextFloat
      setActiveFloat(nextFloat)

      requestAnimationFrame(() => {
        setActiveFloat((current) => {
          if (current?.cardKey !== cardKey) return current
          const active = { ...current, phase: 'active' as const }
          activeFloatRef.current = active
          return active
        })
      })
    },
    [reducedMotion],
  )

  const handleWallMouseOver = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (reducedMotion || activeFloatRef.current) return

      const card = (event.target as HTMLElement).closest<HTMLDivElement>('.card')
      if (!card || card.classList.contains('ghost')) return

      const awardId = card.dataset.awardId
      if (!awardId) return

      const award = awardsByIdRef.current.get(awardId)
      const cardKey = card.dataset.cardKey
      if (!award || !cardKey) return

      openFloat(cardKey, award, card)
    },
    [openFloat, reducedMotion],
  )

  const handleFloatMouseLeave = useCallback(() => {
    dismissFloat()
  }, [dismissFloat])

  const setFloatRef = useCallback((element: HTMLDivElement | null) => {
    floatElRef.current = element
  }, [])

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
    activeFloatRef.current = null
    floatElRef.current = null
    setActiveFloat(null)
    setExitingFloat(null)
    setGhostCardKey(null)
    setReenteringCardKey(null)
    setIsLit(false)
    columnInnerRefs.current = []
    columnStatesRef.current = []
  }, [columnCount, awards.length])

  useEffect(() => {
    if (reducedMotion) return

    columnStatesRef.current = Array.from({ length: columnCount }, (_, index) => ({
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

        element.style.transform = `translateY(${-state.y}px)`
      })

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
    const handleMouseMove = (event: globalThis.MouseEvent) => {
      if (!activeFloatRef.current) return

      const floatEl = floatElRef.current
      if (!floatEl) return

      const rect = floatEl.getBoundingClientRect()
      const pad = FLOAT_GUARD_PAD

      if (
        event.clientX < rect.left - pad ||
        event.clientX > rect.right + pad ||
        event.clientY < rect.top - pad ||
        event.clientY > rect.bottom + pad
      ) {
        dismissFloat()
      }
    }

    const handleDismiss = () => dismissFloat()

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleDismiss, { passive: true })
    window.addEventListener('resize', handleDismiss)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleDismiss)
      window.removeEventListener('resize', handleDismiss)
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
    exitingFloat,
    handleWallMouseOver,
    handleFloatMouseLeave,
    setFloatRef,
    setColumnRef,
    handleReentryEnd,
    openFloat,
  }
}
