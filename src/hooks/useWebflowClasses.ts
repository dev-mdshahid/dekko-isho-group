import { useEffect } from 'react'

export function useWebflowClasses() {
  useEffect(() => {
    const html = document.documentElement
    html.classList.add('w-mod-js', 'w-mod-ix')

    const isTouch =
      'ontouchstart' in window ||
      (window as Window & { DocumentTouch?: unknown }).DocumentTouch !== undefined

    if (isTouch) {
      html.classList.add('w-mod-touch')
    }

    return () => {
      html.classList.remove('w-mod-js', 'w-mod-ix', 'w-mod-touch')
    }
  }, [])
}
