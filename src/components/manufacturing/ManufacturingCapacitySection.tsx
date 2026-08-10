import type { CapacityStat } from '../ui/CapacityStatCircles'
import { ButtonArrow } from '../ui/ButtonArrow'
import { CapacityStatCircles } from '../ui/CapacityStatCircles'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export type ManufacturingCapacityContent = {
  badge: string
  title: string
  /** Optional leading accent word (Yale Blue). */
  titleLeadingAccent?: string
  titleBefore?: string
  /** Optional mid/trailing accent word. Use titleAccentTone when set with titleLeadingAccent. */
  titleAccent?: string
  titleAccentTone?: 'brand' | 'yale' | 'amaranth'
  titleAfter?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  stats: CapacityStat[]
  pills?: string[]
  keyMetrics?: Array<{
    id: string
    label: string
    value: string
  }>
}

type ManufacturingCapacitySectionProps = {
  content: ManufacturingCapacityContent
  idPrefix?: string
}

function accentClassName(tone: ManufacturingCapacityContent['titleAccentTone'] = 'brand') {
  if (tone === 'yale') return 'mfg-capacity-title-accent mfg-capacity-title-accent--yale'
  if (tone === 'amaranth') return 'mfg-capacity-title-accent mfg-capacity-title-accent--amaranth'
  return 'mfg-capacity-title-accent'
}

export function ManufacturingCapacitySection({
  content,
  idPrefix = 'mfg',
}: ManufacturingCapacitySectionProps) {
  const {
    badge,
    title,
    titleLeadingAccent,
    titleBefore,
    titleAccent,
    titleAccentTone,
    titleAfter,
    description,
    ctaLabel,
    ctaHref,
    stats,
    pills,
    keyMetrics,
  } = content

  const hasAccentTitle = Boolean(titleLeadingAccent || (titleBefore && titleAccent))

  return (
    <section id={`${idPrefix}-capacity`} className="service-step-section mfg-capacity-section">
      <div className="container">
        <div className="service-step-main section-spacing">
          <div className="mfg-capacity-grid">
            <FadeIn
              id={`${idPrefix}-capacity-left`}
              className="mfg-capacity-left"
              variant="slide-in-bottom"
            >
              <PreSectionTitle title={badge} />
              <h2 className="section-title mfg-capacity-title">
                {hasAccentTitle ? (
                  <>
                    {titleLeadingAccent ? (
                      <>
                        <span className={accentClassName('yale')}>{titleLeadingAccent}</span>{' '}
                      </>
                    ) : null}
                    {titleBefore ? <>{titleBefore} </> : null}
                    {titleAccent ? (
                      <span className={accentClassName(titleAccentTone)}>
                        {titleAccent}
                      </span>
                    ) : null}
                    {titleAfter ? ` ${titleAfter}` : null}
                  </>
                ) : (
                  title
                )}
              </h2>
              {description && (
                <p className="mfg-capacity-description">{description}</p>
              )}
              {keyMetrics && keyMetrics.length > 0 ? (
                <div className="mfg-capacity-metrics">
                  {keyMetrics.map((metric) => (
                    <div key={metric.id} className="mfg-capacity-metric">
                      <span className="mfg-capacity-metric-label">{metric.label}</span>
                      <p className="mfg-capacity-metric-value">{metric.value}</p>
                    </div>
                  ))}
                </div>
              ) : null}
              {ctaLabel && ctaHref ? (
                <div className="mfg-capacity-cta">
                  <ButtonArrow to={ctaHref} label={ctaLabel} />
                </div>
              ) : null}
            </FadeIn>

            <FadeIn
              id={`${idPrefix}-capacity-cluster`}
              className="mfg-capacity-cluster"
              variant="slide-in-bottom"
              delay={60}
            >
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
