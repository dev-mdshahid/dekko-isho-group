import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function initAboutHeroAnimation(scope: ParentNode): AnimationCleanup {
  const section = scope.querySelector<HTMLElement>('.about-hero-section')
  if (!section) return () => {}

  const lines = Array.from(
    section.querySelectorAll<HTMLElement>('[data-about-animate="hero-line"]'),
  )
  const carets = Array.from(
    section.querySelectorAll<HTMLElement>('.about-hero-title .hero-title-caret'),
  )
  const subtitle = section.querySelector<HTMLElement>('.about-hero-subtitle')

  const reduced = prefersReducedMotion()

  if (reduced) {
    gsap.set([...lines, subtitle].filter(Boolean), { clearProps: 'all' })
    gsap.set(carets, { opacity: 0 })
    return () => {}
  }

  gsap.set(lines, { clipPath: 'inset(0 100% 0 0)' })
  gsap.set(carets, { opacity: 0, left: '0%' })
  if (subtitle) gsap.set(subtitle, { opacity: 0, y: 20 })

  // Only show the caret on single-row lines — wrapping lines misplace it.
  const caretEnabled = lines.map((line, i) => {
    const caret = carets[i]
    if (!caret) return false
    const lineHeight = parseFloat(getComputedStyle(line).lineHeight)
    const singleRow = !lineHeight || line.offsetHeight <= lineHeight * 1.4
    return singleRow
  })

  const tl = gsap.timeline({
    delay: 0.2,
    onComplete: () => ScrollTrigger.refresh(),
  })

  let typedEnd = 0
  lines.forEach((line, i) => {
    const caret = caretEnabled[i] ? carets[i] : null
    const charCount = Math.max((line.textContent ?? '').trim().length, 1)
    const duration = gsap.utils.clamp(0.5, 1.8, charCount * 0.05)
    const ease = `steps(${charCount})`
    const at = i === 0 ? 0 : typedEnd

    if (caret) tl.set(caret, { opacity: 1, left: '0%' }, at)
    tl.to(line, { clipPath: 'inset(0 0% 0 0)', duration, ease }, at)
    if (caret) tl.to(caret, { left: '100%', duration, ease }, at)

    typedEnd = at + duration

    if (caret && i < lines.length - 1) {
      tl.to(caret, { opacity: 0, duration: 0.25, ease: 'power1.out' }, typedEnd)
    }
  })

  const lastCaret = caretEnabled[lines.length - 1] ? carets[lines.length - 1] : null
  if (lastCaret) {
    tl.call(() => lastCaret.classList.add('is-blinking'), undefined, typedEnd)
    tl.call(() => lastCaret.classList.remove('is-blinking'), undefined, typedEnd + 2.8)
    tl.to(lastCaret, { opacity: 0, duration: 0.4, ease: 'power1.out' }, typedEnd + 2.8)
  }

  if (subtitle) {
    tl.to(subtitle, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, typedEnd + 0.3)
  }

  return () => {
    tl.kill()
  }
}
