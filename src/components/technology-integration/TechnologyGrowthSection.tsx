import { technologyIntegrationGrowth } from '../../data/technology-integration/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function TechnologyGrowthSection() {
  const { badge, title, items } = technologyIntegrationGrowth

  return (
    <section className="service-category-section ti-growth-section">
      <div className="ti-growth-container">
        <div className="ti-growth-layout">
          <FadeIn id="ti-growth-intro" className="ti-growth-intro">
            <PreSectionTitle title={badge} variant="bg-dark" />
            <h2 className="ti-growth-title">{title}</h2>
          </FadeIn>

          <div className="ti-growth-table">
            {items.map((item, index) => (
              <FadeIn
                key={item.id}
                id={`ti-growth-${item.id}`}
                className={`ti-growth-row${index === items.length - 1 ? ' last' : ''}`}
                delay={index * 60}
              >
                <h3 className="ti-growth-row-title">{item.title}</h3>
                <p className="ti-growth-row-description">{item.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
