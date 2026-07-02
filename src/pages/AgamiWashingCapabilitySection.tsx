import { ButtonArrow } from '../components/ui/ButtonArrow'
import { FadeIn } from '../components/ui/FadeIn'
import { PreSectionTitle } from '../components/ui/PreSectionTitle'
import {
  agamiWashingCapabilityCta,
  agamiWashingCapabilityIntro,
  agamiWashingCapabilityProcesses,
} from '../data/industry/agamiWashingCapability'
import { legacyImage } from '../lib/assets'

export function AgamiWashingCapabilitySection() {
  return (
    <section className="agami-washing-capability">
      <div className="agami-washing-capability-container">
        <FadeIn id="agami-washing-capability-header" className="agami-washing-capability-header">
          <PreSectionTitle title={agamiWashingCapabilityIntro.badge} />
          <h2 className="agami-washing-capability-title">
            {agamiWashingCapabilityIntro.titleBefore}
            <span className="agami-washing-capability-title-accent">
              {agamiWashingCapabilityIntro.titleAccent}
            </span>
            {agamiWashingCapabilityIntro.titleAfter}
          </h2>
        </FadeIn>

        <div className="agami-washing-capability-grid">
          {agamiWashingCapabilityProcesses.map((process, index) => (
            <FadeIn
              key={process.id}
              id={`agami-washing-capability-${process.id}`}
              className={`agami-washing-capability-card agami-washing-capability-card--${process.id}`}
              delay={index * 50}
            >
              <img
                src={process.imageSrc}
                loading="lazy"
                alt={process.imageAlt}
                className="agami-washing-capability-card-image"
              />
              <div className="agami-washing-capability-card-overlay" aria-hidden="true" />
              <div className="agami-washing-capability-card-content">
                <span className="agami-washing-capability-card-number">{process.number}</span>
                <p className="agami-washing-capability-card-description">{process.description}</p>
                <h3 className="agami-washing-capability-card-title">{process.title}</h3>
                <div className="agami-washing-capability-card-tags">
                  {process.tags.map((tag) => (
                    <span key={tag} className="agami-washing-capability-card-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn id="agami-washing-capability-cta" className="agami-washing-capability-cta" delay={80}>
          <div className="agami-washing-capability-cta-left">
            <div className="agami-washing-capability-cta-avatars">
              <img
                src={legacyImage('testimonial-images-3_1testimonial-images-3.png')}
                loading="lazy"
                alt=""
                className="agami-washing-capability-cta-avatar"
              />
              <img
                src={legacyImage('testimonial-images-1_1testimonial-images-1.png')}
                loading="lazy"
                alt=""
                className="agami-washing-capability-cta-avatar agami-washing-capability-cta-avatar--overlap"
              />
            </div>
            <div className="agami-washing-capability-cta-copy">
              <h3 className="agami-washing-capability-cta-title">{agamiWashingCapabilityCta.title}</h3>
              <p className="agami-washing-capability-cta-description">
                {agamiWashingCapabilityCta.description}
              </p>
            </div>
          </div>
          <ButtonArrow
            to={agamiWashingCapabilityCta.buttonHref}
            label={agamiWashingCapabilityCta.buttonLabel}
            className="agami-washing-capability-cta-button primary-button w-inline-block"
          />
        </FadeIn>
      </div>
    </section>
  )
}
