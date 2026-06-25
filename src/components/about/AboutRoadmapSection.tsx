import { roadmapItems } from '../../data/about/roadmapItems'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function AboutRoadmapSection() {
  return (
    <section className="about-roadmap-section about-roadmap-section--about section-spacing">
      <div className="about-roadmap-section-glow" aria-hidden="true" />
      <div className="hero-section-overlay" aria-hidden="true" />
      <SectionLines />
      <NoiseOverlay />

      <div className="container about-roadmap-container">
        <FadeIn id="about-roadmap-header" className="about-roadmap-header">
          <PreSectionTitle title="Future Growth" />
          <h2 className="about-roadmap-title">
            Roadmap <span className="text-linear-gradient">Towards</span> 2030
          </h2>
        </FadeIn>

        <div className="about-roadmap-grid">
          {roadmapItems.map((item, index) => (
            <FadeIn
              key={item.id}
              id={item.id}
              className={`about-roadmap-card${item.wide ? ' about-roadmap-card--wide' : ''}`}
              delay={index * 60}
            >
              <div className="about-roadmap-card-icon-wrap">
                <img
                  src={item.icon}
                  width={64}
                  height={64}
                  loading="lazy"
                  alt={item.iconAlt}
                  className="about-roadmap-card-icon"
                />
              </div>
              <h3 className="about-roadmap-card-title">{item.title}</h3>
              <p className="about-roadmap-card-description">{item.description}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
