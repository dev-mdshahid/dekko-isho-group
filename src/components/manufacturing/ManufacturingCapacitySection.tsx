import type { CapacityStat } from '../ui/CapacityStatCircles'
import { ButtonArrow } from '../ui/ButtonArrow'
import { CapacityStatCircles } from '../ui/CapacityStatCircles'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export type ManufacturingCapacityContent = {
  badge: string
  titleBefore: string
  titleAccent: string
  titleAfter: string
  ctaLabel: string
  ctaHref: string
  stats: CapacityStat[]
}

type ManufacturingCapacitySectionProps = {
  content: ManufacturingCapacityContent
  idPrefix?: string
}

export function ManufacturingCapacitySection({
  content,
  idPrefix = 'mfg',
}: ManufacturingCapacitySectionProps) {
  const { badge, titleBefore, titleAccent, titleAfter, ctaLabel, ctaHref, stats } = content

  return (
    <section className="service-step-section mfg-capacity-section">
      <div className="container">
        <div className="service-step-main section-spacing">
          <div className="mfg-capacity-grid">
            <FadeIn id={`${idPrefix}-capacity-left`} className="mfg-capacity-left">
              <PreSectionTitle title={badge} />
              <h2 className="section-title mfg-capacity-title">
                {titleBefore}{' '}
                <span className="mfg-capacity-accent">{titleAccent}</span> {titleAfter}
              </h2>
              <div className="mfg-capacity-cta">
                <ButtonArrow to={ctaHref} label={ctaLabel} />
              </div>
            </FadeIn>

            <FadeIn id={`${idPrefix}-capacity-cluster`} className="mfg-capacity-cluster">
              <CapacityStatCircles stats={stats} />
            </FadeIn>
          </div>
        </div>
      </div>
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
