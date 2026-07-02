import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

export function CompanySection() {
  return (
    <section className="company-section">
      <div
        className="company-section-bg"
        data-home-animate="company-bg"
        aria-hidden="true"
      />
      <div className="company-section-inner">
        <FadeIn
          id="company-section-content"
          variant="slide-in-bottom"
          className="company-section-content"
        >
          <h2 className="company-section-title section-title text-white">
            The Relentless&nbsp;
            <span className="text-linear-gradient company-section-gradient-text">Pursuit</span>
            <br />
            of Making a Difference
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
