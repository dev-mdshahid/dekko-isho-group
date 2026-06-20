import { homeProducts } from '../../data/home/products'
import { legacyDoc, legacyImage } from '../../lib/assets'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { SectionLines } from '../ui/SectionDecor'

export function ProductSection() {
  return (
    <section className="product-section">
      <div className="bg-shadow">
        <div className="bg-vector" />
      </div>
      <div className="product-main section-spacing">
        <div className="container">
          <div className="products-counter-main">
            <FadeIn id="5dc285f3-2c1b-5d8e-a87b-8fc080957d58" className="products-counter-wrap">
              <PreSectionTitle title="What we manufacture" variant="bg-dark" />
              <div className="products-counter-inner">
                <div className="inner-number like-score">
                  <div className="numbers-counts">
                    <div data-target="50,000" className="count">
                      50,000
                    </div>
                  </div>
                  <div className="counter-symbol text-primary">
                    <div>+</div>
                  </div>
                </div>
                <p className="products-counter-description">
                  Precision-built products delivered to clients across industries and continents.
                </p>
              </div>
            </FadeIn>
            <img
              src={legacyImage('Products-Icon.svg')}
              loading="lazy"
              data-w-id="af52d740-e50f-ce19-4cc3-814bbe0cdac6"
              data-fade-in
              alt="Product Info Image"
              className="product-info-image"
            />
          </div>
        </div>
        <div className="product-info-wrap">
          <div className="container-full">
            <div className="w-layout-grid grid-products">
              {homeProducts.map((product) => (
                <FadeIn key={product.id} id={product.id} className="product-info-main">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-image-wrapper">
                    <img
                      src={legacyImage(product.image)}
                      loading="lazy"
                      sizes="100vw"
                      srcSet={product.imageSrcSet}
                      alt="Product Image"
                      className="product-image"
                    />
                  </div>
                  <p className="product-description">{product.description}</p>
                  <div className="product-list">
                    {product.specs.map((spec, index) => (
                      <div
                        key={spec.label}
                        className={`product-list-item${index === product.specs.length - 1 ? ' last' : ''}`}
                      >
                        <div className="product-info">{spec.label}</div>
                        <div className="product-info-text">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
        <div className="container">
          <div className="product-inner-info">
            <FadeIn id="272f39e4-51eb-e15a-5d52-d0b9bb610f28" className="product-info-title">
              <h3>Explore our complete product range across industries.</h3>
            </FadeIn>
            <FadeIn id="2b4c5a0b-3ea6-4725-2cf9-ba9aec94d192" className="product-info-button-wrap">
              <a href={legacyDoc('PDF.pdf')} target="_blank" rel="noreferrer" className="download-link text-white">
                Download Brochure
              </a>
              <ButtonArrow to="/products" label="View All Products" variant="button-primary-bg" />
            </FadeIn>
          </div>
        </div>
      </div>
      <SectionLines border="dark" />
    </section>
  )
}
