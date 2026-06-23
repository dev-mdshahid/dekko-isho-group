export type RevealOptions = {
  /** Reveal every `[data-fade-in]` inside `root`, not only those in the viewport. */
  forceInRoot?: boolean
}

type RevealFn = (root?: Element, options?: RevealOptions) => void

let revealFn: RevealFn | null = null

export function registerFadeInReveal(fn: RevealFn) {
  revealFn = fn
}

export function unregisterFadeInReveal() {
  revealFn = null
}

export function revealFadeIns(root?: Element, options?: RevealOptions) {
  revealFn?.(root, options)
}
