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
import { splitTitleIntoTwoLines } from '../../lib/splitTitleIntoTwoLines'

const DESKTOP_COLUMNS = 6
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

function preloadSdgAssets(goals: SdgInteractiveGoal[]) {
  const urls = new Set<string>()
  for (const goal of goals) {
    urls.add(goal.stillSrc)
    urls.add(goal.animSrc)
  }

  urls.forEach((src) => {
    const image = new Image()
    image.decoding = 'async'
    image.src = src
  })
}

function restartGifFromCache(image: HTMLImageElement, src: string) {
  // Reassign the same URL so the GIF restarts from browser cache (no network refetch).
  image.src = ''
  image.src = src
}

function canHover() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches
}

function SdgGoalCard({
  goal,
  isExpanded,
  onSelect,
}: {
  goal: SdgInteractiveGoal
  isExpanded: boolean
  onSelect: () => void
}) {
  const animRef = useRef<HTMLImageElement>(null)
  const wasFlippedRef = useRef(false)
  const [isHovered, setIsHovered] = useState(false)
  const isFlipped = isHovered || isExpanded

  useEffect(() => {
    const anim = animRef.current
    if (!anim) return

    if (isFlipped && !wasFlippedRef.current) {
      restartGifFromCache(anim, goal.animSrc)
    }
    wasFlippedRef.current = isFlipped
  }, [goal.animSrc, isFlipped])

  return (
    <button
      type="button"
      className={`sustain-sdg-card${isFlipped ? ' is-flipped' : ''}${isExpanded ? ' is-active' : ''}`}
      aria-label={`SDG ${goal.number} — ${goal.title}`}
      aria-expanded={isExpanded}
      onMouseEnter={() => {
        if (canHover()) setIsHovered(true)
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        onSelect()
      }}
    >
      <span className="sustain-sdg-card-inner" aria-hidden="true">
        <span className="sustain-sdg-card-face sustain-sdg-card-face--front">
          <img
            className="sustain-sdg-card-still"
            src={goal.stillSrc}
            alt=""
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </span>
        <span className="sustain-sdg-card-face sustain-sdg-card-face--back">
          <img
            className="sustain-sdg-card-anim"
            ref={animRef}
            src={goal.animSrc}
            alt=""
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </span>
      </span>
    </button>
  )
}

function SdgGoalRow({
  goals,
  rowIndex,
  active,
  onSelect,
}: {
  goals: SdgInteractiveGoal[]
  rowIndex: number
  active: ActiveGoal | null
  onSelect: (rowIndex: number, goalIndex: number) => void
}) {
  const gridRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const clipRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLSpanElement>(null)
  const isRowOpen = active?.rowIndex === rowIndex
  const activeGoalIndex = isRowOpen ? active.goalIndex : -1
  const [panelGoal, setPanelGoal] = useState<SdgInteractiveGoal | null>(null)
  const [panelGoalIndex, setPanelGoalIndex] = useState(-1)
  const [contentKey, setContentKey] = useState(0)

  if (isRowOpen && activeGoalIndex >= 0) {
    const nextGoal = goals[activeGoalIndex] ?? null
    if (nextGoal && (panelGoal?.number !== nextGoal.number || panelGoalIndex !== activeGoalIndex)) {
      setPanelGoal(nextGoal)
      setPanelGoalIndex(activeGoalIndex)
      setContentKey((key) => key + 1)
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
          const maxLeft = Math.max(0, clip.offsetWidth - 18)
          arrow.style.left = `${Math.min(Math.max(centerX - 9, 0), maxLeft)}px`
        }
      }
      panel.style.height = `${clip.offsetHeight}px`
    } else {
      panel.style.height = '0px'
    }
  }, [isRowOpen, panelGoal, panelGoalIndex])

  useLayoutEffect(() => {
    syncPanelGeometry()
  }, [syncPanelGeometry, contentKey])

  useEffect(() => {
    const clip = clipRef.current
    if (!clip) return

    const observer = new ResizeObserver(() => {
      syncPanelGeometry()
    })
    observer.observe(clip)
    window.addEventListener('resize', syncPanelGeometry)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', syncPanelGeometry)
    }
  }, [syncPanelGeometry])

  const panelStyle = panelGoal
    ? {
        borderColor: panelGoal.color,
      }
    : undefined

  const arrowStyle = panelGoal
    ? {
        borderBottomColor: panelGoal.color,
      }
    : undefined

  const dividerStyle = panelGoal
    ? { background: panelGoal.color }
    : undefined

  return (
    <div className="sustain-sdg-row">
      <div className="sustain-sdg-grid" ref={gridRef}>
        {goals.map((goal, goalIndex) => (
          <SdgGoalCard
            key={goal.number}
            goal={goal}
            isExpanded={isRowOpen && activeGoalIndex === goalIndex}
            onSelect={() => onSelect(rowIndex, goalIndex)}
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
              <div className="sustain-sdg-panel-content" key={`${panelGoal.number}-${contentKey}`}>
                <div className="sustain-sdg-panel-goal">
                  <span className="sustain-sdg-panel-number" style={{ color: panelGoal.color }}>
                    {panelGoal.number}
                  </span>
                  <span className="sustain-sdg-panel-title" style={{ color: panelGoal.color }}>
                    {splitTitleIntoTwoLines(panelGoal.title).map((line, index) => (
                      <span className="sustain-sdg-panel-title-line" key={`${panelGoal.number}-line-${index}`}>
                        {line}
                      </span>
                    ))}
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
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SustainabilitySdgGoals({ goals }: SustainabilitySdgGoalsProps) {
  const [active, setActive] = useState<ActiveGoal | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const columns = useSdgColumns()
  const rows = chunkGoals(goals, columns)

  useEffect(() => {
    preloadSdgAssets(goals)
  }, [goals])

  useEffect(() => {
    setActive(null)
  }, [columns, goals.length])

  const selectGoal = useCallback((rowIndex: number, goalIndex: number) => {
    setActive((current) =>
      current?.rowIndex === rowIndex && current.goalIndex === goalIndex
        ? null
        : { rowIndex, goalIndex },
    )
  }, [])

  const closeGoal = useCallback(() => {
    setActive(null)
  }, [])

  useEffect(() => {
    if (!active) return

    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current
      if (!root) return
      if (event.target instanceof Node && !root.contains(event.target)) {
        closeGoal()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [active, closeGoal])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') closeGoal()
  }

  return (
    <div className="sustain-sdg-goals" ref={rootRef} onKeyDown={handleKeyDown}>
      {rows.map((rowGoals, rowIndex) => (
        <SdgGoalRow
          key={rowGoals.map((goal) => goal.number).join('-')}
          goals={rowGoals}
          rowIndex={rowIndex}
          active={active}
          onSelect={selectGoal}
        />
      ))}
    </div>
  )
}
