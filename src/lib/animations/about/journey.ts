import { gsap } from 'gsap'

import { type AnimationCleanup, prefersReducedMotion } from '../prefersReducedMotion'
import { getLenis } from '../../smoothScroll'

const MOBILE_MQ = '(max-width: 860px)'
const FILL_SMOOTH = 0.14
const STROKE_OPACITY_MIN = 0.5
const STROKE_OPACITY_MAX = 0.82
const STROKE_OPACITY_MIN_MOBILE = 0.22
const STROKE_OPACITY_MAX_MOBILE = 0.4
const STROKE_PARALLAX_PX = 36
const STROKE_PARALLAX_PX_MOBILE = 18
const FLOURISH_PROGRESS_TRIGGER = 0.88
const SCROLL_READ_ANCHOR = 0.72

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

type SpineBuild = {
  pathLen: number
  nodeThresholds: number[]
  mobile: boolean
}

function measureNodeThresholds(section: HTMLElement): number[] {
  const flow = section.querySelector<HTMLElement>('[data-journey-flow]')
  const dots = Array.from(section.querySelectorAll<HTMLElement>('[data-journey-dot]'))
  if (!flow || dots.length < 2) return []

  const flowRect = flow.getBoundingClientRect()
  const points = dots.map((dot) => {
    const rect = dot.getBoundingClientRect()
    return rect.top + rect.height / 2 - flowRect.top
  })

  const extend = 8
  const startY = Math.max(points[0] - extend, 0)
  const endY = Math.min(points[points.length - 1] + extend, flowRect.height)
  const span = Math.max(endY - startY, 1)

  return points.map((y) => (y - startY) / span)
}

function clearDesktopSpine(
  track: SVGPathElement,
  fill: SVGPathElement,
  mobileFill: HTMLElement | null,
  flow: HTMLElement,
) {
  track.setAttribute('d', '')
  fill.setAttribute('d', '')
  fill.style.strokeDasharray = ''
  fill.style.strokeDashoffset = ''
  flow.style.setProperty('--journey-fill', '0')
  if (mobileFill) {
    mobileFill.style.transform = 'scaleY(0)'
  }
}

function buildSpinePath(section: HTMLElement): SpineBuild {
  const flow = section.querySelector<HTMLElement>('[data-journey-flow]')
  const svg = section.querySelector<SVGSVGElement>('[data-journey-spine-svg]')
  const track = section.querySelector<SVGPathElement>('[data-journey-spine-track]')
  const fill = section.querySelector<SVGPathElement>('[data-journey-spine-fill]')
  const mobileFill = section.querySelector<HTMLElement>('[data-journey-mobile-fill]')
  if (!flow || !svg || !track || !fill) return { pathLen: 0, nodeThresholds: [], mobile: false }

  const mobile = isMobile()
  const nodeThresholds = measureNodeThresholds(section)

  if (mobile) {
    clearDesktopSpine(track, fill, mobileFill, flow)
    return { pathLen: 0, nodeThresholds, mobile: true }
  }

  if (mobileFill) {
    mobileFill.style.transform = ''
  }
  flow.style.removeProperty('--journey-fill')

  const flowRect = flow.getBoundingClientRect()
  const width = Math.max(flowRect.width, 1)
  const height = Math.max(flowRect.height, 1)
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(height))

  const dots = Array.from(section.querySelectorAll<HTMLElement>('[data-journey-dot]'))
  if (dots.length < 2) return { pathLen: 0, nodeThresholds: [], mobile: false }

  const points = dots.map((dot) => {
    const rect = dot.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2 - flowRect.left,
      y: rect.top + rect.height / 2 - flowRect.top,
    }
  })

  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length
  const extend = 8
  const startY = Math.max(points[0].y - extend, 0)
  const endY = Math.min(points[points.length - 1].y + extend, height)

  let d = `M ${centerX} ${startY}`
  for (let i = 0; i < points.length; i += 1) {
    d += ` L ${centerX} ${points[i].y}`
  }
  d += ` L ${centerX} ${endY}`

  track.setAttribute('d', d)
  fill.setAttribute('d', d)
  // Attribute stroke (not CSS url()) so the gradient resolves against the document.
  track.setAttribute('stroke', 'var(--journey-line, #e4e4e0)')
  fill.setAttribute('stroke', 'url(#about-journey-flow-grad)')

  const pathLen = fill.getTotalLength()
  fill.style.strokeDasharray = `${pathLen}`
  fill.style.strokeDashoffset = `${pathLen}`

  setGradientStops(section)
  return { pathLen, nodeThresholds, mobile: false }
}

