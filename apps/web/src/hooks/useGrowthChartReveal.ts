import { type RefObject, useEffect, useState } from 'react'

import { prefersReducedMotion } from '../lib/animations/prefersReducedMotion'

type GrowthChartRevealState = {
  isRevealed: boolean
  reduceMotion: boolean
}

export function useGrowthChartReveal(chartRef: RefObject<HTMLElement | null>) {
  const [state, setState] = useState<GrowthChartRevealState>(() => {
    const reduceMotion = prefersReducedMotion()

    return {
      isRevealed: reduceMotion || typeof IntersectionObserver === 'undefined',
      reduceMotion,
    }
  })

  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    if (state.isRevealed || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return

        setState({ isRevealed: true, reduceMotion: false })
        observer.disconnect()
      },
      { threshold: 0.2, rootMargin: '0px 0px 60px 0px' },
    )

    observer.observe(chart)

    return () => observer.disconnect()
  }, [chartRef, state.isRevealed])

  return state
}
