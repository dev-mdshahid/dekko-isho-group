import type { SolutionExpertiseContent } from './SolutionExpertiseSection'
import { SolutionExpertiseSection } from './SolutionExpertiseSection'
import type { SolutionVideoHeroContent } from './SolutionVideoHeroSection'
import { SolutionVideoHeroSection } from './SolutionVideoHeroSection'

type SolutionIntroSectionsProps = {
  idPrefix: string
  hero: SolutionVideoHeroContent
  expertise: SolutionExpertiseContent
  className?: string
}

export function SolutionIntroSections({
  idPrefix,
  hero,
  expertise,
  className,
}: SolutionIntroSectionsProps) {
  const sectionClassName = ['service-details-section', 'section-spacing-top', 'solution-hero-section', className]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={sectionClassName}>
      <SolutionVideoHeroSection idPrefix={idPrefix} {...hero} />
      <SolutionExpertiseSection idPrefix={idPrefix} {...expertise} />
    </section>
  )
}
