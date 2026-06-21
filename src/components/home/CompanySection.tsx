import { FadeIn } from '../ui/FadeIn'

const SKYVIEW_IMAGE = '/images/skyview-company.png'

export function CompanySection() {
  return (
    <section className="company-section">
      <div className="company-section-main">
        <div className="company-section-inner">
          <FadeIn id="company-section-content" className="company-section-content">
            <h2 className="company-section-title section-title text-white">
              Born in Bangladesh. <span className="text-linear-gradient">Trusted</span>
              <br />
              Worldwide
            </h2>
            <p className="company-section-description">
              Delivering for the world&apos;s most iconic brands with precision, purpose and pride
            </p>
          </FadeIn>
          <img
            src={SKYVIEW_IMAGE}
            loading="lazy"
            decoding="async"
            width={1320}
            height={486}
            alt="Aerial view of Dekko ISHO Group manufacturing facility with solar panel rooftops"
            className="company-section-image"
          />
        </div>
      </div>
    </section>
  )
}
