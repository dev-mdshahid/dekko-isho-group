import { type RefObject, useEffect } from 'react'
import { gsap } from 'gsap'

function isInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
}

function targetOpacity(el: HTMLElement) {
  return el.classList.contains('industry-image-bg') ? 0.7 : 1
}

/** Scroll-reveal for `[data-fade-in]` only — does not touch Webflow IX2 `data-w-id` targets. */
export function useInViewAnimation(containerRef?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    let observer: IntersectionObserver | null = null
    let scrollRaf = 0
    const resyncTimers: number[] = []

    const reveal = (el: HTMLElement) => {
      if (el.dataset.fadeDone === 'true') return
      el.dataset.fadeDone = 'true'
      const delayMs = Number.parseInt(el.dataset.fadeDelay ?? '0', 10)
      const delay = Number.isFinite(delayMs) ? delayMs / 1000 : 0
      gsap.to(el, {
        opacity: targetOpacity(el),
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay,
        overwrite: 'auto',
      })
      observer?.unobserve(el)
    }

    const repairVisible = (scope: HTMLElement) => {
      scope.querySelectorAll<HTMLElement>('[data-fade-in][data-fade-done="true"]').forEach((el) => {
        if (!isInViewport(el)) return
        const opacity = Number(gsap.getProperty(el, 'opacity'))
        if (opacity < targetOpacity(el) - 0.05) {
          gsap.set(el, { opacity: targetOpacity(el), y: 0 })
        }
      })
    }

    const syncVisible = () => {
      const scope = containerRef?.current
      if (!scope) return

      Array.from(scope.querySelectorAll<HTMLElement>('[data-fade-in]'))
        .filter((el) => el.dataset.fadeDone !== 'true')
        .forEach((el) => {
          if (isInViewport(el)) reveal(el)
        })

      repairVisible(scope)
    }

    const onScroll = () => {
      if (scrollRaf) return
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0
        syncVisible()
      })
    }

    const init = () => {
      const scope = containerRef?.current
      if (!scope) return

      const targets = Array.from(scope.querySelectorAll<HTMLElement>('[data-fade-in]')).filter(
        (el) => el.dataset.fadeDone !== 'true',
      )

      if (!targets.length) return

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            reveal(entry.target as HTMLElement)
          })
        },
        { threshold: 0, rootMargin: '80px 0px 80px 0px' },
      )

      targets.forEach((el) => {
        gsap.set(el, { opacity: 0, y: 24 })
        if (isInViewport(el)) {
          reveal(el)
        } else {
          observer?.observe(el)
        }
      })
    }

    init()
    requestAnimationFrame(syncVisible)
    resyncTimers.push(window.setTimeout(syncVisible, 150))
    resyncTimers.push(window.setTimeout(syncVisible, 500))
    resyncTimers.push(window.setTimeout(syncVisible, 1500))

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('scrollend', onScroll, { passive: true })
    window.addEventListener('dekko:webflow-ready', onScroll)

    return () => {
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
      resyncTimers.forEach((id) => window.clearTimeout(id))
      observer?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('scrollend', onScroll)
      window.removeEventListener('dekko:webflow-ready', onScroll)
    }
  }, [containerRef])
}
