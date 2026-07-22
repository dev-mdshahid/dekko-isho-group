import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/** Scale applied to a card once the next card has fully advanced over it. */
const COVERED_SCALE = 0.94

/** Minimum scrub distance (px) so short cards never invert start/end. */
const MIN_COVER_SCRUB_PX = 80

const MOBILE_MQ = '(max-width: 991px)'

function getStickyTopPx(el: HTMLElement): number {
  const parsed = Number.parseFloat(getComputedStyle(el).top)
  return Number.isFinite(parsed) ? parsed : 0
}

/**
 * The painted card unit (tint + content). Sticky `.service-list-wrapper` must
 * never receive a transform — that breaks sticky stacking and makes the whole
 * stack appear to scale together.
 */
function getCardPanel(card: HTMLElement): HTMLElement {
  return card.querySelector<HTMLElement>('.service-card-panel') ?? card
}

function clearCardScales(cards: NodeListOf<HTMLElement> | HTMLElement[]) {
  cards.forEach((card) => {
    gsap.set(card, { clearProps: 'transform,scale' })
    gsap.set(getCardPanel(card), { clearProps: 'transform,scale' })
  })
}

function setupRevealAnimations(cards: NodeListOf<HTMLElement>) {
  const triggers: ScrollTrigger[] = []
  const tweens: gsap.core.Tween[] = []

  cards.forEach((card) => {
    const tween = gsap.fromTo(
      card,
      { opacity: 0, y: 64 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'restart reset restart reset',
        },
      },
    )
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    tweens.push(tween)
  })

  return () => {
    triggers.forEach((t) => t.kill())
    tweens.forEach((t) => t.kill())
  }
}

function setupFeatureReveals(cards: NodeListOf<HTMLElement>) {
  const triggers: ScrollTrigger[] = []
  const tweens: gsap.core.Tween[] = []

  cards.forEach((card) => {
    const features = card.querySelectorAll<HTMLElement>('.feature-item-inner')
    if (!features.length) return

    const featureTween = gsap.fromTo(
      features,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: card,
          start: 'top 75%',
          toggleActions: 'restart reset restart reset',
        },
      },
    )
    if (featureTween.scrollTrigger) triggers.push(featureTween.scrollTrigger)
    tweens.push(featureTween)
  })

  return () => {
    triggers.forEach((t) => t.kill())
    tweens.forEach((t) => t.kill())
  }
}

/**
 * Cover-cascade: card N stays at scale 1 until card N+1 begins overlapping it.
 * Then only card N's panel scales down with N+1's cover progress.
 * The covering card never scales in this pass. Last card stays full size.
 */
function setupCoverCascadeScale(cards: NodeListOf<HTMLElement>) {
  const triggers: ScrollTrigger[] = []
  const tweens: gsap.core.Tween[] = []
  const cardList = Array.from(cards)

  cardList.forEach((card, index) => {
    // Last card has no successor — stay at full scale.
    if (index >= cardList.length - 1) return

    const nextCard = cardList[index + 1]
    if (!nextCard) return

    const panel = getCardPanel(card)
    gsap.set(panel, { scale: 1, transformOrigin: 'center top' })

    const tween = gsap.fromTo(
      panel,
      { scale: 1 },
      {
        scale: COVERED_SCALE,
        ease: 'none',
        force3D: true,
        overwrite: false,
        scrollTrigger: {
          // Progress is driven only by the immediate next card.
          trigger: nextCard,
          // Cover begins when the next card's top reaches this card's stuck bottom.
          start: () => {
            const nextStickyTop = getStickyTopPx(nextCard)
            const coverStart = getStickyTopPx(card) + card.offsetHeight
            return `top ${Math.max(coverStart, nextStickyTop + MIN_COVER_SCRUB_PX)}px`
          },
          // Cover complete when the next card reaches its own sticky top.
          end: () => `top ${getStickyTopPx(nextCard)}px`,
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      },
    )

    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    tweens.push(tween)
  })

  return () => {
    triggers.forEach((t) => t.kill())
    tweens.forEach((t) => t.kill())
    clearCardScales(cards)
  }
}

export function initServiceStackAnimations(scope: ParentNode): AnimationCleanup {
  const section = scope.querySelector<HTMLElement>('.service-section')
  if (!section) return () => {}

  const cards = section.querySelectorAll<HTMLElement>('[data-home-animate="service-card"]')
  if (!cards.length) return () => {}

  const mobileMq = window.matchMedia(MOBILE_MQ)
  const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')

  let modeCleanup: AnimationCleanup = () => {}

  const applyMode = () => {
    modeCleanup()
    clearCardScales(cards)

    const reduced = prefersReducedMotion() || motionMq.matches
    const mobile = mobileMq.matches

    // Sticky stack (and cover cascade) only runs on desktop with motion allowed.
    if (reduced || mobile) {
      modeCleanup = setupRevealAnimations(cards)
      return
    }

    const scaleCleanup = setupCoverCascadeScale(cards)
    const featureCleanup = setupFeatureReveals(cards)
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

  mobileMq.addEventListener('change', onModeChange)
  motionMq.addEventListener('change', onModeChange)

  return () => {
    mobileMq.removeEventListener('change', onModeChange)
    motionMq.removeEventListener('change', onModeChange)
    modeCleanup()
    clearCardScales(cards)
  }
}
