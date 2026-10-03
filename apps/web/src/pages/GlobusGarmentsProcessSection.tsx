import { FadeIn } from '../components/ui/FadeIn'
import { PreSectionTitle } from '../components/ui/PreSectionTitle'
import {
  globusGarmentsProcessIntro,
  globusGarmentsProcessItems,
} from '../data/industry/globusGarmentsProcess'

export function GlobusGarmentsProcessSection() {
  return (
    <section className="globus-garments-process">
      <div className="globus-garments-process-glow" aria-hidden="true" />

      <div className="globus-garments-process-container">
        <FadeIn id="globus-garments-process-header" className="globus-garments-process-header">
          <PreSectionTitle title={globusGarmentsProcessIntro.badge} variant="bg-dark" />
          <h2 className="globus-garments-process-title">{globusGarmentsProcessIntro.title}</h2>
        </FadeIn>

        <div className="globus-garments-process-grid">
          {globusGarmentsProcessItems.map((item, index) => (
            <FadeIn
              key={item.id}
              id={`globus-garments-process-${item.id}`}
              className="globus-garments-process-card"
              delay={index * 40}
            >
              <div className="globus-garments-process-card-icon" aria-hidden="true">
                {item.icon}
              </div>
              <h3 className="globus-garments-process-card-title">{item.title}</h3>
              <p className="globus-garments-process-card-description">{item.description}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
