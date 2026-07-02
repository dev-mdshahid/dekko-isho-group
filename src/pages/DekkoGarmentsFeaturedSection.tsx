import { FadeIn } from '../components/ui/FadeIn'
import { PreSectionTitle } from '../components/ui/PreSectionTitle'

const FEATURED_IMAGE = '/images/skyview-company.png'

export function DekkoGarmentsFeaturedSection() {
  return (
    <section className="dekko-garments-featured">
      <div className="dekko-garments-featured-container">
        <FadeIn id="dekko-garments-featured-header" className="dekko-garments-featured-header">
          <PreSectionTitle title="Watch our Excellence" />
          <h2 className="dekko-garments-featured-title">See The work that defines us</h2>
        </FadeIn>

        <FadeIn id="dekko-garments-featured-media" className="dekko-garments-featured-media" delay={60}>
          <img
            src={FEATURED_IMAGE}
            loading="lazy"
            decoding="async"
            width={1320}
            height={692}
            alt="Aerial view of Dekko Garments Ltd facility with solar panel rooftops"
            className="dekko-garments-featured-photo"
          />
          <div className="dekko-garments-featured-overlay" aria-hidden="true" />
          <div className="dekko-garments-featured-caption">
            <span className="dekko-garments-featured-caption-label">Featured Image</span>
            <span className="dekko-garments-featured-caption-title">Dekko Garments Ltd</span>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
