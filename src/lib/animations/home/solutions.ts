import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, isMobileViewport, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function initSolutionsExpertiseAnimations(scope: ParentNode): AnimationCleanup {
  const section = scope.querySelector<HTMLElement>('.solutions-expertise-section')
  if (!section) return () => {}

  const accordion = section.querySelector<HTMLElement>('.solutions-expertise-acc')
  const panels = section.querySelectorAll<HTMLElement>('[data-home-animate="solutions-panel"]')
  if (!accordion || !panels.length) return () => {}

  const reduced = prefersReducedMotion()
  const triggers: ScrollTrigger[] = []
  const tweens: gsap.core.Tween[] = []

  if (reduced) {
    gsap.set(panels, { clearProps: 'all' })
    return () => {}
  }

  gsap.set(panels, { opacity: 0, y: 56, scale: 0.96 })

  const entranceTween = gsap.to(panels, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.14,
    scrollTrigger: {
      trigger: accordion,
      start: 'top 86%',
      toggleActions: 'restart reset restart reset',
    },
  })

  if (entranceTween.scrollTrigger) triggers.push(entranceTween.scrollTrigger)
  tweens.push(entranceTween)

  if (!isMobileViewport()) {
    panels.forEach((panel) => {
      const image = panel.querySelector<HTMLElement>('img')
      if (!image) return

      const parallaxTween = gsap.fromTo(
        image,
        { y: '-4%' },
        {
          y: '4%',
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      )

      if (parallaxTween.scrollTrigger) triggers.push(parallaxTween.scrollTrigger)
      tweens.push(parallaxTween)
    })
  }

  return () => {
    triggers.forEach((trigger) => trigger.kill())
    tweens.forEach((tween) => tween.kill())
  }
}

export function resetSolutionsPanelChrome(panel: HTMLElement) {
  const chip = panel.querySelector<HTMLElement>('.solutions-expertise-chip')
  const chipInner = panel.querySelector<HTMLElement>('.solutions-expertise-chip-inner')

  gsap.killTweensOf([chip, chipInner].filter(Boolean))

  if (chip) {
    gsap.set(chip, { clearProps: 'all' })
  }

  if (chipInner) {
    gsap.set(chipInner, { clearProps: 'all' })
  }
}

export function animateSolutionsAccordionPanel(panel: HTMLElement | null) {
  if (!panel || prefersReducedMotion()) return

  const image = panel.querySelector<HTMLElement>('img')
  const chip = panel.querySelector<HTMLElement>('.solutions-expertise-chip')
  const chipInner = panel.querySelector<HTMLElement>('.solutions-expertise-chip-inner')
  const content = panel.querySelector<HTMLElement>('.solutions-expertise-panel-content')
  const tag = content?.querySelector<HTMLElement>('.solutions-expertise-tag')
  const title = content?.querySelector<HTMLElement>('h3')
  const description = content?.querySelector<HTMLElement>('p')
  const features = content?.querySelectorAll<HTMLElement>('li')

  const contentItems = [tag, title, description, ...(features ? Array.from(features) : [])].filter(
    Boolean,
  ) as HTMLElement[]

  gsap.killTweensOf([image, chip, chipInner, content, ...contentItems])

  if (image) {
    gsap.fromTo(
      image,
      { scale: 1.1 },
      { scale: 1, duration: 1.15, ease: 'power3.out' },
    )
  }

  if (chipInner) {
    gsap.fromTo(
      chipInner,
      { scale: 0.65 },
      { scale: 1, duration: 0.55, ease: 'back.out(2.4)' },
    )
  }

  if (chip) {
    gsap.fromTo(chip, { opacity: 0.4 }, { opacity: 1, duration: 0.55, ease: 'power2.out' })
  }

  if (!contentItems.length) return

  gsap.set(contentItems, { opacity: 0, y: 22 })
  gsap.to(contentItems, {
    opacity: 1,
    y: 0,
    duration: 0.62,
    ease: 'power3.out',
    stagger: 0.08,
    delay: 0.12,
  })
}
