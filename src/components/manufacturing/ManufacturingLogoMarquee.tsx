import { useEffect, useRef } from 'react'
import type { ManufacturingClientLogo, ManufacturingClientRegionId } from '../../data/manufacturing/content'

export interface ManufacturingLogoMarqueeProps {
  logos: ManufacturingClientLogo[]
  regionId: ManufacturingClientRegionId
  regionLabel: string
}

const COPY_COUNT = 3
const AUTO_SCROLL_SPEED = 34

export function ManufacturingLogoMarquee({ logos, regionId }: ManufacturingLogoMarqueeProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const isPausedRef = useRef(false)
  const visibleLogos = Array.from(
    { length: Math.max(logos.length, 8) },
    (_, index) => ({ ...logos[index % logos.length], originalIndex: index % logos.length }),
  )

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    let animationFrame = 0
    let previousTime = performance.now()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const resetPosition = () => { viewport.scrollLeft = viewport.scrollWidth / COPY_COUNT }
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
  }, [logos, regionId])

  return (
    <div
      className="mfg-client-marquee"
      onMouseEnter={() => { isPausedRef.current = true }}
      onMouseLeave={() => { isPausedRef.current = false }}
      onFocusCapture={() => { isPausedRef.current = true }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) isPausedRef.current = false
      }}
    >
      <div ref={viewportRef} className="mfg-client-marquee-viewport">
        <div className="mfg-client-marquee-track">
          {Array.from({ length: COPY_COUNT }, (_, copyIndex) => (
            <div key={`${regionId}-${copyIndex}`} className="mfg-client-marquee-list" aria-hidden={copyIndex === 0 ? undefined : true}>
              {visibleLogos.map((logo, index) => (
                <div key={`${copyIndex}-${index}-${logo.alt}`} className="mfg-client-marquee-item">
                  <img src={logo.src} alt={copyIndex === 0 && logo.originalIndex === index ? logo.alt : ''} className="mfg-client-marquee-image" loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
