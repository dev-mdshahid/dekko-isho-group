import { awardLogos, type AwardLogo } from '../../data/awards/logoGrid'

type AwardsLogosGridProps = {
  logos?: AwardLogo[]
}

export function AwardsLogosGrid({ logos = awardLogos }: AwardsLogosGridProps) {
  return (
    <ul className="awards-logos-grid">
      {logos.map((logo) => (
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
