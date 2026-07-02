import { useEffect } from 'react'

/** Adds Webflow JS detection classes. `w-mod-ix` is added by webflow.js after IX2 init. */
export function useWebflowClasses() {
  useEffect(() => {
    const html = document.documentElement
    html.classList.add('w-mod-js')

    const isTouch =
      'ontouchstart' in window ||
      (window as Window & { DocumentTouch?: unknown }).DocumentTouch !== undefined

    if (isTouch) {
      html.classList.add('w-mod-touch')
    }

    return () => {
      html.classList.remove('w-mod-js', 'w-mod-touch')
    }
  }, [])
}
