import { designProductDevelopmentMaterials } from '../../data/design-product-development/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function DesignMaterialsSection() {
  const { id, badge, title, items } = designProductDevelopmentMaterials

  return (
    <section id={id} className="dpd-materials-section">
      <div className="dpd-materials-container">
        <FadeIn id="dpd-materials-header" className="dpd-materials-header">
          <PreSectionTitle title={badge} />
          <h2 className="dpd-materials-title">{title}</h2>
        </FadeIn>

        <div className="dpd-materials-grid">
          {items.map((item, index) => (
            <FadeIn
              key={item.id}
              id={`dpd-materials-${item.id}`}
              className="dpd-materials-card"
              delay={index * 40}
            >
              <div className="dpd-materials-card-media">
                <img
                  src={item.image}
                  loading="lazy"
                  alt={item.imageAlt}
                  className="dpd-materials-card-image"
                />
              </div>
              <div className="dpd-materials-card-body">
                <h3 className="dpd-materials-card-title">{item.title}</h3>
                <p className="dpd-materials-card-description">{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
