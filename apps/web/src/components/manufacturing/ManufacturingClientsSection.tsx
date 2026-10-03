import { useRef, useState, type KeyboardEvent } from 'react'
import { manufacturingClients, type ManufacturingClientRegionId } from '../../data/manufacturing/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { ManufacturingLogoMarquee } from './ManufacturingLogoMarquee'
import { ManufacturingClientsMap } from './ManufacturingClientsMap'

export function ManufacturingClientsSection() {
  const { id, badge, title, description, regions, yearsOfTrust } = manufacturingClients
  const [activeRegionId, setActiveRegionId] = useState<ManufacturingClientRegionId>('north-america')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeRegion = regions.find((region) => region.id === activeRegionId) ?? regions[0]
  // const partnerCount = new Set(regions.flatMap((region) => region.logos.map((logo) => logo.alt))).size

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
    { value: `24+`, label: ['Global', 'Partners'], icon: '/images/dekko-clients/tags/asset-1.svg' },
    { value: `10+`, label: ['North American', 'Partners'], icon: '/images/dekko-clients/tags/north_america.svg' },
    { value: `14+`, label: ['European', 'Partners'], icon: '/images/dekko-clients/tags/europe_map_icon.svg' },
    // { value: String(regions.length), label: ['Key', 'Regions'], icon: '/images/dekko-clients/tags/asset-2.svg' },
    { value: yearsOfTrust, label: ['Years', 'of Trust'], icon: '/images/dekko-clients/tags/asset-3.svg' },
  ]

  return (
    <section id={id} className="mfg-clients-section">
      <div className="mfg-clients-container">
        <FadeIn id="mfg-clients-header" className="mfg-clients-header" variant="slide-in-bottom">
          <div className="mfg-clients-header-copy">
            <PreSectionTitle title={badge} />
            <h2 className="journey-roadmap-title mfg-clients-title">{title}</h2>
            {description ? (
              <p className="journey-roadmap-description mfg-clients-description">
                {description}
              </p>
            ) : null}

            <div className="mfg-clients-stats" aria-label="Partnership summary">
              {summaryStats.map(({ value, label, icon }) => (
                <div key={label.join('-')} className="mfg-clients-stat">
                  <span className="mfg-clients-stat-icon" aria-hidden="true">
                    <img src={icon} alt="" />
                  </span>
                  <strong className="mfg-clients-stat-value">{value}</strong>
                  <span className="mfg-clients-stat-label">
                    {label.map((line) => <span key={line}>{line}</span>)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <ManufacturingClientsMap
            activeRegionId={activeRegion.id}
            onRegionSelect={setActiveRegionId}
          />
        </FadeIn>

        <FadeIn id="mfg-clients-panel" className="mfg-clients-panel" delay={40} variant="slide-in-bottom">
          <div className="mfg-clients-panel-top">
            <div className="mfg-clients-region-copy">
              <span className="mfg-clients-eyebrow">Our partners in</span>
              <h3>{activeRegion.title}</h3>
              <p>{activeRegion.description}</p>
            </div>

            <div className="mfg-clients-tabs" role="tablist" aria-label="Client markets">
              {regions.filter((region) => region.id !== 'international').map((region, index) => {
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
                    onClick={() => selectRegion(region.id, index)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                  >
                    {region.title}
                  </button>
                )
              })}
            </div>

            {activeRegion.logos.length > 0 && (
              <div className="mfg-clients-region-count" aria-hidden="true">
                <strong>{activeRegion.logos.length}+</strong>
                <span>{activeRegion.partnerLabel}</span>
              </div>
            )}
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
