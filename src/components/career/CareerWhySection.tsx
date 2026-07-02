import { careerWhy } from '../../data/career/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function CareerWhySection() {
  return (
    <section className="career-why-section">
      <div className="career-content-container">
        <div className="career-why-main">
          <FadeIn id="career-why-header" className="career-why-header">
            <PreSectionTitle title={careerWhy.badge} />
            <h2 className="career-why-title">{careerWhy.heading}</h2>
          </FadeIn>

          <div className="career-why-list">
            {careerWhy.items.map((item, index) => (
              <FadeIn key={item.id} id={item.id} className="career-why-item" delay={index * 60}>
                <div className="career-why-number" aria-hidden="true">
                  {item.number}
                </div>
                <div className="career-why-content">
                  <h3 className="career-why-item-title">{item.title}</h3>
                  <p className="career-why-item-description">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
