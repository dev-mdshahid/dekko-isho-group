import { useEffect, useMemo, useState } from 'react'

import {
  flattenHeroLine,
  HERO_TITLE_LINES,
  type HeroCharToken,
} from '../data/home/heroTitle'
import { prefersReducedMotion } from '../lib/animations/prefersReducedMotion'

function getTypingDelay(
  char: string,
  prevChar: string | undefined,
  index: number,
  token: HeroCharToken,
): number {
  if (index === 0) return 380 + Math.random() * 120

  if (char === ' ') {
    return 140 + Math.random() * 90
  }

  if (prevChar === ' ') {
    if (token.accent) {
      return 220 + Math.random() * 160
    }
    return 95 + Math.random() * 75
  }

  if ('.,!?;:'.includes(char)) {
    return 260 + Math.random() * 140
  }

  const base = 52 + Math.random() * 58

  if (index % 5 === 0 && Math.random() < 0.22) {
    return base + 90 + Math.random() * 110
  }

  if (Math.random() < 0.08) {
    return base + 40 + Math.random() * 60
  }

  return base
}

function getLinePauseDelay(lineIndex: number): number {
  if (lineIndex <= 0) return 0
  return 420 + lineIndex * 60 + Math.random() * 180
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
    let timer = 0
    let cancelled = false

    const tick = () => {
      if (cancelled) return

      const lineLength = lineLengths[lineIndex] ?? 0

      if (charIndex >= lineLength) {
        if (lineIndex >= lineLengths.length - 1) {
          setIsComplete(true)
          return
        }

        lineIndex += 1
        charIndex = 0
        setActiveLine(lineIndex)
        timer = window.setTimeout(tick, getLinePauseDelay(lineIndex))
        return
      }

      const token = lineTokens[lineIndex]![charIndex]!
      const prevToken = charIndex > 0 ? lineTokens[lineIndex]![charIndex - 1] : undefined
      const delay = getTypingDelay(token.char, prevToken?.char, charIndex, token)

      charIndex += 1
      const nextLineIndex = lineIndex

      setVisibleCounts((counts) => {
        const next = [...counts]
        next[nextLineIndex] = charIndex
        return next
      })

      timer = window.setTimeout(tick, delay)
    }

    timer = window.setTimeout(tick, 280)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
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
