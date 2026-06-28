import { ROADMAP_IMAGE, roadmapItems } from '../../data/about/roadmapItems'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function AboutRoadmapSection() {
  return (
    <section className="about-roadmap-section about-roadmap-section--about section-spacing">
      <SectionLines />
      <NoiseOverlay />

      <div className="container about-roadmap-container">
        <FadeIn id="about-roadmap-header" className="about-roadmap-header">
          <PreSectionTitle title="Future Growth" />
          <h2 className="about-roadmap-title">
            Roadmap <span className="text-linear-gradient">Towards</span> 2030
          </h2>
        </FadeIn>

        <div className="about-roadmap-content">
          <FadeIn id="about-roadmap-visual" className="about-roadmap-visual">
            <img
              src={ROADMAP_IMAGE}
              loading="lazy"
              alt="Road leading through a forest toward misty mountains"
              className="about-roadmap-image"
            />
          </FadeIn>

          <div className="about-roadmap-cards">
            {roadmapItems.map((item, index) => (
              <FadeIn
                key={item.id}
                id={item.id}
                className="about-roadmap-card"
                delay={index * 60}
              >
                <img
                  src={item.icon}
                  width={64}
                  height={64}
                  loading="lazy"
                  alt={item.iconAlt}
                  className="about-roadmap-card-icon"
                />
                <div className="about-roadmap-card-content">
                  <h3 className="about-roadmap-card-title">{item.title}</h3>
                  <p className="about-roadmap-card-description">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
