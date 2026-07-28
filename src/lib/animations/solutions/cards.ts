import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, isMobileViewport, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const MAX_TILT = 6

const MEDIA_SELECTORS = [
  'img',
  '[data-solution-animate-media]',
  '.solution-capability-cards-card-image',
  '.solution-network-card-image',
  '.solution-advanced-finishing-card-image',
  '.solution-sustainable-tech-card-image',
  '.mfg-operation-card-image',
  '.mfg-product-range-card-image',
  '.dpd-capabilities-card-image',
  '.dpd-materials-card-image',
].join(', ')

/**
 * Staggered opacity/y/scale entrance for `[data-solution-animate="card"]` groups,
 * plus desktop 3D tilt for `[data-solution-animate="tilt-card"]`.
 * CTA cards use `[data-solution-animate="cta-card"]` with a contact-style scale entrance.
 */
export function initSolutionCardAnimations(scope: ParentNode): AnimationCleanup {
  const reduced = prefersReducedMotion()
  const cleanups: (() => void)[] = []

  if (reduced) {
    scope.querySelectorAll<HTMLElement>(
      '[data-solution-animate="card"], [data-solution-animate="tilt-card"], [data-solution-animate="cta-card"]',
    ).forEach((el) => {
      gsap.set(el, { clearProps: 'all' })
    })
    return () => {}
  }

  // Group cards by nearest track/grid container so each section staggers independently.
  // tilt-card also receives the same entrance (tilt is layered on top on desktop).
  const cardEls = scope.querySelectorAll<HTMLElement>(
    '[data-solution-animate="card"], [data-solution-animate="tilt-card"]',
  )
  const groups = new Map<Element, HTMLElement[]>()

  cardEls.forEach((card) => {
    const group =
      card.closest('[data-solution-animate-group]') ??
      card.closest('.solution-capability-cards-track') ??
      card.closest('.solution-network-track') ??
      card.closest('.solution-advanced-finishing-grid') ??
      card.closest('.solution-sustainable-tech-grid') ??
      card.closest('.mfg-operation-cards') ??
      card.closest('.mfg-product-range-grid') ??
      card.closest('.mfg-clients-regions') ??
      card.closest('.dpd-capabilities-grid') ??
      card.closest('.dpd-materials-grid') ??
      card.closest('.dpd-global-network-grid') ??
      card.closest('.ti-unified-grid') ??
      card.closest('.ti-partners-grid') ??
      card.closest('.ti-feature-grid') ??
      card.closest('.ti-growth-table') ??
      card.closest('.cs-feature-grid') ??
      card.closest('.cs-risk-grid') ??
      card.closest('.cs-quality-pillars') ??
      card.closest('.cs-improvement-list') ??
      card.closest('.cs-reporting-table') ??
      card.parentElement

    if (!group) return
    const list = groups.get(group) ?? []
    list.push(card)
    groups.set(group, list)
  })

  groups.forEach((cards, group) => {
    gsap.set(cards, { opacity: 0, y: 48, scale: 0.96 })

    const tween = gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: group,
        start: 'top 86%',
        toggleActions: 'restart reset restart reset',
      },
    })

    cleanups.push(() => {
      tween.scrollTrigger?.kill()
      tween.kill()
    })
  })

  // CTA card — contact-style scale/opacity entrance
  scope.querySelectorAll<HTMLElement>('[data-solution-animate="cta-card"]').forEach((card) => {
    const tween = gsap.fromTo(
      card,
      { opacity: 0, y: 72, scale: 0.94 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'restart none none reset',
        },
      },
    )

    cleanups.push(() => {
      tween.scrollTrigger?.kill()
      tween.kill()
    })
  })

  // Desktop 3D tilt on image cards
  if (!isMobileViewport()) {
    scope.querySelectorAll<HTMLElement>('[data-solution-animate="tilt-card"]').forEach((card) => {
      const media = card.querySelector<HTMLElement>(MEDIA_SELECTORS)

      const onMove = (event: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5

        gsap.to(card, {
          rotateY: x * MAX_TILT * 2,
          rotateX: -y * MAX_TILT * 2,
          transformPerspective: 800,
          duration: 0.35,
          ease: 'power2.out',
        })

        if (media) {
          gsap.to(media, { scale: 1.05, duration: 0.35, ease: 'power2.out' })
        }
      }

      const onLeave = () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.5,
          ease: 'power2.out',
        })
        if (media) {
          gsap.to(media, { scale: 1, duration: 0.5, ease: 'power2.out' })
        }
      }

      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)

      cleanups.push(() => {
        card.removeEventListener('mousemove', onMove)
        card.removeEventListener('mouseleave', onLeave)
        gsap.killTweensOf([card, media].filter(Boolean))
      })
    })
  }

  return () => {
    cleanups.forEach((fn) => fn())
  }
}
