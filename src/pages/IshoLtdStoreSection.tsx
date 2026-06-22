import { FadeIn } from '../components/ui/FadeIn'
import { PreSectionTitle } from '../components/ui/PreSectionTitle'
import { ishoLtdStore } from '../data/industry/ishoLtdStore'

export function IshoLtdStoreSection() {
  return (
    <section className="isho-ltd-store">
      <div className="isho-ltd-store-container">
        <FadeIn id="isho-ltd-store-card" className="isho-ltd-store-card">
          <div className="isho-ltd-store-copy">
            <PreSectionTitle title={ishoLtdStore.badge} />
            <h2 className="isho-ltd-store-title">{ishoLtdStore.title}</h2>
            <p className="isho-ltd-store-description">{ishoLtdStore.description}</p>
          </div>

          <div className="isho-ltd-store-address">
            <h3 className="isho-ltd-store-address-title">{ishoLtdStore.addressTitle}</h3>
            <address className="isho-ltd-store-address-lines">
              {ishoLtdStore.addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
          </div>

          <div className="isho-ltd-store-media">
            <img
              src={ishoLtdStore.imageSrc}
              loading="lazy"
              alt={ishoLtdStore.imageAlt}
              className="isho-ltd-store-image"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
