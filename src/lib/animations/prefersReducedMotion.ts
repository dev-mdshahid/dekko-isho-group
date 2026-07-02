export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isMobileViewport() {
  return window.matchMedia('(max-width: 991px)').matches
}

export type AnimationCleanup = () => void
