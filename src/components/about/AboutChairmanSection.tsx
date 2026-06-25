import { chairmanParagraphs, chairmanQuote } from '../../data/about/chairmanNote'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

const CHAIRMAN_PORTRAIT = '/images/shahid-hossain.jpg'

export function AboutChairmanSection() {
  return (
    <section className="about-chairman-section about-chairman-section--about section-spacing">
      <div className="hero-section-overlay" aria-hidden="true" />
      <div className="container about-chairman-container">
        <div className="about-chairman-grid">
          <FadeIn id="about-chairman-profile" className="about-chairman-profile">
            <img
              src={CHAIRMAN_PORTRAIT}
              loading="lazy"
              alt="Shahid Hossain, Chairman of Dekko ISHO Group"
              className="about-chairman-portrait"
            />
            <div className="about-chairman-identity">
              <h2 className="about-chairman-name">Shahid Hossain</h2>
              <p className="about-chairman-role">Chairman, Dekko ISHO Group</p>
            </div>
          </FadeIn>

          <FadeIn id="about-chairman-message" className="about-chairman-message">
            <div className="about-chairman-label">
              <PreSectionTitle title="Note from the Chairman" />
            </div>

            <p className="about-chairman-quote">&ldquo;{chairmanQuote}&rdquo;</p>

            <div className="about-chairman-divider" aria-hidden="true" />

            <div className="about-chairman-body">
              {chairmanParagraphs.map((paragraph) => (
                <p key={paragraph} className="about-chairman-paragraph">
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
