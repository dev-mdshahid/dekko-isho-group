import { roadmapItems } from '../../data/about/roadmapItems'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { SectionLines } from '../ui/SectionDecor'

export function AboutRoadmapSection() {
  return (
    <section className="about-roadmap-section service-category-section">
      <div className="about-roadmap-container">
        <div className="service-category-main section-spacing">
          <div className="service-category-inner">
            <div className="w-layout-grid grid-category-title">
              <FadeIn id="about-roadmap-badge" className="title-grid-left">
                <PreSectionTitle title="Future Growth" variant="bg-dark" />
              </FadeIn>
              <div className="about-roadmap-spacer" aria-hidden="true" />
              <FadeIn id="about-roadmap-title" className="title-grid-right">
                <h2 className="category-title about-roadmap-title">
                  Roadmap <span className="text-linear-gradient">Towards</span>
                  <br />
                  2030
                </h2>
              </FadeIn>
            </div>

            <div className="category-content-wrap">
              <FadeIn id="about-roadmap-columns" className="w-layout-grid grid-category-inner">
                <div className="category-inner-left">
                  <div className="category-text">Category</div>
                </div>
                <div className="about-roadmap-spacer" aria-hidden="true" />
                <div className="category-inner-right">
                  <div className="category-text">Details</div>
                </div>
              </FadeIn>

              {roadmapItems.map((item, index) => (
                <FadeIn
                  key={item.id}
                  id={item.id}
                  className="w-layout-grid grid-category-info"
                  delay={index * 60}
                >
                  <div className="category-name-wrap">
                    <div className="category-name">{item.category}</div>
                  </div>
                  <div className="about-roadmap-spacer" aria-hidden="true" />
                  <div className="category-details-wrap">
                    <div className="category-details">{item.details}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SectionLines border="dark" />
    </section>
  )
}
