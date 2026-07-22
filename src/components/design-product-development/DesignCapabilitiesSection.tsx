import {
  BarChart3,
  Box,
  Folder,
  Layers,
  type LucideIcon,
  Pencil,
  Ruler,
  ScrollText,
  Search,
  Shirt,
} from 'lucide-react'

import {
  type DesignCapabilityIcon,
  designProductDevelopmentCapabilities,
} from '../../data/design-product-development/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

const capabilityIcons: Record<DesignCapabilityIcon, LucideIcon> = {
  search: Search,
  pencil: Pencil,
  shirt: Shirt,
  layers: Layers,
  chart: BarChart3,
  scroll: ScrollText,
  ruler: Ruler,
  folder: Folder,
  box: Box,
}

export function DesignCapabilitiesSection() {
  const { id, badge, title, description, items } = designProductDevelopmentCapabilities

  return (
    <section id={id} className="dpd-capabilities-section">
      <div className="dpd-capabilities-container">
        <FadeIn id="dpd-capabilities-header" className="dpd-capabilities-header">
          <PreSectionTitle title={badge} />
          <h2 className="dpd-capabilities-title">{title}</h2>
          <p className="dpd-capabilities-description">{description}</p>
        </FadeIn>

        <div className="dpd-capabilities-grid">
          {items.map((item, index) => {
            const Icon = capabilityIcons[item.icon]

            return (
              <FadeIn
                key={item.id}
                id={`dpd-capability-${item.id}`}
                className="dpd-capabilities-card"
                delay={index * 40}
              >
                <div className="dpd-capabilities-card-media">
                  <img
                    src={item.image}
                    loading="lazy"
                    alt={item.imageAlt}
                    className="dpd-capabilities-card-image"
                  />
                  <span
                    className={`dpd-capabilities-card-icon dpd-capabilities-card-icon--${item.iconTone}`}
                    aria-hidden="true"
                  >
                    <Icon className="dpd-capabilities-card-icon-svg" />
                  </span>
                </div>
                <div className="dpd-capabilities-card-body">
                  <h3 className="dpd-capabilities-card-title">{item.title}</h3>
                  <p className="dpd-capabilities-card-description">{item.description}</p>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
