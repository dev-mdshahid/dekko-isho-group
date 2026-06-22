import { industrialLaundryWashing } from '../../data/industrial-laundry/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function IndustrialLaundryWashingSection() {
  const { badge, title, description, rows } = industrialLaundryWashing

  return (
    <section className="service-category-section il-washing-section">
      <div className="il-washing-container">
        <div className="il-washing-layout">
          <FadeIn id="il-washing-intro" className="il-washing-intro">
            <PreSectionTitle title={badge} variant="bg-dark" />
            <h2 className="il-washing-title">{title}</h2>
            <p className="il-washing-description">{description}</p>
          </FadeIn>

          <div className="il-washing-table">
            {rows.map((row, index) => (
              <FadeIn
                key={row.id}
                id={`il-washing-${row.id}`}
                className={`il-washing-row${index === rows.length - 1 ? ' last' : ''}`}
                delay={index * 60}
              >
                <h3 className="il-washing-row-title">{row.title}</h3>
                <ol className="il-washing-row-list">
                  {row.items.map((item) => (
                    <li key={item} className="il-washing-row-item">
                      {item}
                    </li>
                  ))}
                </ol>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
