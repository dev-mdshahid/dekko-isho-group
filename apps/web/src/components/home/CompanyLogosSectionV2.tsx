import type { CSSProperties, Key } from 'react'
import LogoLoop, { type LogoImageItem, type LogoItem } from '../ui/LogoLoop'

const logos: LogoImageItem[] = [
  { src: '/images/dekko-clients/v5/jack_and_jones.png', alt: 'Jack & Jones', width: 163 },
  { src: '/images/dekko-clients/v5/selected.png', alt: 'Selected', width: 124 },
  { src: '/images/dekko-clients/v5/kiabi.png', alt: 'Kiabi', width: 117 },
  { src: '/images/dekko-clients/v5/zara.png', alt: 'Zara', width: 82 },
  { src: '/images/dekko-clients/v5/tommy_hilfiger.png', alt: 'Tommy Hilfiger', width: 240 },
  { src: '/images/dekko-clients/v5/varner.png', alt: 'Varner', width: 143 },
  { src: '/images/dekko-clients/v5/celio.png', alt: 'Celio', width: 118 },
  { src: '/images/dekko-clients/v5/lindex.png', alt: 'Lindex', width: 100 },
  { src: '/images/dekko-clients/v5/tom_tailor.png', alt: 'Tom Tailor', width: 179 },
  { src: '/images/dekko-clients/v5/carhartt.png', alt: 'Carhartt', width: 140 },
  { src: '/images/dekko-clients/v5/lpp.png', alt: 'LPP', width: 63 },
  { src: '/images/dekko-clients/v5/camel_active.png', alt: 'Camel Active', width: 120 },
  { src: '/images/dekko-clients/v5/voice.png', alt: 'Voice', width: 100 },
  { src: '/images/dekko-clients/v5/spring_field.png', alt: 'Spring Field', width: 162 },
  { src: '/images/dekko-clients/v5/ralph_lauren.png', alt: 'Ralph Lauren', width: 203 },
  { src: '/images/dekko-clients/v5/kohls.png', alt: "Kohl's", width: 126 },
  { src: '/images/dekko-clients/v5/levis.png', alt: "Levi's", width: 78 },
  { src: '/images/dekko-clients/v5/marks.png', alt: "Mark's", width: 124 },
  { src: '/images/dekko-clients/v5/sport_chek.png', alt: 'Sport Chek', width: 101 },
  { src: '/images/dekko-clients/v5/j_crew.png', alt: 'J. Crew', width: 104 },
  { src: '/images/dekko-clients/v5/helly_hansen.png', alt: 'Helly Hansen', width: 63 },
  { src: '/images/dekko-clients/v5/musto.png', alt: 'Musto', width: 108 },
  { src: '/images/dekko-clients/v5/target.png', alt: 'Target', width: 54 },
]

const renderLogoItem = (item: LogoItem, _key: Key) => {
  if (!('src' in item) || item.width == null) return null

  return (
    <span
      className="company-logos-section-v2__item"
      style={{ '--logo-width': `${item.width}px` } as CSSProperties}
    >
      <img src={item.src} alt={item.alt ?? ''} draggable={false} />
    </span>
  )
}

const CompanyLogosSectionV2 = () => {
  return (
    <section className="company-logos-section-v2" aria-label="Our clients">
      <div
        className="company-logos-section-v2__viewport"
        tabIndex={0}
        role="region"
        aria-label="Client logos. Drag left or right to browse. Hover or use keyboard focus to pause scrolling."
      >
        <LogoLoop
          logos={logos}
          speed={50}
          direction="left"
          gap={128}
          hoverSpeed={0}
          draggable
          ariaLabel="Our clients"
          className="company-logos-section-v2__loop"
          renderItem={renderLogoItem}
        />
      </div>
    </section>
  )
}

export default CompanyLogosSectionV2
