import { useRef } from 'react'
import { createPortal } from 'react-dom'

import { awardHonors, awardsHonorsContent } from '../../data/awards/honors'
import { useAwardsHonorsWall } from '../../hooks/useAwardsHonorsWall'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { AwardHonorCard } from './AwardHonorCard'

function renderColumnItems(
  columnAwards: (typeof awardHonors)[number][],
  columnIndex: number,
  loopIndex: number,
  ghostCardKey: string | null,
  reenteringCardKey: string | null,
  onActivate: (cardKey: string, award: (typeof awardHonors)[number], element: HTMLDivElement) => void,
  onReentryEnd: (cardKey: string) => void,
) {
  return columnAwards.map((award, awardIndex) => {
    const cardKey = `${columnIndex}-${awardIndex}-${loopIndex}-${award.id}`

    return (
      <AwardHonorCard
        key={cardKey}
        cardKey={cardKey}
        award={award}
        isGhost={ghostCardKey === cardKey}
        isReentering={reenteringCardKey === cardKey}
        onActivate={onActivate}
        onReentryEnd={onReentryEnd}
      />
    )
  })
}

export function AwardsHonorsSection() {
  const wallRef = useRef<HTMLDivElement>(null)

  const {
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
  } = useAwardsHonorsWall({ awards: awardHonors })

  const handleActivate = (
    cardKey: string,
    award: (typeof awardHonors)[number],
    element: HTMLDivElement,
  ) => {
    activateFloat(cardKey, award, element)
  }

  const floatPortal =
    activeFloat && typeof document !== 'undefined'
      ? createPortal(
          <div
            className={[
              'awards-honor-float',
              activeFloat.phase === 'active' ? 'awards-honor-float--in' : '',
              activeFloat.phase === 'exiting' ? 'awards-honor-float--out' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{
              left: activeFloat.rect.left,
              top: activeFloat.rect.top,
              width: activeFloat.rect.width,
            }}
            onMouseLeave={dismissFloat}
            onClick={dismissFloat}
            role="dialog"
            aria-label={`${activeFloat.award.title}, ${activeFloat.award.year}`}
          >
            <div className="awards-honor-card awards-honor-card--float">
              <div className="awards-honor-card__media">
                <img
                  src={activeFloat.award.image}
                  alt={activeFloat.award.imageAlt}
                  className="awards-honor-card__image"
                  decoding="async"
                />
              </div>
              <div className="awards-honor-card__caption">
                <div className="awards-honor-card__caption-top">
                  <h3 className="awards-honor-card__title">{activeFloat.award.title}</h3>
                  <span className="awards-honor-card__year">{activeFloat.award.year}</span>
                </div>
                <p className="awards-honor-card__organization">{activeFloat.award.category}</p>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null

  return (
    <section className="awards-honors-section">
      {/* <div className="awards-honors-section__glow" aria-hidden="true" /> */}

      <div className="awards-honors-section__inner">
        <header className="awards-honors-section__header">
          <PreSectionTitle title={awardsHonorsContent.tag} />
          <h2 className="awards-honors-section__title">{awardsHonorsContent.title}</h2>
          <p className="awards-honors-section__description">{awardsHonorsContent.description}</p>
        </header>

        <div
          ref={wallRef}
          className={[
            'awards-honors-wall',
            isLit ? 'awards-honors-wall--lit' : '',
            reducedMotion ? 'awards-honors-wall--static' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {columns.map((columnAwards, columnIndex) => (
            <div key={`column-${columnIndex}`} className="awards-honors-wall__column">
              <div
                ref={(element) => setColumnRef(columnIndex, element)}
                className="awards-honors-wall__column-inner"
              >
                {renderColumnItems(
                  columnAwards,
                  columnIndex,
                  0,
                  ghostCardKey,
                  reenteringCardKey,
                  handleActivate,
                  handleReentryEnd,
                )}
                {!reducedMotion &&
                  renderColumnItems(
                    columnAwards,
                    columnIndex,
                    1,
                    ghostCardKey,
                    reenteringCardKey,
                    handleActivate,
                    handleReentryEnd,
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {floatPortal}
    </section>
  )
}
