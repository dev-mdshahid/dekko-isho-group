import {
  dekkoFashionsCategoriesIntro,
  dekkoFashionsCategoryItems,
} from '../data/industry/dekkoFashionsCategories'
import { legacyDoc } from '../lib/assets'
import { ButtonArrow } from '../components/ui/ButtonArrow'
import { FadeIn } from '../components/ui/FadeIn'
import { SectionLines } from '../components/ui/SectionDecor'

export function DekkoFashionsCategoriesSection() {
  return (
    <section className="dekko-fashions-categories">
      <SectionLines border="dark" />

      <div className="dekko-fashions-categories-container">
        <FadeIn id="dekko-fashions-categories-header" className="dekko-fashions-categories-header">
          <h2 className="dekko-fashions-categories-title">{dekkoFashionsCategoriesIntro.title}</h2>
          <div className="dekko-fashions-categories-actions">
            <a
              href={legacyDoc('PDF.pdf')}
              target="_blank"
              rel="noreferrer"
              className="download-link text-white dekko-fashions-categories-download"
            >
              Download brochure
            </a>
            <ButtonArrow
              to="#"
              label="View all products"
              className="dekko-fashions-categories-button primary-button w-inline-block"
            />
          </div>
        </FadeIn>

        <div className="dekko-fashions-categories-grid">
          {dekkoFashionsCategoryItems.map((item, index) => (
            <FadeIn
              key={item.id}
              id={`dekko-fashions-category-${item.id}`}
              className="dekko-fashions-categories-card"
              delay={index * 50}
            >
              <h3 className="dekko-fashions-categories-card-title">{item.title}</h3>
              <div className="dekko-fashions-categories-card-media">
                <img
                  src={item.imageSrc}
                  loading="lazy"
                  alt={item.imageAlt}
                  className="dekko-fashions-categories-card-image"
                />
              </div>
              <div className="dekko-fashions-categories-card-footer">
                <span className="dekko-fashions-categories-card-material">{item.material}</span>
                <span className="dekko-fashions-categories-card-meta">{item.meta}</span>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn id="dekko-fashions-categories-footer" className="dekko-fashions-categories-footer" delay={80}>
          <p className="dekko-fashions-categories-description">{dekkoFashionsCategoriesIntro.footer}</p>
        </FadeIn>
      </div>
    </section>
  )
}
