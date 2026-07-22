import { awardHonorShelves, awardsHonorsContent } from '../../data/awards/honors'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function AwardsHonorsSection() {
  return (
    <section className="awards-honors-section">
      <div className="awards-honors-inner">
        <header className="awards-honors-header">
          <PreSectionTitle title={awardsHonorsContent.tag} />
          <h2 className="awards-grid-section__title">{awardsHonorsContent.title}</h2>
          <p className="awards-grid-section__description">{awardsHonorsContent.description}</p>
        </header>

        {awardHonorShelves.map((shelf, shelfIndex) => (
          <div className="shelf" key={`shelf-${shelfIndex}`}>
            <div
              className="shelf-items"
              style={{ gridTemplateColumns: `repeat(${shelf.length}, 1fr)` }}
            >
              {shelf.map((award) => (
                <div className="s-item" key={award.id} tabIndex={0}>
                  <img src={award.image} alt={award.imageAlt} loading="lazy" />
                  <div className="s-cap">
                    <span className="yr">{award.year}</span>
                    <h4>{award.title}</h4>
                    <p>{award.category}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="board" aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  )
}
