import { Link } from 'react-router-dom'
import { serviceSpecialities, type ServiceFeatureGroup } from '../../data/home/specialities'
import { legacyImage } from '../../lib/assets'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

function ServiceArrow({
  arrowWIds,
  className = 'service-arrow',
}: {
  arrowWIds: [string, string]
  className?: string
}) {
  return (
    <div className={className}>
      <img
        src={legacyImage('testimonial-Slide-Arrow-1.svg')}
        loading="lazy"
        data-w-id={arrowWIds[0]}
        alt=""
        className="service-icon-01"
      />
      <img
        src={legacyImage('testimonial-Slide-Arrow-1.svg')}
        loading="lazy"
        data-w-id={arrowWIds[1]}
        alt=""
        className="service-hover-icon"
      />
    </div>
  )
}

function ServiceFeatures({ features }: { features: string[] | ServiceFeatureGroup[] }) {
  if (features.length === 0) return null

  if (typeof features[0] === 'string') {
    return (
      <div className="service-feature-list">
        <div className="service-feature-group-items">
          {(features as string[]).map((item) => (
            <div key={item} className="service-feature-group-item">
              {item}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="service-feature-list service-feature-list--grouped">
      {(features as ServiceFeatureGroup[]).map((group) => (
        <div key={group.group} className="service-feature-group">
          <div className="service-feature-text text-linear-gradient">{group.group}</div>
          <div className="service-feature-group-items">
            {group.items.map((item) => (
              <div key={item} className="service-feature-group-item">
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ServiceSection() {
  return (
    <section className="service-section section-spacing-top">
      <div className="container-full">
        <div className="service-details-main">
          <FadeIn id="238c3f25-28e9-d07e-772d-22cc173e9e24" className="service-details-wrap">
            <PreSectionTitle title="What Makes Us Special" />
            <div className="section-title-wrap">
              <div className="section-title-intro">
                <h2 className="section-title">
                  Weaving the <span className="text-linear-gradient">Future</span> of Fashion
                </h2>
                <p className="service-description">
                  Where precision meets excellence, and every stitch reflects a global standard.
                </p>
              </div>
              <div id="w-node-e23adfcb-92aa-cd61-ca12-ef84ce0764ac-ae320c59" className="section-button-wrap">
                <ButtonArrow to="/services" label="Explore all capabilities" />
              </div>
            </div>
          </FadeIn>
          <div className="service-info">
            {serviceSpecialities.map((speciality) => (
              <div
                key={speciality.id}
                className={`service-list-wrapper ${speciality.wrapperClass} w-dyn-list`}
              >
                <div role="list" className="service-list w-dyn-items">
                  <div role="listitem" className="service-list-item w-dyn-item">
                    <Link
                      data-w-id={speciality.linkId}
                      to="/services"
                      className="service-info-link w-inline-block"
                    >
                      <div className="service-info-inner">
                        <div className="service-image-main">
                          <div className="service-image-wrap">
                            <img
                              src={speciality.image}
                              loading="lazy"
                              decoding="async"
                              sizes="(max-width: 767px) 100vw, (max-width: 991px) 90vw, 530px"
                              data-w-id={speciality.imageWId}
                              alt={speciality.title}
                              className="service-image"
                            />
                          </div>
                        </div>
                        <div className="service-content-wrap">
                          <div className="service-name-wrapper">
                            <h2 className="service-name">{speciality.title}</h2>
                            <ServiceArrow
                              arrowWIds={speciality.arrowWIds}
                              className="service-arrow service-arrow-mobile"
                            />
                          </div>
                          <ServiceFeatures features={speciality.features} />
                        </div>
                      </div>
                      <ServiceArrow
                        arrowWIds={speciality.arrowWIds}
                        className="service-arrow service-arrow-desktop"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            <div className="service-box-height" aria-hidden="true" />
          </div>
          <div className="cta-wrap">
            <FadeIn id="2a6fecb6-c324-2a47-4e56-63bf9666fe76" className="cta-info-wrapper">
              <div className="cta-info-inner">
                <h2 className="cta-text">
                  Ready to start your <br />
                  next project?
                </h2>
                <div className="cta-button">
                  <ButtonArrow
                    to="/contact"
                    label="Schedule consultation"
                    variant="button-white-bg"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
