import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'

import type { SdgInteractiveGoal } from '../../data/sustainability/content'

const DESKTOP_COLUMNS = 5
const TABLET_COLUMNS = 3
const MOBILE_COLUMNS = 2
const TABLET_MQ = '(max-width: 980px)'
const MOBILE_MQ = '(max-width: 560px)'

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

function getSdgColumns() {
  if (typeof window === 'undefined') return DESKTOP_COLUMNS
  if (window.matchMedia(MOBILE_MQ).matches) return MOBILE_COLUMNS
  if (window.matchMedia(TABLET_MQ).matches) return TABLET_COLUMNS
  return DESKTOP_COLUMNS
}

function useSdgColumns() {
  const [columns, setColumns] = useState(getSdgColumns)

  useEffect(() => {
    const update = () => setColumns(getSdgColumns())
    update()

    const mediaQueries = [window.matchMedia(MOBILE_MQ), window.matchMedia(TABLET_MQ)]
    mediaQueries.forEach((mq) => mq.addEventListener('change', update))
    return () => mediaQueries.forEach((mq) => mq.removeEventListener('change', update))
  }, [])

  return columns
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
    const preload = new Image()
    preload.src = goal.animSrc
  }, [goal.animSrc])

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
      <span className="sustain-sdg-card-inner" aria-hidden="true">
        <span className="sustain-sdg-card-face sustain-sdg-card-face--front">
          <img className="sustain-sdg-card-still" src={goal.stillSrc} alt="" loading="lazy" draggable={false} />
        </span>
        <span className="sustain-sdg-card-face sustain-sdg-card-face--back">
          <img className="sustain-sdg-card-anim" ref={animRef} alt="" draggable={false} />
        </span>
      </span>
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
  const panelRef = useRef<HTMLDivElement>(null)
  const clipRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLSpanElement>(null)
  const isRowOpen = active?.rowIndex === rowIndex
  const activeGoalIndex = isRowOpen ? active.goalIndex : -1
  const [panelGoal, setPanelGoal] = useState<SdgInteractiveGoal | null>(null)
  const [panelGoalIndex, setPanelGoalIndex] = useState(-1)

  if (isRowOpen && activeGoalIndex >= 0) {
    const nextGoal = goals[activeGoalIndex] ?? null
    if (nextGoal && (panelGoal?.number !== nextGoal.number || panelGoalIndex !== activeGoalIndex)) {
      setPanelGoal(nextGoal)
      setPanelGoalIndex(activeGoalIndex)
    }
  }

  const syncPanelGeometry = useCallback(() => {
    const panel = panelRef.current
    const clip = clipRef.current
    const grid = gridRef.current
    const arrow = arrowRef.current
    if (!panel || !clip) return

    if (isRowOpen && panelGoal && panelGoalIndex >= 0) {
      if (grid && arrow) {
        const card = grid.querySelectorAll<HTMLElement>('.sustain-sdg-card')[panelGoalIndex]
        if (card) {
          const centerX = card.offsetLeft + card.offsetWidth / 2
          arrow.style.left = `${centerX - 6.5}px`
        }
      }
      panel.style.height = `${clip.offsetHeight}px`
    } else {
      panel.style.height = '0px'
    }
  }, [isRowOpen, panelGoal, panelGoalIndex])

  useLayoutEffect(() => {
    syncPanelGeometry()
  }, [syncPanelGeometry])

  useEffect(() => {
    const onResize = () => {
      if (isRowOpen) syncPanelGeometry()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isRowOpen, syncPanelGeometry])

  const panelStyle = panelGoal
    ? {
        background: hexToRgba(panelGoal.color, 0.05),
        borderColor: hexToRgba(panelGoal.color, 0.28),
      }
    : undefined

  const arrowStyle = panelGoal
    ? {
        background: hexToRgba(panelGoal.color, 0.05),
        borderColor: hexToRgba(panelGoal.color, 0.28),
      }
    : undefined

  const dividerStyle = panelGoal
    ? { background: hexToRgba(panelGoal.color, 0.25) }
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

      <div
        className={`sustain-sdg-panel${isRowOpen && panelGoal ? ' is-open' : ''}`}
        ref={panelRef}
        aria-hidden={!isRowOpen}
      >
        <div className="sustain-sdg-panel-clip" ref={clipRef}>
          <span className="sustain-sdg-panel-arrow" ref={arrowRef} style={arrowStyle} aria-hidden="true" />
          <div className="sustain-sdg-panel-inner" style={panelStyle}>
            {panelGoal ? (
              <>
                <div className="sustain-sdg-panel-goal">
                  <span className="sustain-sdg-panel-number" style={{ color: panelGoal.color }}>
                    {panelGoal.number}
                  </span>
                  <span className="sustain-sdg-panel-title" style={{ color: panelGoal.color }}>
                    {panelGoal.title}
                  </span>
                </div>
                <span className="sustain-sdg-panel-div" style={dividerStyle} aria-hidden="true" />
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
                <img className="sustain-sdg-panel-mark" src={panelGoal.stillSrc} alt="" aria-hidden="true" />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SustainabilitySdgGoals({ goals }: SustainabilitySdgGoalsProps) {
  const [active, setActive] = useState<ActiveGoal | null>(null)
  const columns = useSdgColumns()
  const rows = chunkGoals(goals, columns)

  useEffect(() => {
    setActive(null)
  }, [columns])

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
