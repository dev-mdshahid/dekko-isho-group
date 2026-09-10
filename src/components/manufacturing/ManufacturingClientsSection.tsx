import { Globe2, Tag, UsersRound } from 'lucide-react'
import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { manufacturingClients, type ManufacturingClientRegionId } from '../../data/manufacturing/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { ManufacturingLogoMarquee } from './ManufacturingLogoMarquee'

export function ManufacturingClientsSection() {
  const { id, badge, title, description, regions, yearsOfTrust } = manufacturingClients
  const [activeRegionId, setActiveRegionId] = useState<ManufacturingClientRegionId>('europe')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeRegion = regions.find((region) => region.id === activeRegionId) ?? regions[0]
  const partnerCount = new Set(regions.flatMap((region) => region.logos.map((logo) => logo.alt))).size

  const selectRegion = (regionId: ManufacturingClientRegionId, index: number) => {
    setActiveRegionId(regionId)
    tabRefs.current[index]?.focus()
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % regions.length
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + regions.length) % regions.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = regions.length - 1
    if (nextIndex === undefined) return
    event.preventDefault()
    selectRegion(regions[nextIndex].id, nextIndex)
  }

  const summaryStats = [
    { value: `${partnerCount}+`, label: 'Global Partners', icon: Tag },
    { value: String(regions.length), label: 'Key Regions', icon: Globe2 },
    { value: yearsOfTrust, label: 'Years of Trust', icon: UsersRound },
  ]

  return (
    <section id={id} className="mfg-clients-section">
      <div className="mfg-clients-container">
        <FadeIn id="mfg-clients-header" className="mfg-clients-header" variant="slide-in-bottom">
          <PreSectionTitle title={badge} />
          <h2 className="mfg-clients-title">{title}</h2>
          <p className="mfg-clients-description">{description}</p>

          <div className="mfg-clients-stats" aria-label="Partnership summary">
            {summaryStats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="mfg-clients-stat">
                <span className="mfg-clients-stat-icon"><Icon aria-hidden="true" /></span>
                <span className="mfg-clients-stat-copy"><strong>{value}</strong><span>{label}</span></span>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn id="mfg-clients-panel" className="mfg-clients-panel" delay={40} variant="slide-in-bottom">
          <div className="mfg-clients-panel-top">
            <div className="mfg-clients-region-copy">
              <span className="mfg-clients-eyebrow">Our partners in</span>
              <h3>{activeRegion.title}</h3>
              <p>{activeRegion.description}</p>
            </div>

            <div className="mfg-clients-tabs" role="tablist" aria-label="Client markets">
              {regions.map((region, index) => {
                const isActive = region.id === activeRegion.id
                return (
                  <button
                    key={region.id}
                    ref={(element) => { tabRefs.current[index] = element }}
                    id={`mfg-clients-tab-${region.id}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="mfg-clients-region-panel"
                    tabIndex={isActive ? 0 : -1}
                    className="mfg-clients-tab"
                    style={{ '--mfg-region-accent': region.accent } as CSSProperties}
                    onClick={() => selectRegion(region.id, index)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                  >
                    <span aria-hidden="true" />{region.title}
                  </button>
                )
              })}
            </div>

            <div className="mfg-clients-region-count" aria-hidden="true">
              <strong>{activeRegion.logos.length}</strong>
              <span>{activeRegion.partnerLabel}</span>
            </div>
          </div>

          <div
            id="mfg-clients-region-panel"
            role="tabpanel"
            aria-labelledby={`mfg-clients-tab-${activeRegion.id}`}
            className="mfg-clients-region-panel"
          >
            <p className="sr-only" aria-live="polite">
              Showing {activeRegion.logos.length} {activeRegion.partnerLabel.toLowerCase()}.
            </p>
            <ManufacturingLogoMarquee
              logos={activeRegion.logos}
              regionId={activeRegion.id}
              regionLabel={activeRegion.title}
            />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
