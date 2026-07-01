import { awardLogos, awardsGridContent } from '../../data/awards/logoGrid'
import { PreSectionTitle } from '../ui/PreSectionTitle'

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

        <ul className="awards-logos-grid">
          {awardLogos.map((logo) => (
            <li key={logo.id} className="awards-logo-item">
              <img
                src={logo.src}
                alt={logo.alt}
                className="awards-logo-image"
                loading="lazy"
                decoding="async"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