function prepareFlourish(flourish: SVGElement | null) {
  if (!flourish) return [] as SVGPathElement[]

  const paths = Array.from(flourish.querySelectorAll('path'))
  paths.forEach((path) => {
    const length = path.getTotalLength()
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`
  })
  flourish.classList.remove('is-drawn')
  return paths
}

function drawFlourish(flourish: SVGElement | null, paths: SVGPathElement[]) {
  if (!flourish || !paths.length || flourish.classList.contains('is-drawn')) return
  flourish.classList.add('is-drawn')

  gsap.to(flourish, {
    opacity: isMobile() ? 0.42 : 0.9,
    y: 0,
    duration: 0.9,
    ease: 'power2.out',
    overwrite: 'auto',
  })

  gsap.to(paths, {
    strokeDashoffset: 0,
    duration: 1.15,
    ease: 'power2.out',
    stagger: 0.12,
    overwrite: 'auto',
  })
}

function resetFlourish(flourish: SVGElement | null, paths: SVGPathElement[]) {
  if (!flourish || !paths.length) return

  gsap.killTweensOf([flourish, ...paths])
  flourish.classList.remove('is-drawn')

  paths.forEach((path) => {
    const length = path.getTotalLength()
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`
  })

  gsap.set(flourish, { opacity: isMobile() ? 0.18 : 0.35, y: 18 })
}

