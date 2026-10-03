import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export type IndustryLocationItem = {
  id: string
  number: string
  title: string
  subtitle: string
}

export type IndustryLocationProps = {
  id?: string
  badge: string
  title: string
  description: string
  locations: IndustryLocationItem[]
}

export function IndustryLocation({
  id = 'industry-location',
  badge,
  title,
  description,
  locations,
}: IndustryLocationProps) {
  return (
    <section className="industry-location">
      <div className="industry-location-container">
        <FadeIn id={`${id}-card`} className="industry-location-card">
          <div className="industry-location-copy">
            <PreSectionTitle title={badge} />
            <h2 className="industry-location-title">{title}</h2>
            <p className="industry-location-description">{description}</p>
          </div>

          <div className="industry-location-list">
            {locations.map((location, index) => (
              <div
                key={location.id}
                className={`industry-location-item${index > 0 ? ' industry-location-item--bordered' : ''}`}
              >
                <span className="industry-location-number">{location.number}</span>
                <div className="industry-location-item-content">
                  <h3 className="industry-location-item-title">{location.title}</h3>
                  <p className="industry-location-item-subtitle">{location.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
