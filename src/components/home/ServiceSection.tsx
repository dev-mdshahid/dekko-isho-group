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

function ServiceFeatureItem({ label }: { label: string }) {
  return (
    <div className="feature-item-inner">
      <img
        src="/images/list-icon-primary.svg"
        loading="lazy"
        alt=""
        className="feature-item-icon"
      />
      <div className="feature-item">{label}</div>
    </div>
  )
}

function ServiceFeatures({ features }: { features: string[] | ServiceFeatureGroup[] }) {
  if (features.length === 0) return null

  if (typeof features[0] === 'string') {
    return (
      <div className="service-feature-list">
        <div className="feature-list-item">
          {(features as string[]).map((item) => (
            <ServiceFeatureItem key={item} label={item} />
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
          <div className="service-feature-group-items feature-list-item">
            {group.items.map((item) => (
              <ServiceFeatureItem key={item} label={item} />
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
                <ButtonArrow to="#About-Section" label="Explore all capabilities" />
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
                    <div
                      data-w-id={speciality.linkId}
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
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="service-box-height" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="service-section-gradient" aria-hidden="true" />
    </section>
  )
}
