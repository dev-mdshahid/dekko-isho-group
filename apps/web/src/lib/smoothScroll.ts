import Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export function getLenis() {
  return lenisInstance
}

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance
}

export function scrollToTop(options?: { immediate?: boolean }) {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(0, { immediate: options?.immediate ?? true })
    return
  }

  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

export function scrollToElement(
  target: HTMLElement,
  options?: {
    immediate?: boolean
    duration?: number
    /** Pixels added to the target position; negative values stop short (e.g. below a fixed navbar). */
    offset?: number
    onComplete?: () => void
  },
) {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(target, {
      immediate: options?.immediate,
      duration: options?.duration,
      offset: options?.offset,
      onComplete: options?.onComplete,
    })
    return
  }

  if (options?.offset) {
    const top = target.getBoundingClientRect().top + window.scrollY + options.offset
    window.scrollTo({ top, behavior: options.immediate ? 'auto' : 'smooth' })
    options.onComplete?.()
    return
  }
  target.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' })
  options?.onComplete?.()
}
