import { awardsGridContent } from '../../data/awards/logoGrid'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { AwardsLogosGrid } from './AwardsLogosGrid'

export function AwardsGridSection() {
  return (
    <section className="awards-grid-section">
      <div className="awards-grid-section__bg" aria-hidden="true" />

      <div className="awards-grid-section__inner">
        <header className="awards-grid-section__header">
          <PreSectionTitle title={awardsGridContent.tag} />
          <h2 className="awards-grid-section__title">{awardsGridContent.title}</h2>
          <p className="awards-grid-section__description">{awardsGridContent.description}</p>
        </header>

        <AwardsLogosGrid />
      </div>
    </section>
  )
}
