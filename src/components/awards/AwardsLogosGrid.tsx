import { awardLogos } from '../../data/awards/logoGrid'

export function AwardsLogosGrid() {
  return (
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
  )
}
