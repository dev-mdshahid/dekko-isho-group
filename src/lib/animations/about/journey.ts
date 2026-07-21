import { type AnimationCleanup, prefersReducedMotion } from '../prefersReducedMotion'
import { getLenis } from '../../smoothScroll'

const MOBILE_MQ = '(max-width: 860px)'

function isMobile() {
  return window.matchMedia(MOBILE_MQ).matches
}

function setGradientStops(section: HTMLElement) {
  const flow = section.querySelector<HTMLElement>('[data-journey-flow]')
  const gradient = section.querySelector<SVGLinearGradientElement>('#about-journey-flow-grad')
  const svg = section.querySelector<SVGSVGElement>('[data-journey-spine-svg]')
  const dots = Array.from(section.querySelectorAll<HTMLElement>('[data-journey-dot]'))
  if (!flow || !gradient || !svg || dots.length < 2) return

  const flowRect = flow.getBoundingClientRect()
  const height = Math.max(flowRect.height, 1)

  // userSpaceOnUse — objectBoundingBox breaks on thin vertical strokes (near-zero width).
  gradient.setAttribute('gradientUnits', 'userSpaceOnUse')
  gradient.setAttribute('x1', '0')
  gradient.setAttribute('y1', '0')
  gradient.setAttribute('x2', '0')
  gradient.setAttribute('y2', String(height))

  const firstY = dots[0].getBoundingClientRect().top + dots[0].offsetHeight / 2 - flowRect.top
  const lastY =
    dots[dots.length - 1].getBoundingClientRect().top +
    dots[dots.length - 1].offsetHeight / 2 -
    flowRect.top
  const span = Math.max(lastY - firstY, 1)

  const samples = dots.map((dot) => {
    const color =
      getComputedStyle(dot).getPropertyValue('--journey-era').trim() ||
      getComputedStyle(dot.parentElement!).getPropertyValue('--journey-era').trim() ||
      '#2595d5'
    const y = dot.getBoundingClientRect().top + dot.offsetHeight / 2 - flowRect.top
    const offset = Math.min(Math.max(((y - firstY) / span) * 100, 0), 100)
    return { color, offset }
  })

  // Group consecutive same-color dots into eras, then blend softly between era midpoints
  // instead of hard double-stops at the same offset (which cut blue|pink|green sharply).
  const groups: { color: string; offsets: number[] }[] = []
  for (const sample of samples) {
    const last = groups[groups.length - 1]
    if (last && last.color === sample.color) {
      last.offsets.push(sample.offset)
    } else {
      groups.push({ color: sample.color, offsets: [sample.offset] })
    }
  }

  const eras = groups.map((group) => ({
    color: group.color,
    mid: group.offsets.reduce((sum, offset) => sum + offset, 0) / group.offsets.length,
  }))

  // Blend width ≈ 12% of the span between neighboring era midpoints (within ~8–15%).
  const BLEND_RATIO = 0.12
  type GradStop = { offset: number; color: string }
  const stops: GradStop[] = [{ offset: 0, color: eras[0].color }]

  for (let i = 0; i < eras.length; i += 1) {
    const era = eras[i]
    stops.push({ offset: era.mid, color: era.color })

    if (i >= eras.length - 1) continue

    const next = eras[i + 1]
    const midSpan = Math.max(next.mid - era.mid, 0)
    const halfBlend = (midSpan * BLEND_RATIO) / 2
    const boundary = (era.mid + next.mid) / 2
    stops.push({ offset: boundary - halfBlend, color: era.color })
    stops.push({ offset: boundary + halfBlend, color: next.color })
  }

  stops.push({ offset: 100, color: eras[eras.length - 1].color })

  // Sort/clamp; never leave two different colors at the exact same offset (hard cut).
  stops.sort((a, b) => a.offset - b.offset)
  const cleaned: GradStop[] = []
  for (const stop of stops) {
    const offset = Math.min(Math.max(stop.offset, 0), 100)
    const prev = cleaned[cleaned.length - 1]
    if (prev && Math.abs(prev.offset - offset) < 0.05) {
      if (prev.color === stop.color) continue
      cleaned.push({ offset: Math.min(offset + 0.05, 100), color: stop.color })
      continue
    }
    cleaned.push({ offset, color: stop.color })
  }

  while (gradient.firstChild) gradient.removeChild(gradient.firstChild)

  for (const stop of cleaned) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    el.setAttribute('offset', `${stop.offset}%`)
    el.setAttribute('stop-color', stop.color)
    gradient.appendChild(el)
  }
}