export function initJourneyAnimations(section: HTMLElement): AnimationCleanup {
  const flow = section.querySelector<HTMLElement>('[data-journey-flow]')
  const fill = section.querySelector<SVGPathElement>('[data-journey-spine-fill]')
  const mobileFill = section.querySelector<HTMLElement>('[data-journey-mobile-fill]')
  const strokeBg = section.querySelector<HTMLElement>('.about-journey-stroke-bg')
  const flourish = section.querySelector<SVGElement>('.about-journey-flourish')
  const rows = Array.from(section.querySelectorAll<HTMLElement>('[data-journey-row]'))
  const dots = Array.from(section.querySelectorAll<HTMLElement>('[data-journey-dot]'))

  if (!flow || !fill) return () => {}

  let pathLen = 0
  let nodeThresholds: number[] = []
  let mobileMode = false
  let rebuildTimer = 0
  let rafId = 0
  let targetProgress = 0
  let currentProgress = 0
  let flourishDrawn = false
  const revealObservers: IntersectionObserver[] = []
  let flourishPaths = prepareFlourish(flourish)

  if (flourish && !prefersReducedMotion()) {
    gsap.set(flourish, { opacity: isMobile() ? 0.18 : 0.35, y: 18 })
  }

  const setReducedFinalState = () => {
    fill.style.strokeDashoffset = '0'
    flow.style.setProperty('--journey-fill', '1')
    if (mobileFill) mobileFill.style.transform = 'scaleY(1)'
    rows.forEach((row) => row.classList.add('is-in'))
    dots.forEach((dot) => dot.classList.add('is-active'))
    if (strokeBg) {
      strokeBg.style.opacity = String(isMobile() ? STROKE_OPACITY_MAX_MOBILE : STROKE_OPACITY_MAX)
      strokeBg.style.transform = ''
    }
    if (flourish) {
      flourish.classList.add('is-drawn')
      gsap.set(flourish, { clearProps: 'opacity,transform' })
      flourishPaths.forEach((path) => {
        path.style.strokeDashoffset = '0'
      })
    }
  }

  const activateNode = (dot: HTMLElement, active: boolean) => {
    const wasActive = dot.classList.contains('is-active')
    if (active === wasActive) return

    if (active) {
      dot.classList.add('is-active')
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          dot,
          { scale: 1 },
          {
            scale: mobileMode ? 1.2 : 1.16,
            duration: 0.28,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1,
            overwrite: 'auto',
            onComplete: () => {
              gsap.set(dot, { clearProps: 'scale' })
            },
          },
        )
      }
      return
    }

    dot.classList.remove('is-active')
    gsap.killTweensOf(dot)
    gsap.set(dot, { clearProps: 'scale' })
  }

  const updateNodes = (progress: number) => {
    dots.forEach((dot, index) => {
      const threshold = nodeThresholds[index] ?? 1
      const byFill = progress >= threshold - 0.012
      activateNode(dot, byFill)
    })
  }

  const updateStrokeAtmosphere = () => {
    if (!strokeBg || prefersReducedMotion()) return

    const rect = section.getBoundingClientRect()
    const viewH = window.innerHeight
    const travel = rect.height + viewH
    const p = Math.min(Math.max((viewH - rect.top) / Math.max(travel, 1), 0), 1)
    const min = mobileMode ? STROKE_OPACITY_MIN_MOBILE : STROKE_OPACITY_MIN
    const max = mobileMode ? STROKE_OPACITY_MAX_MOBILE : STROKE_OPACITY_MAX
    const parallax = mobileMode ? STROKE_PARALLAX_PX_MOBILE : STROKE_PARALLAX_PX
    const opacity = min + (max - min) * p
    const y = (0.5 - p) * parallax

    strokeBg.style.opacity = String(opacity)
    strokeBg.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`
  }

  const isFlourishInView = () => {
    if (!flourish) return false
    const rect = flourish.getBoundingClientRect()
    return rect.top <= window.innerHeight * 0.92 && rect.bottom >= 0
  }

  const updateFlourish = (progress: number) => {
    if (prefersReducedMotion() || !flourish) return

    const shouldDraw = mobileMode ? isFlourishInView() : progress >= FLOURISH_PROGRESS_TRIGGER

    if (shouldDraw) {
      if (flourishDrawn) return
      flourishDrawn = true
      drawFlourish(flourish, flourishPaths)
      return
    }

    if (!flourishDrawn) return
    flourishDrawn = false
    resetFlourish(flourish, flourishPaths)
  }

  const applyFill = (progress: number) => {
    const clamped = Math.min(Math.max(progress, 0), 1)

    if (mobileMode) {
      flow.style.setProperty('--journey-fill', clamped.toFixed(4))
      if (mobileFill) {
        mobileFill.style.transform = `scaleY(${clamped.toFixed(4)})`
      }
      return
    }

    if (!pathLen) return
    fill.style.strokeDashoffset = `${pathLen * (1 - clamped)}`
  }

  const readTargetProgress = () => {
    const flowRect = flow.getBoundingClientRect()
    const seen = Math.min(
      Math.max(window.innerHeight * SCROLL_READ_ANCHOR - flowRect.top, 0),
      flowRect.height,
    )
    return seen / Math.max(flowRect.height, 1)
  }

  const tick = () => {
    rafId = 0
    if (prefersReducedMotion()) return

    const delta = targetProgress - currentProgress
    if (Math.abs(delta) > 0.0004) {
      currentProgress += delta * FILL_SMOOTH
      rafId = requestAnimationFrame(tick)
    } else {
      currentProgress = targetProgress
    }

    applyFill(currentProgress)
    updateNodes(currentProgress)
    updateFlourish(currentProgress)
  }

  const syncScroll = () => {
    updateStrokeAtmosphere()

    if (prefersReducedMotion()) return

    targetProgress = readTargetProgress()

    if (!rafId) rafId = requestAnimationFrame(tick)
  }

  const rebuild = () => {
    const previousProgress = currentProgress

    const built = buildSpinePath(section)
    pathLen = built.pathLen
    nodeThresholds = built.nodeThresholds
    mobileMode = built.mobile
    flourishPaths = prepareFlourish(flourish)
    flourishDrawn = false

    if (prefersReducedMotion()) {
      setReducedFinalState()
      return
    }

    if (flourish) gsap.set(flourish, { opacity: mobileMode ? 0.18 : 0.35, y: 18 })

    if (!mobileMode && !pathLen) {
      fill.style.strokeDashoffset = '0'
      currentProgress = 0
      targetProgress = 0
      syncScroll()
      return
    }

    currentProgress = Math.min(Math.max(previousProgress, 0), 1)
    targetProgress = currentProgress
    applyFill(currentProgress)
    syncScroll()
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
          const target = entry.target as HTMLElement
          if (entry.isIntersecting) {
            target.classList.add('is-in')
            return
          }

          target.classList.remove('is-in')
        })
      },
      {
        threshold: isMobile() ? 0.12 : 0.18,
        rootMargin: isMobile() ? '0px 0px -8% 0px' : '0px 0px -6% 0px',
      },
    )
    observer.observe(row)
    revealObservers.push(observer)
  })

  const resizeObserver = new ResizeObserver(scheduleRebuild)
  resizeObserver.observe(flow)

  const onResize = () => scheduleRebuild()
  const onScroll = () => syncScroll()

  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onScroll, { passive: true })

  const lenis = getLenis()
  const onLenisScroll = () => syncScroll()
  lenis?.on('scroll', onLenisScroll)

  if (prefersReducedMotion()) {
    rebuild()
  } else {
    rebuild()
    requestAnimationFrame(() => {
      rebuild()
      syncScroll()
    })
  }

  return () => {
    window.clearTimeout(rebuildTimer)
    if (rafId) cancelAnimationFrame(rafId)
    resizeObserver.disconnect()
    window.removeEventListener('resize', onResize)
    window.removeEventListener('scroll', onScroll)
    lenis?.off('scroll', onLenisScroll)
    revealObservers.forEach((observer) => observer.disconnect())
    rows.forEach((row) => row.classList.remove('is-in'))
    dots.forEach((dot) => {
      gsap.killTweensOf(dot)
      gsap.set(dot, { clearProps: 'scale' })
      dot.classList.remove('is-active')
    })
    if (flourish) {
      gsap.killTweensOf([flourish, ...flourishPaths])
      gsap.set(flourish, { clearProps: 'opacity,transform' })
      flourishPaths.forEach((path) => {
        path.style.strokeDasharray = ''
        path.style.strokeDashoffset = ''
      })
      flourish.classList.remove('is-drawn')
    }
    if (strokeBg) {
      strokeBg.style.opacity = ''
      strokeBg.style.transform = ''
    }
    flow.style.removeProperty('--journey-fill')
    if (mobileFill) mobileFill.style.transform = ''
    fill.style.strokeDasharray = ''
    fill.style.strokeDashoffset = ''
  }
}
