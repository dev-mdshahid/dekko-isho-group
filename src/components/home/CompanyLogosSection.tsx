import { useEffect, useRef } from 'react'
import { companyLogos } from '../../data/home/companyLogos'

const COPY_COUNT = 3
const AUTO_SCROLL_SPEED = 34

function CompanyLogosList({ listId }: { listId: string }) {
  const isPrimaryList = listId === '0'

  return (
    <div className="company-logos-list" aria-hidden={isPrimaryList ? undefined : true}>
      {companyLogos.map((logo) => (
        <div key={`${listId}-${logo.alt}`} className="company-logos-item">
          <div className="company-logos-image-wrap">
            <img
              src={logo.src}
              loading="lazy"
              decoding="async"
              alt={isPrimaryList ? logo.alt : ''}
              className="company-logos-image"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export function CompanyLogosSection() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const isPausedRef = useRef(false)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    let animationFrame = 0
    let previousTime = performance.now()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const resetPosition = () => {
      viewport.scrollLeft = viewport.scrollWidth / COPY_COUNT
    }
    const maintainLoop = () => {
      const groupWidth = viewport.scrollWidth / COPY_COUNT
      if (!groupWidth) return
      if (viewport.scrollLeft >= groupWidth * 2) viewport.scrollLeft -= groupWidth
      if (viewport.scrollLeft < groupWidth * 0.5) viewport.scrollLeft += groupWidth
    }
    const animate = (time: number) => {
      const elapsed = Math.min(time - previousTime, 50)
      previousTime = time
      if (!isPausedRef.current && !reducedMotion.matches) {
        viewport.scrollLeft += (AUTO_SCROLL_SPEED * elapsed) / 1000
        maintainLoop()
      }
      animationFrame = requestAnimationFrame(animate)
    }

    requestAnimationFrame(resetPosition)
    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [])

  return (
    <div
      className="company-logos-section"
      aria-label="Partner brands"
      onMouseEnter={() => { isPausedRef.current = true }}
      onMouseLeave={() => { isPausedRef.current = false }}
      onFocusCapture={() => { isPausedRef.current = true }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) isPausedRef.current = false
      }}
    >
      <div ref={viewportRef} className="company-logos-marquee" tabIndex={0}>
        <div className="company-logos-track">
          {Array.from({ length: COPY_COUNT }, (_, copyIndex) => (
            <CompanyLogosList key={copyIndex} listId={String(copyIndex)} />
          ))}
        </div>
      </div>
    </div>
  )
}
