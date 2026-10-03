import { useEffect, useMemo, useState } from 'react'

import {
  flattenHeroLine,
  HERO_TITLE_LINES,
  type HeroCharToken,
} from '../data/home/heroTitle'
import { prefersReducedMotion } from '../lib/animations/prefersReducedMotion'

type LineTiming = {
  /** Characters revealed per second. */
  cps: number
  /** Pause before this line starts (ms). */
  linePause: number
}

const LINE_TIMING: LineTiming[] = [
  { cps: 22, linePause: 0 },
  { cps: 38, linePause: 100 },
  { cps: 30, linePause: 120 },
]

function getCharInterval(
  char: string,
  prevChar: string | undefined,
  token: HeroCharToken,
  lineIndex: number,
): number {
  const { cps } = LINE_TIMING[lineIndex] ?? { cps: 26, linePause: 100 }
  const base = 1000 / cps

  if (char === ' ') return base * 1.3
  if (prevChar === ' ' && token.accent) return base * 1.15

  return base
}

export function useHeroTypewriter() {
  const lineTokens = useMemo(
    () => HERO_TITLE_LINES.map((line) => flattenHeroLine(line)),
    [],
  )

  const lineLengths = useMemo(
    () => lineTokens.map((tokens) => tokens.length),
    [lineTokens],
  )

  const [visibleCounts, setVisibleCounts] = useState<number[]>(() =>
    prefersReducedMotion() ? lineLengths : lineLengths.map(() => 0),
  )
  const [isComplete, setIsComplete] = useState(() => prefersReducedMotion())
  const [activeLine, setActiveLine] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) return

    let lineIndex = 0
    let charIndex = 0
    let raf = 0
    let cancelled = false
    let elapsed = 0
    let lastTime = 0
    let nextInterval = LINE_TIMING[0]?.linePause ?? 80

    const tick = (timestamp: number) => {
      if (cancelled) return

      if (!lastTime) lastTime = timestamp
      const delta = timestamp - lastTime
      lastTime = timestamp
      elapsed += delta

      if (elapsed < nextInterval) {
        raf = requestAnimationFrame(tick)
        return
      }

      elapsed -= nextInterval

      const lineLength = lineLengths[lineIndex] ?? 0

      if (charIndex >= lineLength) {
        if (lineIndex >= lineLengths.length - 1) {
          setIsComplete(true)
          return
        }

        lineIndex += 1
        charIndex = 0
        setActiveLine(lineIndex)
        elapsed = 0
        nextInterval = LINE_TIMING[lineIndex]?.linePause ?? 100
        raf = requestAnimationFrame(tick)
        return
      }

      const token = lineTokens[lineIndex]![charIndex]!
      const prevToken = charIndex > 0 ? lineTokens[lineIndex]![charIndex - 1] : undefined

      charIndex += 1
      const nextLineIndex = lineIndex

      setVisibleCounts((counts) => {
        const next = [...counts]
        next[nextLineIndex] = charIndex
        return next
      })

      nextInterval = getCharInterval(token.char, prevToken?.char, token, lineIndex)
      raf = requestAnimationFrame(tick)
    }

    lastTime = 0
    elapsed = 0
    nextInterval = 80
    raf = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [lineLengths, lineTokens])

  return {
    lines: HERO_TITLE_LINES,
    lineTokens,
    visibleCounts,
    activeLine,
    isComplete,
    isTyping: !isComplete,
  }
}
