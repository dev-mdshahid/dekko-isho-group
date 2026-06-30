import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function initHeroAnimations(scope: ParentNode): AnimationCleanup {
  const section = scope.querySelector<HTMLElement>('.hero-section')
  if (!section) return () => {}

  const lines = Array.from(section.querySelectorAll<HTMLElement>('[data-home-animate="hero-line"]'))
  const accents = section.querySelectorAll<HTMLElement>('[data-home-animate="hero-accent"]')
  const carets = Array.from(section.querySelectorAll<HTMLElement>('.hero-title-caret'))
  const taglineLines = section.querySelectorAll<HTMLElement>('[data-home-animate="hero-tagline-line"]')
  const taglineText = section.querySelector<HTMLElement>('[data-home-animate="hero-tagline-text"]')
  const logos = section.querySelector<HTMLElement>('[data-home-animate="hero-logos"]')
  const heroInner = section.querySelector<HTMLElement>('.hero-inner')

  const reduced = prefersReducedMotion()

  if (reduced) {
    gsap.set([...lines, ...accents, taglineText, logos].filter(Boolean), {
      clearProps: 'all',
    })
    gsap.set(taglineLines, { scaleX: 1, transformOrigin: 'center' })
    gsap.set(carets, { opacity: 0 })
    return () => {}
  }

  gsap.set(lines, { clipPath: 'inset(0 100% 0 0)' })
  // Accents are revealed in place by the typing wipe rather than fading in.
  gsap.set(accents, { opacity: 1, y: 0, scale: 1 })
  gsap.set(taglineLines, { scaleX: 0, transformOrigin: 'center' })
  if (taglineText) gsap.set(taglineText, { opacity: 0, y: 20 })
  if (logos) gsap.set(logos, { opacity: 0, y: 24 })

  // The caret only tracks the typing edge cleanly on a single visual row; if a
  // line wraps at the current viewport we keep the typed reveal but drop the
  // caret so it never renders as a mispositioned bar across both rows.
  const caretEnabled = lines.map((line, i) => {
    const caret = carets[i]
    if (!caret) return false
    const lineHeight = parseFloat(getComputedStyle(line).lineHeight)
    const singleRow = !lineHeight || line.offsetHeight <= lineHeight * 1.4
    gsap.set(caret, { opacity: 0, left: '0%' })
    return singleRow
  })

  const tl = gsap.timeline({
    delay: 0.2,
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      once: true,
    },
    onComplete: () => {
      ScrollTrigger.refresh()
    },
  })

  // Type each line out character by character (stepped clip wipe), advancing a
  // blinking caret along the typing edge.
  let typedEnd = 0
  lines.forEach((line, i) => {
    const caret = caretEnabled[i] ? carets[i] : null
    const charCount = Math.max((line.textContent ?? '').trim().length, 1)
    const duration = gsap.utils.clamp(0.4, 1.2, charCount * 0.035)
    const ease = `steps(${charCount})`
    const at = i === 0 ? 0 : typedEnd

    if (caret) tl.set(caret, { opacity: 1, left: '0%' }, at)
    tl.to(line, { clipPath: 'inset(0 0% 0 0)', duration, ease }, at)
    if (caret) tl.to(caret, { left: '100%', duration, ease }, at)

    typedEnd = at + duration

    // Hand the caret off to the next line.
    if (caret && i < lines.length - 1) {
      tl.to(caret, { opacity: 0, duration: 0.25, ease: 'power1.out' }, typedEnd)
    }
  })

  const lastCaret = caretEnabled[lines.length - 1] ? carets[lines.length - 1] : null
  if (lastCaret) {
    tl.call(() => lastCaret.classList.add('is-blinking'), undefined, typedEnd)
    tl.call(() => lastCaret.classList.remove('is-blinking'), undefined, typedEnd + 1.2)
    tl.to(lastCaret, { opacity: 0, duration: 0.35, ease: 'power1.out' }, typedEnd + 1.2)
  }

  // Start the tagline/logos reveal while the last line is still finishing so
  // the whole hero resolves quickly rather than stacking end-to-end.
  const revealAt = Math.max(typedEnd - 0.35, 0)
  tl.to(
    taglineLines,
    { scaleX: 1, duration: 0.8, ease: 'power2.inOut', stagger: 0.12 },
    revealAt,
  )
  if (taglineText) {
    tl.to(taglineText, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, revealAt + 0.3)
  }
  if (logos) {
    tl.to(logos, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, revealAt + 0.55)
  }

  let parallaxTrigger: ScrollTrigger | undefined

  if (heroInner) {
    parallaxTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      animation: gsap.to(heroInner, { y: -40, ease: 'none' }),
    })
  }

  return () => {
    tl.kill()
    parallaxTrigger?.kill()
  }
}
