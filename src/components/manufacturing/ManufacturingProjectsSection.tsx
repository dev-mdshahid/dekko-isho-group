import { useRef } from 'react'

import { manufacturingProjects } from '../../data/manufacturing/content'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll'
import { legacyImage } from '../../lib/assets'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function ManufacturingProjectsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  useHorizontalScroll(scrollRef)

  const { badge, title, projects } = manufacturingProjects

  return (
    <section className="section-spacing mfg-projects-section">
      <div className="container">
        <FadeIn id="mfg-projects-header" className="section-title-center one">
          <PreSectionTitle title={badge} />
          <h2 className="section-title title-center">{title}</h2>
        </FadeIn>
      </div>

      <div ref={scrollRef} className="mfg-projects-scroll">
        <div className="inner-service-list mfg-projects-track">
          {projects.map((project, index) => (
            <FadeIn key={project.id} id={`mfg-project-${project.id}`} delay={index * 60}>
              <div className="inner-service-link mfg-project-card w-inline-block">
                <div className="inner-service-image-wrap">
                  <img
                    src={project.image}
                    loading="lazy"
                    alt={project.imageAlt}
                    className="service-image-inner"
                  />
                  <div className="service-hover">
                    <img
                      src={legacyImage('button-icon.svg')}
                      loading="lazy"
                      alt=""
                      className="feature-icon"
                    />
                  </div>
                </div>
                <div className="service-content">
                  <h2 className="service-title">{project.title}</h2>
                  <div className="mfg-project-link">View Project</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
