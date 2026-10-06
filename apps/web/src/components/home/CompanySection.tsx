import { useEffect, useRef } from 'react'

import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

export function CompanySection() {
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current

    if (!section) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    let rafId: number | null = null
    let targetX = 0
    let currentX = 0
    let isHovering = false

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

    const resetParallax = () => {
      section.style.setProperty('--company-bg-x', '0px')
      section.style.setProperty('--company-awards-x', '0px')
    }

    const applyParallax = (normalizedX: number) => {
      if (prefersReducedMotion.matches || window.innerWidth < 768) {
        resetParallax()
        return
      }

      // Opposite directions create depth between background and cluster.
      const bgX = clamp(normalizedX * -36, -36, 36)
      const awardsX = clamp(normalizedX * 22, -22, 22)

      section.style.setProperty('--company-bg-x', `${bgX}px`)
      section.style.setProperty('--company-awards-x', `${awardsX}px`)
    }

    const tick = () => {
      rafId = null

      // Ease toward the cursor so the motion feels soft, not snappy.
      currentX += (targetX - currentX) * 0.12

      if (Math.abs(targetX - currentX) < 0.001) {
        currentX = targetX
      }

      applyParallax(currentX)

      if (isHovering || Math.abs(targetX - currentX) >= 0.001) {
        rafId = window.requestAnimationFrame(tick)
      }
    }

    const requestTick = () => {
      if (rafId !== null) return
      rafId = window.requestAnimationFrame(tick)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (prefersReducedMotion.matches || window.innerWidth < 768) {
        targetX = 0
        currentX = 0
        resetParallax()
        return
      }

      const rect = section.getBoundingClientRect()
      if (rect.width <= 0) return

      // -1 at left edge, 0 at center, 1 at right edge.
      const normalizedX = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1)

      isHovering = true
      targetX = normalizedX
      requestTick()
    }

    const onPointerLeave = () => {
      isHovering = false
      targetX = 0
      requestTick()
    }

    const onResize = () => {
      if (prefersReducedMotion.matches || window.innerWidth < 768) {
        isHovering = false
        targetX = 0
        currentX = 0
        resetParallax()
      }
    }

    section.addEventListener('pointermove', onPointerMove)
    section.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('resize', onResize)
    prefersReducedMotion.addEventListener?.('change', onResize)

    return () => {
      section.removeEventListener('pointermove', onPointerMove)
      section.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('resize', onResize)
      prefersReducedMotion.removeEventListener?.('change', onResize)

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="company-section"
    >
      {/* Background parallax image */}
      <div
        className="company-section-background"
        aria-hidden="true"
      >
        <img
          className="company-section-background-image"
          src="/images/awards/awards-cluster-background.png"
          alt=""
          decoding="async"
        />
      </div>

      {/* Background readability / lighting */}
      <div
        className="company-section-atmosphere"
        aria-hidden="true"
      />

      <div className="company-section-inner">
        {/* Content — static; no parallax */}
        <FadeIn
          id="company-section-content"
          variant="slide-in-bottom"
          className="company-section-content"
        >
          <h2 className="company-section-title section-title">
            <span className="company-section-title-line">
              The Relentless{' '}
              <span className="company-section-accent company-section-accent--pursuit">
                Pursuit
              </span>
            </span>

            <span className="company-section-title-line">
              of Making a{' '}
              <span className="company-section-accent company-section-accent--difference">
                Difference
              </span>
            </span>
          </h2>

          <p className="company-section-description">
            Driven by purpose and powered by
            progress, we continue to raise the
            bar in creating value for people,
            partners, and the planet.
          </p>

          <div className="company-section-button">
            <ButtonArrow
              to="/awards"
              label="Explore Achievements"
              variant="button-white-bg"
            />
          </div>
        </FadeIn>

        {/* Right-side awards */}
        <div
          className="company-section-awards"
          aria-hidden="true"
        >
          <div className="company-section-awards-parallax">
            <img
              className="company-section-awards-image"
              src="/images/awards/awards-cluster-transparent.png"
              alt=""
              decoding="async"
            />
          </div>
        </div>
      </div>

      {/* Foreground atmosphere */}
      <div
        className="company-section-depth company-section-depth--left"
        aria-hidden="true"
      />

      <div
        className="company-section-depth company-section-depth--right"
        aria-hidden="true"
      />
    </section>
  )
}
