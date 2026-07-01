import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export type ImageInfoExpandTargets = {
  section: HTMLElement
  scaler: HTMLElement
}

const DESKTOP_INITIAL_RATIO = 0.8
const MOBILE_INITIAL_RATIO = 0.8

/** Scrub: section starts inset from the edges and reaches full bleed on scroll. */
export function setupImageInfoExpand({ section, scaler }: ImageInfoExpandTargets) {
  const cleanups: (() => void)[] = []
  const mm = gsap.matchMedia()

  mm.add('(min-width: 992px) and (prefers-reduced-motion: no-preference)', () => {
    gsap.set(scaler, {
      width: () => window.innerWidth * DESKTOP_INITIAL_RATIO,
    })

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

    cleanups.push(() => {
      expandTween.scrollTrigger?.kill()
      expandTween.kill()
      gsap.set(scaler, { clearProps: 'width' })
    })

    ScrollTrigger.refresh()
  })

  mm.add('(max-width: 991px) and (prefers-reduced-motion: no-preference)', () => {
    gsap.set(scaler, {
      width: `${MOBILE_INITIAL_RATIO * 100}%`,
      marginLeft: 'auto',
      marginRight: 'auto',
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

    expandTween.to(scaler, { width: '100%', ease: 'none' }, 0)

    cleanups.push(() => {
      expandTween.scrollTrigger?.kill()
      expandTween.kill()
      gsap.set(scaler, { clearProps: 'width,marginLeft,marginRight' })
    })

    ScrollTrigger.refresh()
  })

  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set(scaler, { clearProps: 'all' })
  })

  return () => {
    cleanups.forEach((cleanup) => cleanup())
    mm.revert()
  }
}
