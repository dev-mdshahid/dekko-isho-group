import { useEffect } from 'react'

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.body.appendChild(script)
  })
}

export function useWebflowInit(enabled = true) {
  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    async function init() {
      try {
        await loadScript(
          'https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6a26a190936d1b3aae320bc8',
        )
        if (cancelled) return
        await loadScript('/legacy/js/webflow.js')
        if (cancelled) return
        const win = window as Window & { Webflow?: { ready: () => void } }
        win.Webflow?.ready()
      } catch (err) {
        console.error(err)
      }
    }

    void init()
    return () => {
      cancelled = true
    }
  }, [enabled])
}
