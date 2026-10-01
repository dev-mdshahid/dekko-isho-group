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
    gsap.set(getCardPanel(card), { clearProps: 'opacity,transform,scale' })
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
    clearFeatureMotion(cards)
  }
}

/** Scrub window while `covering` advances over stuck `covered`. */
function coverScrubRange(covered: HTMLElement, covering: HTMLElement) {
  return {
    start: () => {
      const coveringStickyTop = getStickyTopPx(covering)
      const coverStart = getStickyTopPx(covered) + covered.offsetHeight
      return `top ${Math.max(coverStart, coveringStickyTop + MIN_COVER_SCRUB_PX)}px`
    },
    end: () => `top ${getStickyTopPx(covering)}px`,
  }
}

function scalePanelOnCover(
  panel: HTMLElement,
  trigger: HTMLElement,
  covered: HTMLElement,
  covering: HTMLElement,
) {
  gsap.set(panel, { scale: 1, transformOrigin: 'center top' })
  const { start, end } = coverScrubRange(covered, covering)

  return gsap.fromTo(
    panel,
    { scale: 1 },
    {
      scale: COVERED_SCALE,
      ease: 'none',
      force3D: true,
      overwrite: false,
      scrollTrigger: {
        trigger,
        start,
        end,
        // Tight scrub so scale stays locked to scroll into the stack release.
        scrub: 0.15,
        invalidateOnRefresh: true,
      },
    },
  )
}

/**
 * Cover-cascade:
 * 1) Card N scales only while card N+1 covers it.
 * 2) Final card self-scales while it covers the previous card (no successor).
 * Each tween targets that card's `.service-card-panel` only; sticky wrappers stay plain.
 */
function setupCoverCascadeScale(cards: NodeListOf<HTMLElement>) {
  const triggers: ScrollTrigger[] = []
  const tweens: gsap.core.Tween[] = []
  const cardList = Array.from(cards)

  // Pass 1 — N→N+1: covered card scales; covering card does not.
  cardList.forEach((card, index) => {
    if (index >= cardList.length - 1) return

    const nextCard = cardList[index + 1]
    if (!nextCard) return

    const tween = scalePanelOnCover(getCardPanel(card), nextCard, card, nextCard)
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    tweens.push(tween)
  })

  // Pass 2 — final card only: scale itself as it wraps over the previous card.
  if (cardList.length >= 2) {
    const lastCard = cardList[cardList.length - 1]
    const prevCard = cardList[cardList.length - 2]
    const lastTween = scalePanelOnCover(
      getCardPanel(lastCard),
      lastCard,
      prevCard,
      lastCard,
    )
    if (lastTween.scrollTrigger) triggers.push(lastTween.scrollTrigger)
    tweens.push(lastTween)
  }

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
    clearFeatureMotion(cards)

    const reduced = prefersReducedMotion() || motionMq.matches
    const mobile = mobileMq.matches

    // Cover-cascade scale stays desktop-only. On small screens the cards stick,
    // so a leave/reset fade would hide a card that is still pinned on screen.
    if (reduced || mobile) {
      modeCleanup = () => {}
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
    clearFeatureMotion(cards)
  }
}
