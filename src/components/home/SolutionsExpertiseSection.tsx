import { useState } from 'react'

import {
  solutionsExpertiseDecorImages,
  solutionsExpertiseTabs,
} from '../../data/solutions/solutionsExpertise'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function SolutionsExpertiseSection() {
  const [activeTabId, setActiveTabId] = useState(solutionsExpertiseTabs[0].id)
  const activeTab =
    solutionsExpertiseTabs.find((tab) => tab.id === activeTabId) ?? solutionsExpertiseTabs[0]

  return (
    <section className="solutions-expertise-section section-spacing-top section-spacing-bottom">
      {solutionsExpertiseDecorImages.map((image) => (
        <img
          key={image.className}
          src={image.src}
          loading="lazy"
          alt={image.alt}
          className={`solutions-expertise-decor ${image.className}`}
          data-fade-in
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
                <br />Powered by Expertise
              </h2>
            </FadeIn>
          </div>

          <div className="solutions-expertise-body">
            <div className="solutions-expertise-panel">
            <div className="solutions-expertise-menu" role="tablist" aria-label="Solutions">
              {solutionsExpertiseTabs.map((tab) => {
                const isActive = tab.id === activeTabId

                return (
                  <button
                    key={tab.id}
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
              <div className="solutions-expertise-card-inner">
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
          </div>
        </div>
      </div>
      <SectionLines />
      <NoiseOverlay />
    </section>
  )
}
