import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

export function CompanySection() {
  return (
    <section className="company-section">
      <div className="company-section-stage" aria-hidden="true">
        <img
          className="company-section-stage-atmosphere"
          src="/images/awards/awards-cluster-background.png"
          alt=""
          decoding="async"
        />
        <div className="company-section-stage-awards-wrap" data-home-animate="company-bg">
          <img
            className="company-section-stage-awards"
            src="/images/awards/awards-cluster-transparent.png"
            alt=""
            decoding="async"
          />
        </div>
      </div>

      <div className="company-section-inner">
        <FadeIn
          id="company-section-content"
          variant="slide-in-bottom"
          className="company-section-content"
        >
          <h2 className="company-section-title section-title">
            <span className="company-section-title-line">
              The Relentless{' '}
              <span className="company-section-accent company-section-accent--pursuit">Pursuit</span>
            </span>
            <span className="company-section-title-line">
              of Making a{' '}
              <span className="company-section-accent company-section-accent--difference">
                Difference
              </span>
            </span>
          </h2>
          <p className="company-section-description">
            Driven by purpose and powered by progress, we continue to raise the bar in creating
            value for people, partners, and the planet
          </p>
          <div className="company-section-button">
            <ButtonArrow
              to="/awards"
              label="Explore Achievements"
              variant="button-white-bg"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
