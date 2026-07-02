import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function GalleryHeroSection() {
  return (
    <section className="hero-simple-section">
      <div className="container-gallery">
        <div className="hero-simple-wrap">
          <FadeIn id="gallery-hero-title">
            <h1 className="hero-inner-title">Gallery</h1>
          </FadeIn>
        </div>
      </div>
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
