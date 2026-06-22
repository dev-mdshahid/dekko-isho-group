import { careerEmployeeVoices } from '../../data/career/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function CareerEmployeeVoicesSection() {
  return (
    <section className="career-voices-section section-spacing">
      <div className="career-content-container">
        <div className="career-voices-main">
          <FadeIn id="career-voices-header" className="career-voices-header">
            <PreSectionTitle title={careerEmployeeVoices.badge} variant="bg-dark" />
            <h2 className="career-voices-headline">{careerEmployeeVoices.headline}</h2>
          </FadeIn>

          <div className="career-voices-grid">
            {careerEmployeeVoices.testimonials.map((item, index) => (
              <FadeIn
                key={item.id}
                id={item.id}
                className="career-voice-card"
                delay={index * 80}
              >
                <p className="career-voice-quote">{item.quote}</p>
                <div className="career-voice-author">
                  <span className="career-voice-avatar" aria-hidden="true" />
                  <div className="career-voice-author-text">
                    <h3 className="career-voice-name">{item.name}</h3>
                    <p className="career-voice-role">{item.role}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
