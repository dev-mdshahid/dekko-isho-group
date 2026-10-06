import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

import { useSplashOptional } from '../../context/SplashContext'
import {
  HERO_TITLE_ARIA,
  HERO_TITLE_LINES,
  type HeroTitleLine,
  type HeroTitlePart,
} from '../../data/home/heroTitle'
import { prefersReducedMotion } from '../../lib/animations/prefersReducedMotion'

/** Matches Aceternity TypewriterEffectSmooth (no package). */
const REVEAL_DURATION = 2.8
const REVEAL_DELAY = 0.35

function HeroTitleWords({ part }: { part: HeroTitlePart }) {
  // Plain parts stay inline (not inline-block) so trailing spaces render.
  if (!part.accent) {
    return <span>{part.text}</span>
  }

  return (
    <span
      className={`hero-title-word hero-title-accent hero-title-accent--${part.accent}`}
    >
      {part.text}
    </span>
  )
}

function HeroTypewriterLine({ line }: { line: HeroTitleLine }) {
  const rowClassName = [
    'hero-title-smooth-row',
    line.inline ? 'hero-title-smooth-row--inline' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={rowClassName}>
      <span className="hero-title-line-mask">
        <span className="hero-title-line">
          {line.parts.map((part, index) => (
            <HeroTitleWords key={`${part.text}-${index}`} part={part} />
          ))}
        </span>
      </span>
    </span>
  )
}

export function HeroTypewriterTitle() {
  const scopeRef = useRef<HTMLHeadingElement>(null)
  const splash = useSplashOptional()
  const splashDone =
    !splash || splash.phase === 'complete' || splash.phase === 'skipped'
  const reduceMotion = prefersReducedMotion()

  useEffect(() => {
    const root = scopeRef.current
    if (!root) return

    const masks = root.querySelectorAll<HTMLElement>('.hero-title-line-mask')
    if (!masks.length) return

    if (reduceMotion) {
      gsap.set(masks, { width: 'fit-content' })
      return
    }

    if (!splashDone) {
      gsap.set(masks, { width: 0 })
      return
    }

    const targets = Array.from(masks)

    gsap.set(targets, { width: 'auto' })
    const widths = targets.map((el) => el.getBoundingClientRect().width)
    gsap.set(targets, { width: 0 })

    const tl = gsap.timeline({ delay: REVEAL_DELAY })
    const totalWidth = widths.reduce((sum, w) => sum + w, 0) || 1

    targets.forEach((el, index) => {
      const width = widths[index] ?? 0
      const duration = Math.max(0.45, REVEAL_DURATION * (width / totalWidth))

      tl.to(el, {
        width,
        duration,
        ease: 'none',
        onComplete: () => {
          gsap.set(el, { width: 'fit-content' })
        },
      })
    })

    return () => {
      tl.kill()
    }
  }, [reduceMotion, splashDone])

  return (
    <h1
      ref={scopeRef}
      className="hero-title"
      aria-label={HERO_TITLE_ARIA}
      data-hero-typewriter={reduceMotion ? 'static' : 'smooth'}
    >
      {HERO_TITLE_LINES.map((line, lineIndex) => (
        <HeroTypewriterLine key={lineIndex} line={line} />
      ))}
    </h1>
  )
}
