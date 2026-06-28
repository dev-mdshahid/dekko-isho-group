import { Link } from 'react-router-dom'
import { serviceSpecialities, type ServiceFeatureGroup } from '../../data/home/specialities'
import { legacyImage } from '../../lib/assets'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

function ServiceTitle({ title }: { title: string }) {
  const spaceIndex = title.indexOf(' ')
  const firstWord = spaceIndex === -1 ? title : title.slice(0, spaceIndex)
  const rest = spaceIndex === -1 ? '' : title.slice(spaceIndex)

  return (
    <h2 className="service-name">
      <span className="service-name-highlight">{firstWord}</span>
      {rest}
    </h2>
  )
}

function ServiceCardAction({ className }: { className?: string }) {
  return (
    <span className={className ? `service-card-action ${className}` : 'service-card-action'} aria-hidden="true">
      <span className="button-icon-bg service-card-action__icon">
        <img
          src={legacyImage('button-icon.svg')}
          loading="lazy"
          alt=""
          className="button-icon"
        />
        <img
          src={legacyImage('button-icon.svg')}
          loading="lazy"
          alt=""
          className="button-icon-hover"
        />
      </span>
    </span>
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

function ServiceFeatures({
  features,
  featureLabel,
}: {
  features: string[] | ServiceFeatureGroup[]
  featureLabel?: string
}) {
  if (features.length === 0) return null

  if (typeof features[0] === 'string') {
    return (
      <div className="service-feature-list">
        {featureLabel ? <div className="service-feature-text">{featureLabel}</div> : null}
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
          <div className="service-feature-text">{group.group}</div>
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
    <section className="service-section">
      <div className="container-full">
        <div className="service-details-main">
          <FadeIn id="238c3f25-28e9-d07e-772d-22cc173e9e24" className="service-details-wrap">
            <PreSectionTitle title="Precision at Global Scale " />
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
                    <Link
                      to={speciality.to}
                      className="service-info-link"
                      aria-label={speciality.title}
                    >
                      <div className="service-info-inner">
                        <div className="service-image-main">
                          <img
                            src={speciality.icon}
                            loading="lazy"
                            decoding="async"
                            alt=""
                            className="service-icon"
                          />
                          <div className="service-image-wrap">
                            <img
                              src={speciality.image}
                              loading="lazy"
                              decoding="async"
                              sizes="(max-width: 767px) 100vw, (max-width: 991px) 90vw, 530px"
                              alt={speciality.title}
                              className="service-image"
                            />
                          </div>
                        </div>
                        <div className="service-content-wrap">
                          <div className="service-name-wrapper">
                            <ServiceTitle title={speciality.title} />
                            <ServiceCardAction />
                          </div>
                          <ServiceFeatures
                            features={speciality.features}
                            featureLabel={speciality.featureLabel}
                          />
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            <div className="service-box-height" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="service-section-gradient" aria-hidden="true">
        <div className="service-section-gradient-spacer" />
        <div className="service-section-gradient-image-wrap">
          <img
            src="/images/backgrounds/gradient-section.png"
            loading="lazy"
            decoding="async"
            alt=""
            className="service-section-gradient-image"
          />
        </div>
      </div>
    </section>
  )
}
