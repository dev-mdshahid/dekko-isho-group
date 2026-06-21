import { FadeIn } from '../ui/FadeIn'

const PRINCIPLES = [
  {
    id: 'about-integrity-mission',
    title: 'Mission',
    description:
      'To grow exponentially in the apparel industry across the globe by attaining the highest quality standards.',
  },
  {
    id: 'about-integrity-vision',
    title: 'Vision',
    description: 'Challenge yourself to reach the top. Set the benchmark, then exceed it.',
  },
  {
    id: 'about-integrity-values',
    title: 'Values',
    description:
      'Innovation to advance fashion sustainably. Customer satisfaction through true partnership.',
  },
] as const

export function AboutIntegritySection() {
  return (
    <section className="about-integrity-section">
      <div className="about-integrity-main">
        <div className="about-integrity-container">
          <div className="about-integrity-grid">
            <FadeIn id="about-integrity-intro" className="about-integrity-intro">
              <h2 className="about-integrity-title">
                A Conglomerate <br /> Built on Ideas &amp; Integrity.
              </h2>
              <p className="about-integrity-description">
                Dekko ISHO Group believes in leadership through excellence. We are a distinct apparel
                group with strategic ventures in furniture, restaurants, fintech, and deep tech —
                striving for excellence through a culture of innovation and consciously conservative
                growth. Our adherence to quality and timeliness has earned us a competitive advantage
                that defines the industry standard.
              </p>
            </FadeIn>
            <div className="about-integrity-details">
              <FadeIn id="about-integrity-card" className="about-integrity-card">
                <div className="about-integrity-card-stripes about-integrity-card-stripes--top" />
                <div className="about-integrity-card-stripes about-integrity-card-stripes--bottom" />
                <div className="about-integrity-year">1953</div>
                <p className="about-integrity-card-text">
                  Three entrepreneurs, one bold idea, Bangladesh&apos;s first color paint
                  manufacturer - Roxy Paints Ltd. sparked a legacy of innovation.
                </p>
              </FadeIn>
              <div className="about-integrity-principles">
                {PRINCIPLES.map((item) => (
                  <FadeIn key={item.id} id={item.id} className="about-integrity-principle">
                    <h3 className="about-integrity-principle-title">{item.title}</h3>
                    <p className="about-integrity-principle-text">{item.description}</p>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
