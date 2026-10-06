import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const IMAGE_SCALE_FROM = 2
const IMAGE_SCALE_TO = 1

/** Per-card shrink — targetScale = 1 - (length - i) * SCALE_STEP */
const SCALE_STEP = 0.05

/** Progress window start per index — range [i * 0.25, 1]. */
const RANGE_STEP = 0.25

/**
 * The painted card unit (tint + content). Sticky `.service-list-wrapper` must
 * never receive a transform — that breaks sticky stacking and makes the whole
 * stack appear to scale together.
 */
function getCardPanel(card: HTMLElement): HTMLElement {
  return card.querySelector<HTMLElement>('.service-card-panel') ?? card
}

function getCardImage(card: HTMLElement): HTMLElement | null {
  return card.querySelector<HTMLElement>('.service-image')
}

function clearCardScales(cards: NodeListOf<HTMLElement> | HTMLElement[]) {
  cards.forEach((card) => {
    gsap.set(card, { clearProps: 'transform,scale' })
    gsap.set(getCardPanel(card), { clearProps: 'opacity,transform,scale' })
    const image = getCardImage(card)
    if (image) gsap.set(image, { clearProps: 'transform,scale' })
  })
}

/** Desktop feature tweens leave opacity/transform inline; clear them when that mode ends. */
function clearFeatureMotion(cards: NodeListOf<HTMLElement> | HTMLElement[]) {
  cards.forEach((card) => {
    const features = card.querySelectorAll<HTMLElement>('.feature-item-inner')
    if (!features.length) return
    gsap.set(features, { clearProps: 'opacity,transform,visibility' })
  })
}

/** Sticky cards stay painted after their layout box has scrolled past. Use the visual box. */
function cardIsOnScreen(card: HTMLElement) {
  const rect = card.getBoundingClientRect()
  return rect.bottom > 0 && rect.top < window.innerHeight
}

function setupFeatureReveals(section: HTMLElement, cards: NodeListOf<HTMLElement>) {
  const triggers: ScrollTrigger[] = []
  const tweens: gsap.core.Tween[] = []
  const syncs: Array<() => void> = []

  cards.forEach((card) => {
    const features = card.querySelectorAll<HTMLElement>('.feature-item-inner')
    if (!features.length) return

    const tween = gsap.fromTo(
      features,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.08,
        paused: true,
      },
    )
    tweens.push(tween)

    let onScreen = false

    const sync = () => {
      const visible = cardIsOnScreen(card)
      if (visible && !onScreen) {
        onScreen = true
        tween.restart()
      } else if (!visible && onScreen) {
        // Fully off screen: reset so the entrance can play again on the way back.
        onScreen = false
        tween.pause(0)
        gsap.set(features, { opacity: 0, y: 24 })
      }
    }

    syncs.push(sync)
  })

  const syncAll = () => syncs.forEach((sync) => sync())

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onEnter: syncAll,
    onEnterBack: syncAll,
    onLeave: syncAll,
    onLeaveBack: syncAll,
    onUpdate: syncAll,
    onRefresh: syncAll,
  })
  triggers.push(trigger)
  syncs.forEach((sync) => sync())

  return () => {
    triggers.forEach((t) => t.kill())
    tweens.forEach((t) => t.kill())
    clearFeatureMotion(cards)
  }
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function progressInRange(progress: number, rangeStart: number) {
  if (progress <= rangeStart) return 0
  if (rangeStart >= 1) return progress >= 1 ? 1 : 0
  return Math.min(1, Math.max(0, (progress - rangeStart) / (1 - rangeStart)))
}

/**
 * Stack width shrinks with scroll (origin top) while the photo zooms.
 * Sticky wrappers stay untransformed so stacking is preserved.
 */
function setupStackingScale(container: HTMLElement, cards: NodeListOf<HTMLElement>) {
  const triggers: ScrollTrigger[] = []
  const cardList = Array.from(cards)
  const n = cardList.length

  cardList.forEach((card) => {
    gsap.set(getCardPanel(card), { scale: 1, transformOrigin: 'center top' })
    const image = getCardImage(card)
    if (image) gsap.set(image, { scale: IMAGE_SCALE_FROM, transformOrigin: 'center center' })
  })

  const stackTrigger = ScrollTrigger.create({
    trigger: container,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.15,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const progress = self.progress
      cardList.forEach((card, i) => {
        const targetScale = 1 - (n - i) * SCALE_STEP
        const t = progressInRange(progress, i * RANGE_STEP)
        gsap.set(getCardPanel(card), {
          scale: lerp(1, targetScale, t),
          force3D: true,
        })
      })
    },
  })
  triggers.push(stackTrigger)

  cardList.forEach((card) => {
    const image = getCardImage(card)
    if (!image) return

    const imageTrigger = ScrollTrigger.create({
      trigger: card,
      start: 'top bottom',
      end: 'top top',
      scrub: 0.15,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        gsap.set(image, {
          scale: lerp(IMAGE_SCALE_FROM, IMAGE_SCALE_TO, self.progress),
          force3D: true,
        })
      },
    })
    triggers.push(imageTrigger)
  })

  return () => {
    triggers.forEach((t) => t.kill())
    clearCardScales(cards)
  }
}

export function initServiceStackAnimations(scope: ParentNode): AnimationCleanup {
  const section = scope.querySelector<HTMLElement>('.service-section')
  if (!section) return () => {}

  const cards = section.querySelectorAll<HTMLElement>('[data-home-animate="service-card"]')
  if (!cards.length) return () => {}

  const stackContainer = section.querySelector<HTMLElement>('.service-info') ?? section

  const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')

  let modeCleanup: AnimationCleanup = () => {}

  const applyMode = () => {
    modeCleanup()
    clearCardScales(cards)
    clearFeatureMotion(cards)

    // Same sticky stack on desktop and mobile; only skip motion when reduced motion is on.
    if (prefersReducedMotion() || motionMq.matches) {
      modeCleanup = () => {}
      return
    }

    const scaleCleanup = setupStackingScale(stackContainer, cards)
    const featureCleanup = setupFeatureReveals(section, cards)
    modeCleanup = () => {
      scaleCleanup()
      featureCleanup()
    }
  }

  applyMode()

  const onModeChange = () => {
    applyMode()
    ScrollTrigger.refresh()
  }

  motionMq.addEventListener('change', onModeChange)

  return () => {
    motionMq.removeEventListener('change', onModeChange)
    clearCardScales(cards)
    clearFeatureMotion(cards)
  }
}
