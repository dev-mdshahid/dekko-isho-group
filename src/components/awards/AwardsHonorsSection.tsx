import { awardHonors, awardsHonorsContent } from '../../data/awards/honors'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { AwardHonorCard } from './AwardHonorCard'

export function AwardsHonorsSection() {
  return (
    <section className="awards-honors-section">
      <div className="awards-honors-section__glow" aria-hidden="true" />

      <div className="awards-honors-section__inner">
        <header className="awards-honors-section__header">
          <PreSectionTitle title={awardsHonorsContent.tag} />
          <h2 className="awards-honors-section__title">{awardsHonorsContent.title}</h2>
          <p className="awards-honors-section__description">{awardsHonorsContent.description}</p>
        </header>

        <div className="awards-honors-grid">
          {awardHonors.map((award, index) => (
            <AwardHonorCard key={award.id} award={award} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
