import { chairmanParagraphs, chairmanQuote } from '../../data/about/chairmanNote'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

const CHAIRMAN_SECTION_ABSTRACT = '/images/about/about-section-abstract.png'
const CHAIRMAN_SECTION_Chairman_IMAGE = '/images/about/about-section-chairman-image.png'
const ABOUT_SECTION_BG = '/images/about/about-section-bg.jpg'

export function AboutChairmanSection() {
  return (
    <section className="about-chairman-section about-chairman-section--about section-spacing">
      {/* About background texture/image */}
      <div
        className="about-chairman-about-bg"
        aria-hidden="true"
      >
        <img
          src={ABOUT_SECTION_BG}
          alt=""
          className="about-chairman-about-bg-image"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="about-chairman-label">
        <PreSectionTitle title="Note from the Chairman" />
      </div>

      {/* Chairman visual */}
      <div className="about-chairman-visual">
        <img
          src={CHAIRMAN_SECTION_Chairman_IMAGE}
          alt=""
          className="about-chairman-visual-image about-chairman-visual-portrait"
          loading="lazy"
          decoding="async"
          aria-hidden="true"
        />
        <img
          src={CHAIRMAN_SECTION_ABSTRACT}
          alt=""
          className="about-chairman-visual-image about-chairman-visual-abstract"
          loading="lazy"
          decoding="async"
          aria-hidden="true"
        />
        <div
          className="about-chairman-visual-scrim"
          aria-hidden="true"
        />
        <div className="about-chairman-identity">
          <h2 className="about-chairman-name">Shahid Hossain</h2>
          <p className="about-chairman-role">Chairman, Dekko ISHO Group</p>
        </div>
      </div>

      <div className="container about-chairman-container">
        <div className="about-chairman-grid">
          <FadeIn
            id="about-chairman-message"
            className="about-chairman-message"
          >
            <p className="about-chairman-quote">
              &ldquo;{chairmanQuote}&rdquo;
            </p>

            <div className="about-chairman-body">
              {chairmanParagraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="about-chairman-paragraph"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
