import { FadeIn } from '../components/ui/FadeIn'
import { PreSectionTitle } from '../components/ui/PreSectionTitle'
import {
  globusGarmentsOperationalStrengthIntro,
  globusGarmentsOperationalStrengthItems,
} from '../data/industry/globusGarmentsOperationalStrength'

export function GlobusGarmentsOperationalStrengthSection() {
  return (
    <section className="globus-garments-operational-strength">
      <div className="globus-garments-operational-strength-container">
        <FadeIn
          id="globus-garments-operational-strength-header"
          className="globus-garments-operational-strength-header"
        >
          <PreSectionTitle title={globusGarmentsOperationalStrengthIntro.badge} />
          <h2 className="globus-garments-operational-strength-title">
            {globusGarmentsOperationalStrengthIntro.title}
          </h2>
        </FadeIn>

        <FadeIn
          id="globus-garments-operational-strength-grid"
          className="globus-garments-operational-strength-grid"
          delay={60}
        >
          {globusGarmentsOperationalStrengthItems.map((item) => (
            <div key={item.id} className="globus-garments-operational-strength-card">
              <div className="globus-garments-operational-strength-value">{item.value}</div>
              <p className="globus-garments-operational-strength-description">{item.description}</p>
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  )
}
