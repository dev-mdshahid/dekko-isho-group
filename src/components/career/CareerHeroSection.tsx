import { careerHero } from '../../data/career/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function CareerHeroSection() {
  return (
    <section className="career-hero-section">
      <div className="career-hero-main section-spacing-top">
        <div className="container-full">
          <div className="career-hero-wrap">
            <FadeIn id="career-hero-title" className="career-hero-title-wrap">
              <PreSectionTitle title={careerHero.badge} />
              <h1 className="career-hero-title">
                {careerHero.titleLine1}
                <br />
                {careerHero.titleLine2}
              </h1>
            </FadeIn>
          </div>
        </div>
      </div>
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
