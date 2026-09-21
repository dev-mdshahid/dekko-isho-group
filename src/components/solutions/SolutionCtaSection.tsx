import { ButtonArrow } from '../ui/ButtonArrow'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { SectionLines } from '../ui/SectionDecor'

export type SolutionCtaContent = {
  badge: string | null
  heading: string
  description: string
  buttonLabel: string
  buttonHref?: string | null
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
        <div
          id={`${idPrefix}-cta-card`}
          className="solution-cta-card"
          data-solution-animate="cta-card"
        >
          <div className="solution-cta-content">
            {badge && <PreSectionTitle title={badge} variant="bg-dark" />}
            <h2 className="solution-cta-heading">{heading}</h2>
            <p className="solution-cta-description">{description}</p>
          </div>
          {buttonHref && (
            <div className="solution-cta-action">
              <ButtonArrow to={buttonHref} label={buttonLabel} variant="button-white-bg" />
            </div>
          )}
        </div>
      </div>
      <SectionLines border="grey" />
    </section>
  )
}
