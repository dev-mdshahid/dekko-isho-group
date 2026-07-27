import type { CapacityStat } from '../ui/CapacityStatCircles'
import { ButtonArrow } from '../ui/ButtonArrow'
import { CapacityStatCircles } from '../ui/CapacityStatCircles'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export type ManufacturingCapacityContent = {
  badge: string
  title: string
  description?: string
  ctaLabel: string
  ctaHref: string
  stats: CapacityStat[]
  pills?: string[]
}

type ManufacturingCapacitySectionProps = {
  content: ManufacturingCapacityContent
  idPrefix?: string
}

export function ManufacturingCapacitySection({
  content,
  idPrefix = 'mfg',
}: ManufacturingCapacitySectionProps) {
  const { badge, title, description, ctaLabel, ctaHref, stats, pills } = content

  return (
    <section id={`${idPrefix}-capacity`} className="service-step-section mfg-capacity-section">
      <div className="container">
        <div className="service-step-main section-spacing">
          <div className="mfg-capacity-grid">
            <FadeIn id={`${idPrefix}-capacity-left`} className="mfg-capacity-left">
              <PreSectionTitle title={badge} />
              <h2 className="section-title mfg-capacity-title">{title}</h2>
              {description && (
                <p className="mfg-capacity-description">{description}</p>
              )}
              <div className="mfg-capacity-cta">
                <ButtonArrow to={ctaHref} label={ctaLabel} />
              </div>
            </FadeIn>

            <FadeIn id={`${idPrefix}-capacity-cluster`} className="mfg-capacity-cluster">
              <CapacityStatCircles stats={stats} />
            </FadeIn>
          </div>

          {pills && pills.length > 0 && (
            <FadeIn id={`${idPrefix}-capacity-pills`} className="mfg-capacity-pills">
              {pills.map((pill) => (
                <span key={pill} className="mfg-capacity-pill">
                  {pill}
                </span>
              ))}
            </FadeIn>
          )}
        </div>
      </div>
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
