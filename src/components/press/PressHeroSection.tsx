import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function PressHeroSection() {
  return (
    <section className="hero-simple-section">
      <div className="container-medium">
        <div className="hero-simple-wrap">
          <FadeIn id="af0a8489-00c7-95fb-3085-49be9123b83a">
            <h1 className="hero-inner-title">Press</h1>
          </FadeIn>
        </div>
      </div>
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
