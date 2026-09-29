import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function NewsHeroSection() {
  return (
    <section className="hero-simple-section">
      <div className="container-medium">
        <div className="hero-simple-wrap">
          <FadeIn id="news-hero-title">
            <h1 className="hero-inner-title">News</h1>
          </FadeIn>
        </div>
      </div>
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
