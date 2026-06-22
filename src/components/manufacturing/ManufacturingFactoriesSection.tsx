import { Link } from 'react-router-dom'

import { manufacturingFactories } from '../../data/manufacturing/content'
import { legacyImage } from '../../lib/assets'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { SectionLines } from '../ui/SectionDecor'

export function ManufacturingFactoriesSection() {
  const { badge, title, factories } = manufacturingFactories

  return (
    <section className="service-category-section mfg-factories-section">
      <div className="container">
        <div className="service-category-main section-spacing">
          <FadeIn id="mfg-factories-header" className="section-title-center one">
            <PreSectionTitle title={badge} variant="bg-dark" />
            <h2 className="section-title title-center text-white">{title}</h2>
          </FadeIn>

          <div className="inner-service-list mfg-factories-grid">
            {factories.map((factory, index) => (
              <FadeIn key={factory.id} id={`mfg-factory-${factory.id}`} delay={index * 80}>
                <Link to={factory.href} className="inner-service-link w-inline-block">
                  <div className="inner-service-image-wrap">
                    <img
                      src={factory.image}
                      loading="lazy"
                      alt={factory.imageAlt}
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
                    <h2 className="service-title">{factory.title}</h2>
                    <p className="feature-description">{factory.description}</p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
      <SectionLines border="dark" />
      <div className="bg-gradient" aria-hidden="true" />
    </section>
  )
}
