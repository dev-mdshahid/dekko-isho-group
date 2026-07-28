import { type RefObject, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const COUNTER_BOUND_ATTR = 'data-counter-bound'

function formatCountValue(val: number, decimals: number, suffix: string) {
  if (decimals > 0) {
    return `${val.toFixed(decimals)}${suffix}`
  }
  return `${Math.floor(val).toLocaleString()}${suffix}`
}

function initScrollCounters(root: ParentNode = document) {
  gsap.registerPlugin(ScrollTrigger)
  const counters = gsap.utils.toArray<HTMLElement>('.count', root)
  if (!counters.length) return []

  const cleanups: (() => void)[] = []

  counters.forEach((el, idx) => {
    if (el.getAttribute(COUNTER_BOUND_ATTR) === 'true') return
    el.setAttribute(COUNTER_BOUND_ATTR, 'true')

    const raw = el.getAttribute('data-target') || '0'
    const target = Number.parseFloat(String(raw).replace(/,/g, '')) || 0
    const decimalsAttr = el.getAttribute('data-decimals')
    const decimals =
      decimalsAttr != null && decimalsAttr !== ''
        ? Number.parseInt(decimalsAttr, 10) || 0
        : 0
    const suffix = el.getAttribute('data-suffix') || ''

    const customDuration = el.getAttribute('data-duration')
    const duration =
      customDuration != null && customDuration !== ''
        ? Number.parseFloat(customDuration) || Math.max(1, Math.min(3, (target / 200) * 2))
        : Math.max(1, Math.min(3, (target / 200) * 2))

    const delayAttr = el.getAttribute('data-delay')
    const delay =
      delayAttr != null && delayAttr !== ''
        ? Number.parseFloat(delayAttr) || 0
        : idx * 0.15

    const scrollStart = el.getAttribute('data-scroll-start') || 'top 80%'
    const scrollTriggerSelector = el.getAttribute('data-scroll-trigger')
    const triggerEl = scrollTriggerSelector
      ? document.querySelector<HTMLElement>(scrollTriggerSelector)
      : el

    if (!triggerEl) return

    el.textContent = formatCountValue(0, decimals, suffix)

    const obj = { val: 0 }
    const tween = gsap.to(obj, {
      val: target,
      duration,
      ease: 'none',
      delay,
      paused: true,
      onUpdate: () => {
        el.textContent = formatCountValue(obj.val, decimals, suffix)
      },
      onComplete: () => {
        el.textContent = formatCountValue(target, decimals, suffix)
      },
    })

    const scrollTrigger = ScrollTrigger.create({
      trigger: triggerEl,
      start: scrollStart,
      once: true,
      onEnter: () => {
        tween.play()
      },
    })

    cleanups.push(() => {
      scrollTrigger.kill()
      tween.kill()
      el.removeAttribute(COUNTER_BOUND_ATTR)
    })
  })

  ScrollTrigger.refresh()

  return cleanups
}

export function useScrollCounter(rootRef?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef?.current ?? document
    if (!root) return

    const cleanups = initScrollCounters(root)

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [rootRef])
}
