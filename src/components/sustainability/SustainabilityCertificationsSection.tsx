import { AwardsLogosGrid } from '../awards/AwardsLogosGrid'
import { certifications } from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'

export function SustainabilityCertificationsSection() {
  return (
    <section className="sustain-certifications-section" aria-labelledby="sustain-certifications-title">
      <div className="container-medium sustain-certifications-container">
        <FadeIn id="sustain-certifications-header" className="sustain-certifications-header">
          <h2 id="sustain-certifications-title" className="sustain-certifications-title">
            {certifications.title}
          </h2>
          <p className="sustain-certifications-description">{certifications.description}</p>
        </FadeIn>

        <FadeIn id="sustain-certifications-logos" delay={80}>
          <AwardsLogosGrid />
        </FadeIn>
      </div>
    </section>
  )
}
