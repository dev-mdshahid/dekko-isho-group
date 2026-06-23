type WebflowWindow = Window & {
  Webflow?: {
    ready: () => void
    destroy: () => void
    require: (module: string) => { init?: () => void; ready?: () => void }
  }
  jQuery?: unknown
}

const JQUERY_SRC =
  'https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6a26a190936d1b3aae320bc8'
const WEBFLOW_SRC = '/legacy/js/webflow.js'

const HOME_PAGE_ID = '6a26a196936d1b3aae320c59'
const SITE_ID = '6a26a190936d1b3aae320bc8'

let scriptsLoaded: Promise<void> | null = null

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

export function ensureWebflowHtmlAttrs() {
  const html = document.documentElement
  html.setAttribute('data-wf-site', SITE_ID)
  html.setAttribute('data-wf-page', HOME_PAGE_ID)
}

export function loadWebflowScripts(): Promise<void> {
  if (!scriptsLoaded) {
    scriptsLoaded = (async () => {
      await loadScript(JQUERY_SRC)
      await loadScript(WEBFLOW_SRC)
    })()
  }
  return scriptsLoaded
}

export async function reinitWebflow() {
  ensureWebflowHtmlAttrs()
  await loadWebflowScripts()

  const win = window as WebflowWindow
  const Webflow = win.Webflow
  if (!Webflow) return

  try {
    Webflow.destroy()
  } catch {
    // First init — destroy may not apply
  }

  Webflow.ready()
}
