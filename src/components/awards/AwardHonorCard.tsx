import type { AwardHonor } from '../../data/awards/honors'

type AwardHonorCardProps = {
  award: AwardHonor
  cardKey: string
  isGhost?: boolean
  isReentering?: boolean
  onTransitionEnd?: () => void
}

export function AwardHonorFloatContent({ award }: { award: AwardHonor }) {
  return (
    <>
      <div className="ph">
        <img src={award.image} alt={award.imageAlt} loading="lazy" />
      </div>
      <div className="cap">
        <div className="top">
          <h4>{award.title}</h4>
          <span className="yr">{award.year}</span>
        </div>
        <p>{award.category}</p>
      </div>
    </>
  )
}

export function AwardHonorCard({
  award,
  cardKey,
  isGhost = false,
  isReentering = false,
  onTransitionEnd,
}: AwardHonorCardProps) {
  const className = ['card', isGhost && 'ghost', isReentering && 'card--reentering']
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={className}
      data-award-id={award.id}
      data-card-key={cardKey}
      onTransitionEnd={onTransitionEnd}
    >
      <AwardHonorFloatContent award={award} />
    </div>
  )
}
