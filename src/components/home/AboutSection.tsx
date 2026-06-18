import { Link } from 'react-router-dom'
import { legacyDoc, legacyImage } from '../../lib/assets'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

const teamAvatars = [
  'Avatar-Image-2_1Avatar-Image-2.webp',
  'Avatar-Image-3_1Avatar-Image-3.webp',
  'Avatar-Image-4_1Avatar-Image-4.webp',
  'Avatar-Image-1_1Avatar-Image-1.webp',
]

export function AboutSection() {
  return (
    <section id="About-Section" className="about-section">
      <div className="about-main section-spacing">
        <div className="about-info">
          <div className="w-layout-blockcontainer container w-container">
            <div className="w-layout-grid grid-about">
              <FadeIn id="92898b08-3165-2543-ee25-b82b2b7a592b" className="about-left-wrap">
                <PreSectionTitle title="Who we are" />
                <div className="avatar">
                  {teamAvatars.map((avatar, index) => (
                    <div key={avatar} className={`avatar-box${index > 0 ? ' one' : ''}`}>
                      <img src={legacyImage(avatar)} loading="lazy" alt="Avatar Image" className="avatar-image" />
                    </div>
                  ))}
                  <Link to="/about#team-section" className="avatar-box one w-inline-block">
                    <div className="avatar-icon-box">
                      <div className="avatar-count">10</div>
                      <img src={legacyImage('.svg')} loading="lazy" alt="Avatar Icon" className="avatar-icon" />
                    </div>
                  </Link>
                </div>
                <div className="avatar-info">
                  Team Of passionate
                  <br />
                  professionals
                </div>
              </FadeIn>
              <div className="about-right-wrap">
                <div className="about-section-title">
                  <FadeIn id="710a89bc-f9dd-2ab9-dd91-b12ed4a78144" className="section-title">
                    <h2>
                      Driven by technology, backed by experience, focused on{' '}
                      <span className="text-linear-gradient">manufacturing</span> excellence
                    </h2>
                  </FadeIn>
                </div>
                <FadeIn id="017b83dc-7656-67a6-b23e-69b6032ef810" className="about-description">
                  <p>
                    Backed by advanced technology, skilled craftsmanship, and a commitment to quality, we help
                    businesses bring their ideas to life with confidence and speed. Whether it&apos;s prototyping
                    or full-scale production, we&apos;re your trusted partner every step of the way.
                  </p>
                </FadeIn>
                <FadeIn id="5a23ee6f-035d-2255-fd4f-73aa8e89689a" className="about-button-wrap">
                  <ButtonArrow to="/about" label="Learn More About Us" />
                  <a href={legacyDoc('PDF.pdf')} target="_blank" rel="noreferrer" className="download-link">
                    Download Brochure
                  </a>
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
        <div className="container-full">
          <div className="about-info-inner">
            <FadeIn id="52b525da-7c1b-3a5f-e1d2-3e25e3d423eb" className="about-info-box">
              <div className="about-info-inner-wrap">
                <div className="about-content">// 2005-2K25 //</div>
                <div className="inner-number">
                  <div className="numbers-counts">
                    <div data-target="20" className="count">
                      20
                      <br />
                    </div>
                  </div>
                  <div className="counter-symbol">
                    <div className="counter-symbol-text">+</div>
                  </div>
                </div>
                <p className="about-content-description">
                  Delivering consistent manufacturing excellence since day one.
                </p>
              </div>
              <img src={legacyImage('Group.png')} loading="lazy" alt="About Box Vector" className="about-box-vector" />
            </FadeIn>
            <img
              src={legacyImage('about-image.webp')}
              loading="lazy"
              data-w-id="2b6ca78d-f30a-dcb3-72dd-ee239194fdde"
              alt="About Image Box"
              className="about-image-box"
            />
            <FadeIn id="e0a0517f-1ee8-9dfc-bba2-14c8a6a448da" className="about-info-box box-bg-white">
              <img src={legacyImage('Logo.svg')} loading="lazy" alt="About Box Logo" className="about-box-logo" />
              <div className="counter-run">
                <div className="inner-number about-counter">
                  <div className="numbers-counts text-linear-gradient">
                    <div data-target="100" className="count">
                      100
                    </div>
                  </div>
                  <div className="counter-symbol">
                    <div className="counter-symbol-text">+</div>
                  </div>
                </div>
              </div>
              <div className="about-info-text">Trusted by businesses across multiple industries</div>
              <div className="about-rating-wrap">
                <div className="about-rating-text">
                  4.9 <span className="rating-small-text">/5.0</span>
                </div>
                <img src={legacyImage('01.svg')} loading="lazy" alt="Rating Image" className="rating-image" />
              </div>
            </FadeIn>
            <FadeIn id="a502134d-7170-6735-c416-b637dce64a74" className="about-info-box box-bg-dark">
              <div className="about-image-wrap">
                <img
                  src={legacyImage('about-round-image-2_1about-round-image-2.png')}
                  loading="lazy"
                  alt="About Image Small"
                  className="about-image-small image-one"
                />
                <img
                  src={legacyImage('about-round-image-3_1about-round-image-3.png')}
                  loading="lazy"
                  alt="About Image Small"
                  className="about-image-small image-two"
                />
                <img
                  src={legacyImage('about-round-image-1_1about-round-image-1.png')}
                  loading="lazy"
                  alt="About Image Small"
                  className="about-image-small image-three"
                />
              </div>
              <h2 className="like-score">
                1 million<span className="icon-primary">+</span>
              </h2>
              <p className="about-info-description">Precision-crafted components delivered globally</p>
            </FadeIn>
          </div>
        </div>
        <SectionLines />
        <NoiseOverlay />
      </div>
    </section>
  )
}
