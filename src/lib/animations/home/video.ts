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

const DESKTOP_INITIAL_RATIO = 0.8
const MOBILE_INITIAL_RATIO = 0.8

function getExpandGap(section: HTMLElement) {
  const raw = getComputedStyle(section).getPropertyValue('--hero-video-expand-gap').trim()
  const gap = Number.parseFloat(raw)
  return Number.isFinite(gap) ? gap : 48
}

function getInitialVideoWidth() {
  return window.innerWidth * DESKTOP_INITIAL_RATIO
}

/** Scrub: video reaches full bleed once the section has scrolled past half the viewport. */
export function setupHeroVideoExpand({ section, stage, scaler, media }: HeroVideoExpandTargets) {
  const cleanups: (() => void)[] = []
  const mm = gsap.matchMedia()

  mm.add('(min-width: 992px) and (prefers-reduced-motion: no-preference)', () => {
    const gap = getExpandGap(section)

    gsap.set(scaler, {
      width: getInitialVideoWidth(),
      height: 'auto',
    })

    gsap.set(stage, { paddingTop: gap })

    const expandTween = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'center center',
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

  mm.add('(max-width: 991px) and (prefers-reduced-motion: no-preference)', () => {
    gsap.set(scaler, {
      width: `${MOBILE_INITIAL_RATIO * 100}%`,
      marginLeft: 'auto',
      marginRight: 'auto',
      borderRadius: '0.75rem',
    })

    const expandTween = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'center center',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    })

    expandTween.to(scaler, { width: '100%', borderRadius: '0rem', ease: 'none' }, 0)

    cleanups.push(() => {
      expandTween.scrollTrigger?.kill()
      expandTween.kill()
      gsap.set(scaler, { clearProps: 'width,marginLeft,marginRight,borderRadius' })
    })

    ScrollTrigger.refresh()
  })

  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set([scaler, stage], { clearProps: 'all' })
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
