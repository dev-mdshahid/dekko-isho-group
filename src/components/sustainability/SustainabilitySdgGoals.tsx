import { useEffect, useRef } from 'react'

import type { SdgGoal, SdgPillar } from '../../data/sustainability/content'

type SustainabilitySdgGoalsProps = {
  pillars: SdgPillar[]
}

function syncSdgSwapHeights(container: HTMLElement) {
  const swaps = container.querySelectorAll<HTMLElement>('.sustain-sdg-swap')
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches

  if (!canHover) {
    swaps.forEach((swap) => {
      swap.style.minHeight = ''
      swap.classList.remove('sustain-sdg-swap--stable')
    })
    return
  }

  const pillars = container.querySelectorAll<HTMLElement>('.sustain-sdg-pillar')

  pillars.forEach((pillar) => {
    const swaps = pillar.querySelectorAll<HTMLElement>('.sustain-sdg-swap')
    let pillarMax = 0
    const measurements: { swap: HTMLElement; height: number }[] = []

    swaps.forEach((swap) => {
      swap.style.minHeight = ''
      swap.classList.remove('sustain-sdg-swap--stable')

      const logos = swap.querySelector<HTMLElement>('.sustain-sdg-logos')
      const goals = swap.querySelector<HTMLElement>('.sustain-sdg-goals-panel')
      if (!logos || !goals) return

      const height = Math.max(logos.offsetHeight, goals.scrollHeight)
      measurements.push({ swap, height })
      pillarMax = Math.max(pillarMax, height)
    })

    measurements.forEach(({ swap }) => {
      swap.style.minHeight = `${pillarMax}px`
      swap.classList.add('sustain-sdg-swap--stable')
    })
  })
}

function formatSdgGoal(goal: SdgGoal): string {
  if (goal.highlight) {
    return `${goal.highlight}${goal.text}`
  }

  return goal.text
}

function SdgGoalItem({ goal }: { goal: SdgGoal }) {
  return <li data-sdg-animate="goal">{formatSdgGoal(goal)}</li>
}

export function SustainabilitySdgGoals({ pillars }: SustainabilitySdgGoalsProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = rootRef.current
    if (!container) return

    const runSync = () => syncSdgSwapHeights(container)

    runSync()

    const resizeObserver = new ResizeObserver(runSync)
    resizeObserver.observe(container)

    const hoverMedia = window.matchMedia('(hover: hover) and (pointer: fine)')
    const onHoverMediaChange = () => runSync()
    hoverMedia.addEventListener('change', onHoverMediaChange)
    window.addEventListener('resize', runSync)

    return () => {
      resizeObserver.disconnect()
      hoverMedia.removeEventListener('change', onHoverMediaChange)
      window.removeEventListener('resize', runSync)
    }
  }, [pillars])

  return (
    <div className="sustain-sdg-goals" ref={rootRef}>
      {pillars.map((pillar) => (
        <div
          key={pillar.id}
          className={`sustain-sdg-pillar sustain-sdg-pillar--${pillar.id}`}
          data-sdg-animate="pillar"
        >
          <div className="sustain-sdg-pillar-label">
            <div className="sustain-sdg-pillar-bar" data-sdg-animate="bar" aria-hidden="true" />
            <h3 data-sdg-animate="label-title">{pillar.label}</h3>
            <span data-sdg-animate="label-desc">{pillar.description}</span>
          </div>

          <div className="sustain-sdg-groups">
            {pillar.groups.map((group) => (
              <div key={group.id} className="sustain-sdg-group" data-sdg-animate="group">
                <h4 className="sustain-sdg-group-title" data-sdg-animate="group-title">
                  {group.title}
                </h4>
                <div className="sustain-sdg-swap">
                  <div className="sustain-sdg-logos">
                    {group.logos.map((logo) => (
                      <img
                        key={logo.src}
                        src={logo.src}
                        alt={logo.alt}
                        loading="lazy"
                        data-sdg-animate="logo"
                      />
                    ))}
                  </div>
                  <div className="sustain-sdg-goals-panel">
                    <ul>
                      {group.goals.map((goal) => (
                        <SdgGoalItem key={`${group.id}-${goal.highlight ?? goal.text}`} goal={goal} />
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
