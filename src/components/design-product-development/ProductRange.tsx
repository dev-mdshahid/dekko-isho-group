
import type { CSSProperties } from 'react'

import { designProductDevelopmentProductRange } from '../../data/design-product-development/content'
import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import Model3DViewer from './Model3DViewer'

const ProductRange = () => {
  const { id, badge, title, items } = designProductDevelopmentProductRange

  return (
    <section id={id} className="dpd-product-range-section">
      <div className="dpd-product-range-container">
        <FadeIn
          id="dpd-product-range-header"
          className="dpd-product-range-header"
          variant="slide-in-bottom"
        >
          <PreSectionTitle title={badge} />
          <h2 className="dpd-product-range-title">{title}</h2>
        </FadeIn>

        <div className="dpd-product-range-grid" data-solution-animate-group>
          {items.map((item) => (
            <article
              key={item.id}
              id={`dpd-product-range-${item.id}`}
              className={`dpd-product-range-card ${item.model3d ? 'dpd-product-range-card--3d' : ''}`}
              style={{ '--dpd-product-card-bg': item.background } as CSSProperties}
              data-solution-animate="card"
            >
              <div className="dpd-product-range-card-visual">
                {item.model3d ? (
                  <Model3DViewer modelPath={item.model3d} label={item.label} />
                ) : item.image ? (
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="dpd-product-range-card-image"
                  />
                ) : (
                  <div className="dpd-product-range-card-placeholder" aria-hidden="true" />
                )}
              </div>
              <div className="dpd-product-range-card-body">
                <h3 className="dpd-product-range-card-title">
                  <span>{item.label}</span>
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>

      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}

export default ProductRange
