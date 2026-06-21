import { legacyDoc, legacyImage } from '../../lib/assets'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

const HERO_IMAGE = legacyImage('About-Hero-Image_1About-Hero-Image.webp')
const MARQUEE_TEXT = 'SINCE - 2005'

function AboutMarqueeList() {
  return (
    <div className="about-marquee-list" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <h2 key={index} className="marquee-text">
          {MARQUEE_TEXT}
        </h2>
      ))}
    </div>
  )
}

export function AboutImageInfoSection() {
  return (
    <div className="image-info-about">
      <div className="w-layout-grid grid-hero-about">
        <div className="about-image-left">
          <img
            src={HERO_IMAGE}
            loading="eager"
            sizes="(max-width: 1337px) 100vw, 1337px"
            srcSet={`${HERO_IMAGE} 500w, ${HERO_IMAGE} 800w, ${HERO_IMAGE} 1080w, ${HERO_IMAGE} 1337w`}
            alt="About Image"
            className="about-image"
          />
        </div>
        <div className="about-info-right">
          <FadeIn id="96f6f12b-8abd-e5cb-a63e-159fbdedcd3f" className="about-hero-content">
            <div className="about-content-inner">
              <p className="about-hero-description">
                We are a team dedicated to precision engineering, delivering solutions that shape
                industries worldwide. Our journey is defined by trust, quality, and a commitment to
                excellence in every project.
              </p>
              <div className="about-hero-button">
                <ButtonArrow to="#team-section" label="Meet Our Team" />
                <a
                  href={legacyDoc('PDF.pdf')}
                  target="_blank"
                  rel="noreferrer"
                  className="download-link text-dark"
                >
                  Download Brochure
                </a>
              </div>
            </div>
          </FadeIn>
          <div data-w-id="6001c8d9-18d9-4c45-4dcf-fe0732e5a030" className="about-hero-text-marquee">
            <div className="about-marquee-track">
              <AboutMarqueeList />
              <AboutMarqueeList />
              <AboutMarqueeList />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
