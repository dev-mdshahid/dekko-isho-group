import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import {
  solutionsExpertiseDecorImages,
  solutionsExpertiseTabs,
} from '../../data/solutions/solutionsExpertise'
import { animateSolutionsTabPanel } from '../../lib/animations/home/solutions'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

type TabIndicator = {
  top: number
  left: number
  width: number
  height: number
  horizontal: boolean
}

const INITIAL_INDICATOR: TabIndicator = {
  top: 0,
  left: 0,
  width: 3,
  height: 0,
  horizontal: false,
}

function useSolutionsTabIndicator(activeTabId: string) {
  const menuRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [indicator, setIndicator] = useState<TabIndicator>(INITIAL_INDICATOR)

  const updateIndicator = useCallback(() => {
    const menu = menuRef.current
    const tab = tabRefs.current[activeTabId]
    if (!menu || !tab) return

    const menuRect = menu.getBoundingClientRect()
    const tabRect = tab.getBoundingClientRect()
    const horizontal = window.matchMedia('(max-width: 991px)').matches

    if (horizontal) {
      setIndicator({
        horizontal: true,
        top: tabRect.top - menuRect.top + tabRect.height - 3,
        left: tabRect.left - menuRect.left,
        width: tabRect.width,
        height: 3,
      })
      return
    }

    setIndicator({
      horizontal: false,
      top: tabRect.top - menuRect.top,
      left: 0,
      width: 3,
      height: tabRect.height,
    })
  }, [activeTabId])

  useLayoutEffect(() => {
    updateIndicator()
  }, [updateIndicator])

  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return

    const resizeObserver = new ResizeObserver(updateIndicator)
    resizeObserver.observe(menu)

    window.addEventListener('resize', updateIndicator)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateIndicator)
    }
  }, [updateIndicator])

  const setTabRef = useCallback((id: string, node: HTMLButtonElement | null) => {
    tabRefs.current[id] = node
  }, [])

  return { menuRef, setTabRef, indicator }
}

export function SolutionsExpertiseSection() {
  const [activeTabId, setActiveTabId] = useState(solutionsExpertiseTabs[0].id)
  const panelRef = useRef<HTMLDivElement>(null)
  const { menuRef, setTabRef, indicator } = useSolutionsTabIndicator(activeTabId)
  const activeTab =
    solutionsExpertiseTabs.find((tab) => tab.id === activeTabId) ?? solutionsExpertiseTabs[0]

  useEffect(() => {
    animateSolutionsTabPanel(panelRef.current)
  }, [activeTabId])

  return (
    <section className="solutions-expertise-section section-spacing-top section-spacing-bottom">
      {solutionsExpertiseDecorImages.map((image) => (
        <img
          key={image.className}
          src={image.src}
          loading="lazy"
          alt={image.alt}
          className={`solutions-expertise-decor ${image.className}`}
          data-home-animate="solutions-decor"
        />
      ))}

      <div className="container-full">
        <div className="solutions-expertise-content">
          <div className="solutions-expertise-header">
            <FadeIn id="solutions-expertise-pill" className="solutions-expertise-pill-wrap">
              <PreSectionTitle title="Transforming ideas into world-class solutions" />
            </FadeIn>
            <FadeIn id="solutions-expertise-title" className="solutions-expertise-title-wrap">
              <h2 className="section-title solutions-expertise-title title-center">
                Comprehensive <span className="hero-title-accent--red">Solutions</span>
                <br />
                Powered by Expertise
              </h2>
            </FadeIn>
          </div>

          <FadeIn id="solutions-expertise-body" delay={120} className="solutions-expertise-body">
            <div className="solutions-expertise-panel">
              <div
                ref={menuRef}
                className="solutions-expertise-menu"
                role="tablist"
                aria-label="Solutions"
                data-home-animate="solutions-tabs"
              >
                <span
                  className="solutions-expertise-tab-indicator"
                  aria-hidden="true"
                  style={{
                    top: indicator.top,
                    left: indicator.left,
                    width: indicator.width,
                    height: indicator.height,
                  }}
                />
                {solutionsExpertiseTabs.map((tab) => {
                  const isActive = tab.id === activeTabId

                  return (
                    <button
                      key={tab.id}
                      ref={(node) => setTabRef(tab.id, node)}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`solutions-expertise-tab${isActive ? ' is-active' : ''}`}
                      onClick={() => setActiveTabId(tab.id)}
                    >
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              <div
                className="solutions-expertise-card"
                role="tabpanel"
                aria-labelledby={activeTab.id}
              >
                <div
                  key={activeTabId}
                  ref={panelRef}
                  className="solutions-expertise-card-inner"
                  data-home-animate="solutions-panel"
                >
                  <div className="solutions-expertise-card-image-wrap">
                    <img
                      src={activeTab.image}
                      loading="lazy"
                      alt={activeTab.imageAlt}
                      className="solutions-expertise-card-image"
                    />
                  </div>
                  <div className="solutions-expertise-card-content">
                    <h3 className="solutions-expertise-card-title">{activeTab.title}</h3>
                    <p className="solutions-expertise-card-description">{activeTab.description}</p>
                    <ul className="solutions-expertise-feature-list">
                      {activeTab.features.map((feature) => (
                        <li key={feature} className="solutions-expertise-feature-item">
                          <img
                            src="/images/list-icon-primary.svg"
                            loading="lazy"
                            alt=""
                            className="solutions-expertise-feature-icon"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
      <SectionLines />
      <NoiseOverlay />
    </section>
  )
}
