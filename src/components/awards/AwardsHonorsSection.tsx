import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { awardHonors, awardsHonorsContent } from '../../data/awards/honors'
import type { ActiveHonorFloat } from '../../hooks/useAwardsHonorsWall'
import { useAwardsHonorsWall } from '../../hooks/useAwardsHonorsWall'
import { PreSectionTitle } from '../ui/PreSectionTitle'

import { AwardHonorCard, AwardHonorFloatContent } from './AwardHonorCard'

type HonorFloatOverlayProps = {
  floatState: ActiveHonorFloat
  onMouseLeave?: () => void
  setFloatRef?: (element: HTMLDivElement | null) => void
}

function HonorFloatOverlay({ floatState, onMouseLeave, setFloatRef }: HonorFloatOverlayProps) {
  const isExiting = floatState.phase === 'exiting'
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (isExiting) {
      setIsExpanded(false)
      return
    }

    setIsExpanded(false)

    let frame2 = 0
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        setIsExpanded(true)
      })
    })

    return () => {
      cancelAnimationFrame(frame1)
      cancelAnimationFrame(frame2)
    }
  }, [floatState.cardKey, isExiting])

  const className = ['awards-honors-float', isExpanded && 'in', isExiting && 'out'].filter(Boolean).join(' ')

  const { rect, award } = floatState

  return createPortal(
    <div
      ref={setFloatRef}
      className={className}
      style={{
        left: rect.left,
        top: rect.top,
        width: rect.width,
      }}
      onMouseLeave={onMouseLeave}
    >
      <AwardHonorFloatContent award={award} />
    </div>,
    document.body,
  )
}

export function AwardsHonorsSection() {
  const {
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
  } = useAwardsHonorsWall({ awards: awardHonors })

  const renderColumnCards = (columnAwards: typeof awardHonors, columnIndex: number, duplicate: 0 | 1) =>
    columnAwards.map((award, awardIndex) => {
      const cardKey = `${columnIndex}-${awardIndex}-${duplicate}`

      return (
        <AwardHonorCard
          key={cardKey}
          award={award}
          cardKey={cardKey}
          isGhost={ghostCardKey === cardKey}
          isReentering={reenteringCardKey === cardKey}
          onTransitionEnd={
            reenteringCardKey === cardKey ? () => handleReentryEnd(cardKey) : undefined
          }
        />
      )
    })

  return (
    <section className="awards-honors-section awards-honors-section--white">
      <div className="awards-honors-section__inner">
        <header className="awards-honors-section__header">
          <PreSectionTitle title={awardsHonorsContent.tag} />
          <h2 className="awards-honors-section__title">{awardsHonorsContent.title}</h2>
          <p className="awards-honors-section__description">{awardsHonorsContent.description}</p>
        </header>

        <div
          className={['wall', isLit && 'lit', reducedMotion && 'wall--static'].filter(Boolean).join(' ')}
          onMouseOver={handleWallMouseOver}
        >
          {columns.map((columnAwards, columnIndex) => (
            <div key={columnIndex} className="col">
              <div ref={(element) => setColumnRef(columnIndex, element)} className="col-inner">
                {renderColumnCards(columnAwards, columnIndex, 0)}
                {!reducedMotion && renderColumnCards(columnAwards, columnIndex, 1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeFloat ? (
        <HonorFloatOverlay
          floatState={activeFloat}
          onMouseLeave={handleFloatMouseLeave}
          setFloatRef={setFloatRef}
        />
      ) : null}

      {exitingFloat ? <HonorFloatOverlay floatState={exitingFloat} /> : null}
    </section>
  )
}
