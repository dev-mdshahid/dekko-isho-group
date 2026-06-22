import { certifications } from '../../data/awards/certifications'
import { CertificationCard } from './CertificationCard'

export function AwardsGridSection() {
  return (
    <section className="awards-section section-spacing">
      <div className="container-medium">
        <div className="awards-grid">
          {certifications.map((certification, index) => (
            <CertificationCard
              key={certification.id}
              certification={certification}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
