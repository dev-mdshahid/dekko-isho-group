import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'

import type { SdgInteractiveGoal } from '../../data/sustainability/content'

const GOALS_PER_ROW = 4

type SustainabilitySdgGoalsProps = {
  goals: SdgInteractiveGoal[]
}

type ActiveGoal = {
  rowIndex: number
  goalIndex: number
}

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace('#', '')
  const r = Number.parseInt(value.slice(0, 2), 16)
  const g = Number.parseInt(value.slice(2, 4), 16)
  const b = Number.parseInt(value.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function chunkGoals(goals: SdgInteractiveGoal[], size: number) {
  const rows: SdgInteractiveGoal[][] = []
  for (let i = 0; i < goals.length; i += size) {
    rows.push(goals.slice(i, i + size))
  }
  return rows
}

function SdgGoalCard({
  goal,
  isActive,
  onActivate,
  onToggle,
}: {
  goal: SdgInteractiveGoal
  isActive: boolean
  onActivate: () => void
  onToggle: () => void
}) {
  const animRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const anim = animRef.current
    if (!anim) return

    if (isActive) {
      anim.src = `${goal.animSrc}?r=${Date.now()}`
    } else {
      anim.removeAttribute('src')
    }
  }, [goal.animSrc, isActive])

  return (
    <button
      type="button"
      className={`sustain-sdg-card${isActive ? ' is-active' : ''}`}
      aria-label={`SDG ${goal.number} — ${goal.title}`}
      aria-expanded={isActive}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        onToggle()
      }}
    >
      <img className="sustain-sdg-card-still" src={goal.stillSrc} alt="" loading="lazy" draggable={false} />
      <img className="sustain-sdg-card-anim" ref={animRef} alt="" aria-hidden="true" draggable={false} />
    </button>
  )
}

function SdgGoalRow({
  goals,
  rowIndex,
  active,
  onOpen,
  onClose,
  onToggle,
}: {
  goals: SdgInteractiveGoal[]
  rowIndex: number
  active: ActiveGoal | null
  onOpen: (rowIndex: number, goalIndex: number) => void
  onClose: () => void
  onToggle: (rowIndex: number, goalIndex: number) => void
}) {
  const gridRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLSpanElement>(null)
  const isRowOpen = active?.rowIndex === rowIndex
  const activeGoalIndex = isRowOpen ? active.goalIndex : -1
  const [panelGoal, setPanelGoal] = useState<SdgInteractiveGoal | null>(null)
  const [panelGoalIndex, setPanelGoalIndex] = useState(-1)

  useEffect(() => {
    if (isRowOpen && activeGoalIndex >= 0) {
      setPanelGoal(goals[activeGoalIndex] ?? null)
      setPanelGoalIndex(activeGoalIndex)
    }
  }, [activeGoalIndex, goals, isRowOpen])

  const updateArrow = useCallback(() => {
    const grid = gridRef.current
    const arrow = arrowRef.current
    if (!grid || !arrow || panelGoalIndex < 0) return

    const card = grid.querySelectorAll<HTMLElement>('.sustain-sdg-card')[panelGoalIndex]
    if (!card) return

    const centerX = card.offsetLeft + card.offsetWidth / 2
    arrow.style.left = `${centerX - 7}px`
  }, [panelGoalIndex])

  useEffect(() => {
    updateArrow()
  }, [updateArrow, panelGoal, isRowOpen])

  useEffect(() => {
    window.addEventListener('resize', updateArrow)
    return () => window.removeEventListener('resize', updateArrow)
  }, [updateArrow])

  const panelStyle = panelGoal
    ? {
        background: hexToRgba(panelGoal.color, 0.05),
        borderColor: hexToRgba(panelGoal.color, 0.3),
      }
    : undefined

  const arrowStyle = panelGoal
    ? {
        background: hexToRgba(panelGoal.color, 0.05),
        borderColor: hexToRgba(panelGoal.color, 0.3),
      }
    : undefined

  return (
    <div className="sustain-sdg-row" onMouseLeave={onClose}>
      <div className="sustain-sdg-grid" ref={gridRef}>
        {goals.map((goal, goalIndex) => (
          <SdgGoalCard
            key={goal.number}
            goal={goal}
            isActive={isRowOpen && activeGoalIndex === goalIndex}
            onActivate={() => onOpen(rowIndex, goalIndex)}
            onToggle={() => onToggle(rowIndex, goalIndex)}
          />
        ))}
      </div>

      <div className={`sustain-sdg-panel${isRowOpen && panelGoal ? ' is-open' : ''}`} aria-hidden={!isRowOpen}>
        <div className="sustain-sdg-panel-inner" style={panelStyle}>
          <span className="sustain-sdg-panel-arrow" ref={arrowRef} style={arrowStyle} aria-hidden="true" />
          {panelGoal ? (
            <>
              <div className="sustain-sdg-panel-body">
                <div
                  className="sustain-sdg-panel-goal"
                  style={{ borderRightColor: hexToRgba(panelGoal.color, 0.25) }}
                >
                  <span className="sustain-sdg-panel-number" style={{ color: panelGoal.color }}>
                    {panelGoal.number}
                  </span>
                  <span className="sustain-sdg-panel-title" style={{ color: panelGoal.color }}>
                    {panelGoal.title}
                  </span>
                </div>
                <div className="sustain-sdg-panel-stats">
                  {panelGoal.stats.map((stat) => (
                    <div className="sustain-sdg-stat" key={`${panelGoal.number}-${stat.value}-${stat.label}`}>
                      <div className="sustain-sdg-stat-value" style={{ color: panelGoal.color }}>
                        {stat.value}
                      </div>
                      <div className="sustain-sdg-stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <img className="sustain-sdg-panel-mark" src={panelGoal.stillSrc} alt="" aria-hidden="true" />
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function SustainabilitySdgGoals({ goals }: SustainabilitySdgGoalsProps) {
  const [active, setActive] = useState<ActiveGoal | null>(null)
  const rows = chunkGoals(goals, GOALS_PER_ROW)

  const openGoal = useCallback((rowIndex: number, goalIndex: number) => {
    setActive({ rowIndex, goalIndex })
  }, [])

  const closeGoal = useCallback(() => {
    setActive(null)
  }, [])

  const toggleGoal = useCallback((rowIndex: number, goalIndex: number) => {
    setActive((current) =>
      current?.rowIndex === rowIndex && current.goalIndex === goalIndex
        ? null
        : { rowIndex, goalIndex },
    )
  }, [])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') closeGoal()
  }

  return (
    <div className="sustain-sdg-goals" onKeyDown={handleKeyDown}>
      {rows.map((rowGoals, rowIndex) => (
        <SdgGoalRow
          key={rowGoals.map((goal) => goal.number).join('-')}
          goals={rowGoals}
          rowIndex={rowIndex}
          active={active}
          onOpen={openGoal}
          onClose={closeGoal}
          onToggle={toggleGoal}
        />
      ))}
    </div>
  )
}
