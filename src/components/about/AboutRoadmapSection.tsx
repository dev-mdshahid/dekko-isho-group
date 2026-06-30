import {
  ROADMAP_STREET_IMAGE,
  ROADMAP_VIEWBOX_HEIGHT,
  ROADMAP_VIEWBOX_WIDTH,
  roadmapItems,
} from '../../data/about/roadmapItems'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { RoadmapPointer } from './RoadmapPointer'

export function AboutRoadmapSection() {
  return (
    <section className="about-roadmap-section about-roadmap-section--about section-spacing">
      <div className="about-roadmap-container">
        <FadeIn id="about-roadmap-header" className="about-roadmap-header">
          <PreSectionTitle title="Future Growth" />
          <h2 className="about-roadmap-title">
            Roadmap <span className="about-roadmap-title-accent">Towards</span> 2030
          </h2>
        </FadeIn>
      </div>

      <FadeIn id="about-roadmap-stage" className="about-roadmap-stage-wrap">
        <div className="about-roadmap-stage">
          <img
            src={ROADMAP_STREET_IMAGE}
            loading="lazy"
            alt=""
            aria-hidden="true"
            className="about-roadmap-street"
          />

          <div className="about-roadmap-milestones">
            {roadmapItems.map((item) => (
              <div
                key={item.id}
                className={`about-roadmap-milestone about-roadmap-milestone--${item.pointerDirection} about-roadmap-milestone--text-${item.textSide}`}
                style={{
                  left: `${(item.anchorX / ROADMAP_VIEWBOX_WIDTH) * 100}%`,
                  top: `${(item.anchorY / ROADMAP_VIEWBOX_HEIGHT) * 100}%`,
                }}
              >
                <div className="about-roadmap-milestone-inner">
                  <RoadmapPointer
                    color={item.color}
                    number={item.number}
                    orientation={item.pointerDirection}
                  />
                  <div className="about-roadmap-milestone-text">
                    <h3 className="about-roadmap-milestone-title">{item.title}</h3>
                    <p className="about-roadmap-milestone-description">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
