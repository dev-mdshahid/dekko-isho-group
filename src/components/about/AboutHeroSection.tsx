import { legacyImage } from '../../lib/assets'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

const AVATAR_IMAGES = [
  legacyImage('Avatar-Image-2_1Avatar-Image-2.webp'),
  legacyImage('Avatar-Image-3_1Avatar-Image-3.webp'),
  legacyImage('Avatar-Image-4_1Avatar-Image-4.webp'),
  legacyImage('Avatar-Image-1_1Avatar-Image-1.webp'),
]

export function AboutHeroSection() {
  return (
    <section className="about-hero-section">
      <div className="about-hero-main section-spacing-top">
        <div className="container-full">
          <FadeIn id="496825ca-af47-4d2c-6b28-e6a5f87ad674" className="about-hero-title-wrap">
            <PreSectionTitle title="Who We Are" />
            <h1 className="about-hero-title">About us</h1>
          </FadeIn>
          <div className="about-hero-client-main">
            <FadeIn id="14efba68-2b2c-ae69-93fd-85a67624da60" className="about-avatar-inner">
              <div className="avatar _02">
                {AVATAR_IMAGES.map((src, index) => (
                  <div key={src} className={`avatar-box${index > 0 ? ' one' : ''}`}>
                    <img src={src} loading="lazy" alt="Avatar Image" className="avatar-image one" />
                  </div>
                ))}
                <a href="#team-section" className="avatar-box one w-inline-block">
                  <div className="avatar-icon-box one">
                    <div className="avatar-count">10+</div>
                  </div>
                </a>
              </div>
              <FadeIn id="ef2e088f-366f-df10-4bdc-7d19407e5541" className="avatar-info-text one">
                Team of passionate professionals
              </FadeIn>
            </FadeIn>
            <FadeIn id="4e6cea0b-7fe4-fcf0-6c20-cd236dbea4fa" className="about-avatar-right-text">
              <FadeIn id="f8fed388-5152-c9ed-792e-2b07c908148e" className="text">
                21.0278° N, 105.8342° E
              </FadeIn>
            </FadeIn>
          </div>
        </div>
      </div>
      <SectionLines />
      <img
        src={legacyImage('Shadow_1Shadow.webp')}
        loading="lazy"
        sizes="(max-width: 959px) 100vw, 959px"
        srcSet={`${legacyImage('Shadow_1-p-500.png')} 500w, ${legacyImage('Shadow_1-p-800.png')} 800w, ${legacyImage('Shadow_1Shadow.webp')} 959w`}
        alt="Section Shadow"
        className="section-shadow"
      />
      <NoiseOverlay />
    </section>
  )
}
