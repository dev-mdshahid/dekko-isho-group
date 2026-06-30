import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export type HeroVideoExpandTargets = {
  section: HTMLElement
  stage: HTMLElement
  scaler: HTMLElement
  media: HTMLElement | null
}

function getExpandGap(section: HTMLElement) {
  const raw = getComputedStyle(section).getPropertyValue('--hero-video-expand-gap').trim()
  const gap = Number.parseFloat(raw)
  return Number.isFinite(gap) ? gap : 48
}

function getInitialVideoWidth(section: HTMLElement) {
  const gap = getExpandGap(section)
  return Math.max(0, window.innerWidth - gap * 2)
}

/** Scrub: video reaches full bleed once the section has scrolled past half the viewport. */
export function setupHeroVideoExpand({ section, stage, scaler, media }: HeroVideoExpandTargets) {
  const cleanups: (() => void)[] = []
  const mm = gsap.matchMedia()

  mm.add('(min-width: 992px) and (prefers-reduced-motion: no-preference)', () => {
    const gap = getExpandGap(section)

    gsap.set(scaler, {
      width: getInitialVideoWidth(section),
      height: 'auto',
    })

    gsap.set(stage, { paddingTop: gap })

    const expandTween = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'top 50%',
        scrub: 0.85,
        invalidateOnRefresh: true,
      },
    })

    expandTween.to(scaler, { width: () => window.innerWidth, ease: 'none' }, 0)
    expandTween.to(stage, { paddingTop: 0, ease: 'none' }, 0)

    const onMetadata = () => ScrollTrigger.refresh()
    media?.addEventListener('loadedmetadata', onMetadata)

    cleanups.push(() => {
      media?.removeEventListener('loadedmetadata', onMetadata)
      expandTween.scrollTrigger?.kill()
      expandTween.kill()
      gsap.set([scaler, stage], { clearProps: 'all' })
    })

    ScrollTrigger.refresh()
  })

  mm.add('(max-width: 991px), (prefers-reduced-motion: reduce)', () => {
    gsap.set(scaler, { clearProps: 'all' })
  })

  return () => {
    cleanups.forEach((cleanup) => cleanup())
    mm.revert()
  }
}

/** @deprecated Use setupHeroVideoExpand from HeroVideo refs instead. */
export function initHeroVideoExpand(scope: ParentNode): AnimationCleanup {
  const section = scope.querySelector<HTMLElement>('[data-home-animate="hero-video-section"]')
  const stage = section?.querySelector<HTMLElement>('.hero-video-stage')
  const scaler = section?.querySelector<HTMLElement>('.hero-video-scaler')
  const media = section?.querySelector<HTMLElement>('.hero-video-media')

  if (!section || !stage || !scaler) return () => {}

  return setupHeroVideoExpand({
    section,
    stage,
    scaler,
    media: media ?? null,
  })
}
