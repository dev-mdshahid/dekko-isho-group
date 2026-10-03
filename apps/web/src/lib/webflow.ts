type WebflowWindow = Window & {
  Webflow?: {
    ready: () => void
    destroy: () => void
    require: (module: string) => { init?: () => void; ready?: () => void }
  }
}

export function ensureWebflowHtmlAttrs() {
  document.documentElement.removeAttribute('data-wf-site')
  document.documentElement.removeAttribute('data-wf-page')
}

export function loadWebflowScripts(): Promise<void> {
  return Promise.resolve()
}

export async function reinitWebflow() {
  const win = window as WebflowWindow
  try {
    win.Webflow?.destroy()
  } catch {
    // Webflow runtime is no longer loaded.
  }
}
