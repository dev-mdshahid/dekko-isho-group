import type { AwardHonor } from '../../data/awards/honors'
import { FadeIn } from '../ui/FadeIn'

type Props = {
  award: AwardHonor
  index: number
}

export function AwardHonorCard({ award, index }: Props) {
  return (
    <FadeIn id={award.id} className="awards-honor-card" delay={index * 50}>
      <img
        src={award.image}
        alt={award.imageAlt}
        className="awards-honor-card__image"
        loading="lazy"
        decoding="async"
      />
      <div className="awards-honor-card__content">
        <h3 className="awards-honor-card__title">{award.title}</h3>
        <p className="awards-honor-card__category">{award.category}</p>
      </div>
    </FadeIn>
  )
}
