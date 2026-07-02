import { useCallback, useEffect, useRef, useState } from 'react'

import { solutionsExpertiseTabs } from '../../data/solutions/solutionsExpertise'
import {
  animateSolutionsAccordionPanel,
  resetSolutionsPanelChrome,
} from '../../lib/animations/home/solutions'
import { FadeIn } from '../ui/FadeIn'

export function SolutionsExpertiseSection() {
  const [activeTabId, setActiveTabId] = useState(solutionsExpertiseTabs[0].id)
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const activatePanel = useCallback((id: string) => {
    setActiveTabId(id)
  }, [])

  const handleMouseEnter = useCallback(
    (id: string) => {
      if (window.matchMedia('(min-width: 861px)').matches) {
        activatePanel(id)
      }
    },
    [activatePanel],
  )

  useEffect(() => {
    Object.entries(panelRefs.current).forEach(([id, panel]) => {
      if (panel && id !== activeTabId) {
        resetSolutionsPanelChrome(panel)
      }
    })

    const panel = panelRefs.current[activeTabId]
    if (!panel) return

    const frame = requestAnimationFrame(() => {
      animateSolutionsAccordionPanel(panel)
    })

    return () => cancelAnimationFrame(frame)
  }, [activeTabId])

  return (
    <section className="solutions-expertise-section">
      <div className="solutions-expertise-head">
        <FadeIn id="solutions-expertise-pill" variant="slide-in-bottom">
          <span className="solutions-expertise-pill">
            <span className="solutions-expertise-pill-sq" aria-hidden="true" />
            Transforming ideas into world-class solutions
          </span>
        </FadeIn>
        <FadeIn id="solutions-expertise-title" variant="slide-in-bottom" delay={120}>
          <h2 className="solutions-expertise-title">
            Comprehensive <span className="solutions-expertise-accent">Solutions</span>
            <br />
            Powered by Expertise
          </h2>
        </FadeIn>
      </div>

      <div className="solutions-expertise-acc" role="tablist" aria-label="Solutions">
        {solutionsExpertiseTabs.map((tab, index) => {
          const isActive = tab.id === activeTabId
          const num = String(index + 1).padStart(2, '0')

          return (
            <div
              key={tab.id}
              ref={(node) => {
                panelRefs.current[tab.id] = node
              }}
              className={`solutions-expertise-panel${isActive ? ' active' : ''}`}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              data-home-animate="solutions-panel"
              data-solutions-index={index}
              onClick={() => activatePanel(tab.id)}
              onMouseEnter={() => handleMouseEnter(tab.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  activatePanel(tab.id)
                }
              }}
            >
              <img src={tab.image} loading="lazy" alt={tab.imageAlt} />
              <div className="solutions-expertise-chip" aria-hidden="true">
                <span className="solutions-expertise-chip-inner">{num}</span>
              </div>
              <div className="solutions-expertise-v-label-wrap" aria-hidden={isActive}>
                <div className="solutions-expertise-v-label">{tab.label}</div>
              </div>
              <div className="solutions-expertise-panel-content">
                <span className="solutions-expertise-tag">{tab.tag}</span>
                <h3>{tab.title}</h3>
                <p>{tab.description}</p>
                <ul>
                  {tab.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
