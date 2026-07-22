import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export type SolutionCtaContent = {
  badge: string
  heading: string
  description: string
  buttonLabel: string
  buttonHref: string
}

type SolutionCtaSectionProps = {
  idPrefix: string
  content: SolutionCtaContent
}

export function SolutionCtaSection({ idPrefix, content }: SolutionCtaSectionProps) {
  const { badge, heading, description, buttonLabel, buttonHref } = content

  return (
    <section className="solution-cta-section">
      <div className="container">
        <FadeIn id={`${idPrefix}-cta-card`} className="solution-cta-card">
          <div className="solution-cta-content">
            <PreSectionTitle title={badge} variant="bg-dark" />
            <h2 className="solution-cta-heading">{heading}</h2>
            <p className="solution-cta-description">{description}</p>
          </div>
          <div className="solution-cta-action">
            <ButtonArrow to={buttonHref} label={buttonLabel} variant="button-white-bg" />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
