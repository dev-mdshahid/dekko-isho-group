import { designProductDevelopmentGlobalNetwork } from '../../data/design-product-development/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export type DesignGlobalNetworkItem = {
  id: string
  number: string
  accent: string
  title: string
  description: string
}

export type DesignGlobalNetworkContent = {
  id: string
  badge?: string
  title: string
  description: string
  image: string
  imageAlt: string
  items: DesignGlobalNetworkItem[]
}

type DesignGlobalNetworkSectionProps = {
  content?: DesignGlobalNetworkContent
  className?: string
  idPrefix?: string
}

export function DesignGlobalNetworkSection({
  content = designProductDevelopmentGlobalNetwork,
  className,
  idPrefix = 'dpd',
}: DesignGlobalNetworkSectionProps) {
  const { id, badge, title, description, image, imageAlt, items } = content
  const sectionClassName = ['dpd-global-network-section', className].filter(Boolean).join(' ')

  return (
    <section id={id} className={sectionClassName}>
      <div className="dpd-global-network-container">
        <FadeIn id={`${idPrefix}-global-network-header`} className="dpd-global-network-header">
          {badge ? <PreSectionTitle title={badge} /> : null}
          <h2 className="dpd-global-network-title">{title}</h2>
          <p className="dpd-global-network-description">{description}</p>
        </FadeIn>

        <FadeIn id={`${idPrefix}-global-network-media`} className="dpd-global-network-media" delay={40}>
          <img src={image} loading="lazy" alt={imageAlt} className="dpd-global-network-image" />
        </FadeIn>

        <div className="dpd-global-network-grid">
          {items.map((item, index) => (
            <FadeIn
              key={item.id}
              id={`${idPrefix}-global-network-${item.id}`}
              className="dpd-global-network-card"
              delay={index * 50}
            >
              <span
                className="dpd-global-network-card-accent"
                style={{ backgroundColor: item.accent }}
                aria-hidden="true"
              />
              <span className="dpd-global-network-card-number" style={{ color: item.accent }}>
                {item.number}
              </span>
              <h3 className="dpd-global-network-card-title">{item.title}</h3>
              <p className="dpd-global-network-card-description">{item.description}</p>
            </FadeIn>
          ))}
        </div>
      </div>
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
