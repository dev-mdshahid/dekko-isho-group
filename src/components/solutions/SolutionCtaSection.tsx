import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

export type SolutionCtaContent = {
  eyebrow: string
  heading: string
  description: string
  buttonLabel: string
  buttonHref: string
  email: string
  emailHref: string
}

type SolutionCtaSectionProps = {
  idPrefix: string
  content: SolutionCtaContent
}

export function SolutionCtaSection({ idPrefix, content }: SolutionCtaSectionProps) {
  const { eyebrow, heading, description, buttonLabel, buttonHref, email, emailHref } = content

  return (
    <section className="solution-cta-section">
      <div className="container">
        <FadeIn id={`${idPrefix}-cta-card`} className="solution-cta-card">
          <p className="solution-cta-eyebrow">{eyebrow}</p>
          <h2 className="solution-cta-heading">{heading}</h2>
          <p className="solution-cta-description">{description}</p>
          <div className="solution-cta-actions">
            <ButtonArrow to={buttonHref} label={buttonLabel} variant="button-white-bg" />
            <a href={emailHref} className="solution-cta-email">
              {email}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
