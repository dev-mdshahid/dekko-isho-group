import { useRef } from 'react'

import { awardHonors, awardsHonorsContent } from '../../data/awards/honors'
import { useAwardsHonorsWall } from '../../hooks/useAwardsHonorsWall'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function AwardsHonorsSection() {
  const wallRef = useRef<HTMLDivElement>(null)

  useAwardsHonorsWall({ awards: awardHonors, wallRef })

  return (
    <section className="awards-honors-section">
      <div className="awards-honors-section__glow" aria-hidden="true" />

      <div className="awards-honors-section__inner">
        <header className="awards-honors-section__header">
          <PreSectionTitle title={awardsHonorsContent.tag} />
          <h2 className="awards-honors-section__title">{awardsHonorsContent.title}</h2>
          <p className="awards-honors-section__description">{awardsHonorsContent.description}</p>
        </header>

        <div ref={wallRef} className="wall" />
      </div>
    </section>
  )
}
