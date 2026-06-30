import { useRef } from 'react'

import {
  ROADMAP_STREET_IMAGE,
  ROADMAP_VIEWBOX_HEIGHT,
  ROADMAP_VIEWBOX_WIDTH,
  roadmapItems,
} from '../../data/about/roadmapItems'
import { useRoadmapAnimation } from '../../hooks/useRoadmapAnimation'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { RoadmapPointer } from './RoadmapPointer'

const sortedRoadmapItems = [...roadmapItems].sort((a, b) => a.anchorX - b.anchorX)

export function AboutRoadmapSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useRoadmapAnimation(sectionRef)

  return (
    <section
      ref={sectionRef}
      className="about-roadmap-section about-roadmap-section--about section-spacing"
    >
      <div className="about-roadmap-container">
        <FadeIn id="about-roadmap-header" className="about-roadmap-header">
          <PreSectionTitle title="Future Growth" />
          <h2 className="about-roadmap-title">
            Roadmap <span className="about-roadmap-title-accent">Towards</span> 2030
          </h2>
        </FadeIn>
      </div>

      <div className="about-roadmap-stage-wrap">
        <div className="about-roadmap-stage" data-about-animate="roadmap-stage">
          <img
            src={ROADMAP_STREET_IMAGE}
            loading="lazy"
            alt=""
            aria-hidden="true"
            className="about-roadmap-street"
            data-about-animate="roadmap-street"
          />

          <div className="about-roadmap-milestones">
            {sortedRoadmapItems.map((item, step) => (
              <div
                key={item.id}
                data-about-animate="roadmap-milestone"
                data-roadmap-step={step}
                className={`about-roadmap-milestone about-roadmap-milestone--${item.pointerDirection} about-roadmap-milestone--text-${item.textSide}`}
                style={{
                  left: `${(item.anchorX / ROADMAP_VIEWBOX_WIDTH) * 100}%`,
                  top: `${(item.anchorY / ROADMAP_VIEWBOX_HEIGHT) * 100}%`,
                }}
              >
                <div className="about-roadmap-milestone-inner">
                  <div className="about-roadmap-pointer-wrap" data-about-animate="roadmap-pointer">
                    <RoadmapPointer
                      color={item.color}
                      number={item.number}
                      orientation={item.pointerDirection}
                    />
                  </div>
                  <div
                    className="about-roadmap-milestone-text"
                    data-about-animate="roadmap-milestone-text"
                  >
                    <h3 className="about-roadmap-milestone-title">{item.title}</h3>
                    <p className="about-roadmap-milestone-description">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
