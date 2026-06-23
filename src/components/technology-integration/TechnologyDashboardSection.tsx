import { technologyIntegrationDashboard } from '../../data/technology-integration/content'
import { FadeIn } from '../ui/FadeIn'

export function TechnologyDashboardSection() {
  const { title, description, image, imageAlt, imageLabel } = technologyIntegrationDashboard

  return (
    <section className="ti-dashboard-section">
      <div className="container">
        <div className="ti-dashboard-layout">
          <FadeIn id="ti-dashboard-title" className="ti-dashboard-title-col">
            <h2 className="ti-dashboard-title">{title}</h2>
          </FadeIn>

          <FadeIn id="ti-dashboard-image" className="ti-dashboard-image-col" delay={60}>
            <div className="ti-dashboard-image-wrap">
              <img src={image} loading="lazy" alt={imageAlt} className="ti-dashboard-image" />
              <span className="ti-dashboard-image-label">{imageLabel}</span>
            </div>
          </FadeIn>

          <FadeIn id="ti-dashboard-copy" className="ti-dashboard-copy-col" delay={120}>
            <p className="ti-dashboard-description">{description}</p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
