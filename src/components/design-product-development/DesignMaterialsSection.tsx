import { designProductDevelopmentMaterials } from '../../data/design-product-development/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export type DesignMaterialsItem = {
  id: string
  image: string
  imageAlt: string
  title: string
  description: string
}

export type DesignMaterialsContent = {
  id: string
  badge: string
  title: string
  description?: string
  items: DesignMaterialsItem[]
}

type DesignMaterialsSectionProps = {
  content?: DesignMaterialsContent
  className?: string
  idPrefix?: string
}

export function DesignMaterialsSection({
  content = designProductDevelopmentMaterials,
  className,
  idPrefix = 'dpd',
}: DesignMaterialsSectionProps) {
  const { id, badge, title, description, items } = content
  const sectionClassName = ['dpd-materials-section', className].filter(Boolean).join(' ')

  return (
    <section id={id} className={sectionClassName}>
      <div className="dpd-materials-container">
        <FadeIn
          id={`${idPrefix}-materials-header`}
          className="dpd-materials-header"
          variant="slide-in-bottom"
        >
          <PreSectionTitle title={badge} />
          <h2 className="dpd-materials-title">{title}</h2>
          {description ? <p className="dpd-materials-description">{description}</p> : null}
        </FadeIn>

        <div className="dpd-materials-grid" data-solution-animate-group>
          {items.map((item) => (
            <div
              key={item.id}
              id={`${idPrefix}-materials-${item.id}`}
              className="dpd-materials-card"
              data-solution-animate="tilt-card"
            >
              <div className="dpd-materials-card-media">
                <img
                  src={item.image}
                  loading="lazy"
                  alt={item.imageAlt}
                  width={494}
                  height={320}
                  className="dpd-materials-card-image"
                />
              </div>
              <div className="dpd-materials-card-body">
                <h3 className="dpd-materials-card-title">{item.title}</h3>
                <p className="dpd-materials-card-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
