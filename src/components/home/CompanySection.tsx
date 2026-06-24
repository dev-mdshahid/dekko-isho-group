import { FadeIn } from '../ui/FadeIn'
import { CompanyLogosSection } from './CompanyLogosSection'

const AWARDS_IMAGE = '/images/awards/all-awards.png'

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
            src={AWARDS_IMAGE}
            loading="lazy"
            decoding="async"
            width={1786}
            height={696}
            alt="Corporate awards, trophies, and certificates from partners including Jack & Jones, Ralph Lauren, and Kiabi, awarded to Dekko Garments Limited"
            className="company-section-image"
          />
        </div>
        <CompanyLogosSection />
      </div>
    </section>
  )
}
