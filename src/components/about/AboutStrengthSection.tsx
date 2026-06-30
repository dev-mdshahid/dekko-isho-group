import { strengthIntro, strengthItems } from '../../data/about/strengthItems'
import { splitTitleIntoTwoLines } from '../../lib/splitTitleIntoTwoLines'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function AboutStrengthSection() {
  return (
    <section className="about-strength-section about-strength-section--about section-spacing">
      <div className="container about-strength-container">
        <div className="about-strength-main">
          <FadeIn id="about-strength-header" className="about-strength-header">
            <PreSectionTitle title="Our Strength" />
            <div className="about-strength-title-row">
              <span className="about-strength-accent" aria-hidden="true" />
              <h2 className="section-title about-strength-title">
                Built on{' '}
                <span className="about-strength-title-accent about-strength-title-accent--expertise">
                  Expertise
                </span>
                <br />
                Driven by{' '}
                <span className="about-strength-title-accent about-strength-title-accent--impact">
                  Impact
                </span>
              </h2>
            </div>
            <p className="about-strength-description">{strengthIntro}</p>
          </FadeIn>

          <div className="about-strength-grid">
            {strengthItems.map((item, index) => {
              const [titleLine1, titleLine2] = splitTitleIntoTwoLines(item.title)

              return (
              <FadeIn
                key={item.id}
                id={item.id}
                className="about-strength-card"
                delay={index * 60}
              >
                <div className="about-strength-card-top">
                  <div className="about-strength-card-number">{item.number}</div>
                  <h3 className="about-strength-card-title">
                    <span className="about-strength-card-title-line">{titleLine1}</span>
                    <span className="about-strength-card-title-line">{titleLine2}</span>
                  </h3>
                </div>
                <img
                  src={item.image}
                  loading="lazy"
                  alt={item.imageAlt}
                  className="about-strength-card-image"
                />
                <div className="about-strength-card-bottom">
                  <p className="about-strength-card-description">{item.description}</p>
                </div>
              </FadeIn>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