function buildSpinePath(section: HTMLElement) {
  const flow = section.querySelector<HTMLElement>('[data-journey-flow]')
  const svg = section.querySelector<SVGSVGElement>('[data-journey-spine-svg]')
  const track = section.querySelector<SVGPathElement>('[data-journey-spine-track]')
  const fill = section.querySelector<SVGPathElement>('[data-journey-spine-fill]')
  if (!flow || !svg || !track || !fill) return 0

  if (isMobile()) {
    track.setAttribute('d', '')
    fill.setAttribute('d', '')
    fill.style.strokeDasharray = ''
    fill.style.strokeDashoffset = ''
    return 0
  }

  const flowRect = flow.getBoundingClientRect()
  const width = Math.max(flowRect.width, 1)
  const height = Math.max(flowRect.height, 1)
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(height))

  const dots = Array.from(section.querySelectorAll<HTMLElement>('[data-journey-dot]'))
  if (dots.length < 2) return 0

  const points = dots.map((dot) => {
    const rect = dot.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2 - flowRect.left,
      y: rect.top + rect.height / 2 - flowRect.top,
    }
  })

  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length
  const extend = 8
  let d = `M ${centerX} ${Math.max(points[0].y - extend, 0)}`
  for (let i = 0; i < points.length; i += 1) {
    d += ` L ${centerX} ${points[i].y}`
  }
  d += ` L ${centerX} ${Math.min(points[points.length - 1].y + extend, height)}`

  track.setAttribute('d', d)
  fill.setAttribute('d', d)
  // Attribute stroke (not CSS url()) so the gradient resolves against the document.
  track.setAttribute('stroke', 'var(--journey-line, #e4e4e0)')
  fill.setAttribute('stroke', 'url(#about-journey-flow-grad)')

  const pathLen = fill.getTotalLength()
  fill.style.strokeDasharray = `${pathLen}`
  fill.style.strokeDashoffset = `${pathLen}`

  setGradientStops(section)
  return pathLen
}

export function initJourneyAnimations(section: HTMLElement): AnimationCleanup {
  const flow = section.querySelector<HTMLElement>('[data-journey-flow]')
  const fill = section.querySelector<SVGPathElement>('[data-journey-spine-fill]')
  const rows = Array.from(section.querySelectorAll<HTMLElement>('[data-journey-row]'))

  if (!flow || !fill) return () => {}

  let pathLen = 0
  let rebuildTimer = 0
  const revealObservers: IntersectionObserver[] = []

  const updateFill = () => {
    if (!pathLen || isMobile()) return
    const flowRect = flow.getBoundingClientRect()
    const seen = Math.min(Math.max(window.innerHeight * 0.78 - flowRect.top, 0), flowRect.height)
    const progress = seen / Math.max(flowRect.height, 1)
    fill.style.strokeDashoffset = `${pathLen * (1 - progress)}`
  }

  const rebuild = () => {
    const previousProgress =
      pathLen > 0 ? 1 - Number.parseFloat(fill.style.strokeDashoffset || String(pathLen)) / pathLen : 0

    pathLen = buildSpinePath(section)

    if (prefersReducedMotion()) {
      fill.style.strokeDashoffset = '0'
      rows.forEach((row) => row.classList.add('is-in'))
      return
    }

    if (!pathLen) {
      fill.style.strokeDashoffset = '0'
      return
    }

    // Preserve progress across rebuilds so resize doesn't reset the fill.
    fill.style.strokeDashoffset = `${pathLen * (1 - Math.min(Math.max(previousProgress, 0), 1))}`
    updateFill()
  }

  const scheduleRebuild = () => {
    window.clearTimeout(rebuildTimer)
    rebuildTimer = window.setTimeout(rebuild, 50)
  }

  rows.forEach((row) => {
    if (prefersReducedMotion()) {
      row.classList.add('is-in')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-in')
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(row)
    revealObservers.push(observer)
  })

  const resizeObserver = new ResizeObserver(scheduleRebuild)
  resizeObserver.observe(flow)

  const onResize = () => scheduleRebuild()
  const onScroll = () => updateFill()

  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onScroll, { passive: true })

  const lenis = getLenis()
  const onLenisScroll = () => updateFill()
  lenis?.on('scroll', onLenisScroll)

  rebuild()
  requestAnimationFrame(() => {
    rebuild()
    updateFill()
  })

  return () => {
    window.clearTimeout(rebuildTimer)
    resizeObserver.disconnect()
    window.removeEventListener('resize', onResize)
    window.removeEventListener('scroll', onScroll)
    lenis?.off('scroll', onLenisScroll)
    revealObservers.forEach((observer) => observer.disconnect())
    fill.style.strokeDasharray = ''
    fill.style.strokeDashoffset = ''
  }
}
