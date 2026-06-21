import { chairmanParagraphs, chairmanQuote } from '../../data/about/chairmanNote'
import { FadeIn } from '../ui/FadeIn'

const CHAIRMAN_PORTRAIT = '/images/shahid-hossain.jpg'

export function AboutChairmanSection() {
  return (
    <section className="about-chairman-section section-spacing">
      <div className="about-chairman-container">
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
              <div className="pre-section-title-inner">
                <div className="pre-section-title-square" aria-hidden="true" />
                <div className="pre-section-title about-chairman-label-text">Note From The Chairman</div>
              </div>
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
