import { legacyDoc } from '../../lib/assets'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

const HERO_IMAGE = '/images/corporate-building.png'

export function AboutImageInfoSection() {
  return (
    <div className="image-info-about">
      <div className="w-layout-grid grid-hero-about">
        <div className="about-image-left">
          <img
            src={HERO_IMAGE}
            loading="eager"
            alt="Corporate building"
            className="about-image"
          />
        </div>
        <div className="about-info-right">
          <FadeIn id="96f6f12b-8abd-e5cb-a63e-159fbdedcd3f" className="about-hero-content">
            <div className="about-content-inner">
              <p className="about-hero-description">
                A diversified Bangladeshi conglomerate built on seven decades of leadership through
                excellence – in apparel, furniture, paints, restaurants, fintech, and deep tech.
              </p>
              <div className="about-hero-button">
                <ButtonArrow to="#team-section" label="Meet Leadership" />
                <a
                  href={legacyDoc('PDF.pdf')}
                  target="_blank"
                  rel="noreferrer"
                  className="download-link text-white"
                >
                  Download brochure
                </a>
              </div>
            </div>
          </FadeIn>
          <div className="about-hero-text-marquee">
            <h2 className="marquee-text">SINCE 1953</h2>
          </div>
        </div>
      </div>
    </div>
  )
}
