import { expect, type Page, type TestInfo } from '@playwright/test'
import type { LayoutMetadata } from './devices'

/** Width at or below which the site swaps the desktop links for the menu button (MOBILE_NAV_QUERY). */
export const MOBILE_NAV_MAX = 1355

export const layoutOf = (info: TestInfo) => info.project.metadata as LayoutMetadata

/** Marks the intro splash as already seen (the site's own skip path), so each page test starts on the page itself. */
export async function skipSplash(page: Page) {
  await page.addInitScript(() => {
    const mark = () => {
      const html = document.documentElement
      if (!html) return false
      html.classList.remove('splash-boot')
      html.classList.add('splash-done')
      return true
    }
    if (mark()) return
    const observer = new MutationObserver(() => mark() && observer.disconnect())
    observer.observe(document, { childList: true, subtree: true })
  })
}

/** Waits for the intro splash, web fonts and in-flight images so measurements are of the settled page. */
export async function settle(page: Page) {
  await page.waitForFunction(() => document.documentElement.classList.contains('splash-done') || !document.getElementById('boot-splash'), null, { timeout: 20_000 })
  await page.evaluate(async () => {
    await document.fonts.ready
    const pending = [...document.images].filter((img) => !img.complete && img.loading !== 'lazy')
    const loaded = (img: HTMLImageElement) =>
      new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true })
        img.addEventListener('error', resolve, { once: true })
      })
    await Promise.race([Promise.all(pending.map(loaded)), new Promise((r) => setTimeout(r, 3000))])
  })
}

/** Scrolls top to bottom in screen-sized steps so lazy content and scroll reveals all get rendered, then returns to the top. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const pause = (ms: number) => new Promise((r) => setTimeout(r, ms))
    // Lazy media and reveal triggers fire ahead of the viewport, so a screen-or-more step reaches everything.
    const step = Math.max(600, window.innerHeight)
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await pause(50)
    }
    window.scrollTo(0, document.documentElement.scrollHeight)
    await pause(400)
  })
}

type Finding = { what: string; where: string }

/**
 * Measures the page in the browser and returns every layout problem found:
 * sideways scrolling, content poking past the screen edge, text spilling out of its box, broken images.
 * Content inside a clipping/scrolling container (carousels, marquees, tables) is ignored, as is anything hidden.
 */
export async function findLayoutProblems(page: Page): Promise<Finding[]> {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth
    const findings: { what: string; where: string }[] = []
    const describe = (el: Element) => {
      const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 3).join('.') : ''
      const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 40)
      return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${cls ? `.${cls}` : ''}${text ? ` "${text}"` : ''}`
    }
    const styles = new Map<Element, CSSStyleDeclaration>()
    const style = (el: Element) => {
      let s = styles.get(el)
      if (!s) styles.set(el, (s = getComputedStyle(el)))
      return s
    }
    const hiddenMemo = new Map<Element, boolean>()
    const isHidden = (el: Element | null): boolean => {
      if (!el || el === document.documentElement) return false
      const known = hiddenMemo.get(el)
      if (known !== undefined) return known
      const s = style(el)
      const hidden = s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0 || el.getAttribute('aria-hidden') === 'true' || isHidden(el.parentElement)
      hiddenMemo.set(el, hidden)
      return hidden
    }
    const clipMemo = new Map<Element, boolean>()
    const insideClip = (el: Element | null): boolean => {
      if (!el || el === document.body || el === document.documentElement) return false
      const known = clipMemo.get(el)
      if (known !== undefined) return known
      const s = style(el)
      const clipped = s.overflowX !== 'visible' || s.position === 'fixed' || s.contain.includes('paint') || insideClip(el.parentElement)
      clipMemo.set(el, clipped)
      return clipped
    }
    const clippedOrFixed = (el: Element) => style(el).position === 'fixed' || insideClip(el.parentElement)

    // 1. The page itself must not scroll sideways (what a user would feel as a wobbly page).
    const startY = window.scrollY
    window.scrollTo(200, startY)
    if (window.scrollX > 0) findings.push({ what: `page scrolls sideways by ${Math.round(window.scrollX)}px`, where: `viewport ${vw}px` })
    window.scrollTo(0, startY)

    const all = [...document.body.querySelectorAll('*')]
    for (const el of all) {
      if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      // 2. Nothing visible may stick out past the left or right edge.
      if ((r.right > vw + 1 || r.left < -1) && !clippedOrFixed(el) && !isHidden(el)) {
        findings.push({ what: `sticks out ${Math.round(r.right > vw + 1 ? r.right - vw : -r.left)}px past the ${r.right > vw + 1 ? 'right' : 'left'} edge`, where: describe(el) })
      }
    }

    // 3. Headings, buttons and links must fit their own box (long words, fixed widths).
    for (const el of document.body.querySelectorAll('h1, h2, h3, button, .primary-button, .apply-button')) {
      if (el.scrollWidth <= el.clientWidth + 2 || isHidden(el)) continue
      const s = style(el)
      if (s.overflowX !== 'visible' || s.textOverflow === 'ellipsis' || s.whiteSpace === 'nowrap') continue
      if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) findings.push({ what: `text spills out of its box by ${el.scrollWidth - el.clientWidth}px`, where: describe(el) })
    }

    // 4. No broken images.
    for (const img of document.images) {
      if (img.complete && img.currentSrc && img.naturalWidth === 0 && !isHidden(img)) findings.push({ what: 'image failed to load', where: img.currentSrc.replace(location.origin, '') })
    }

    // Report each element once; nested children of one offender add noise.
    const seen = new Set<string>()
    return findings.filter((f) => (seen.has(f.what + f.where) ? false : (seen.add(f.what + f.where), true))).slice(0, 25)
  })
}

export async function expectCleanLayout(page: Page, label: string) {
  // Measure the settled layout, not a frame in the middle of a transition (e.g. a rotating dropdown arrow).
  await page
    .waitForFunction(
      () =>
        document
          .getAnimations()
          .every((a) => a.playState !== 'running' || a.effect?.getComputedTiming().iterations === Infinity),
      undefined,
      { timeout: 3000 },
    )
    .catch(() => undefined)
  const problems = await findLayoutProblems(page)
  expect(problems, `${label}:\n${problems.map((p) => `  • ${p.what} — ${p.where}`).join('\n')}`).toEqual([])
}

/** Header: logo visible and the right navigation for the screen width, all inside the screen. */
export async function expectNavbar(page: Page) {
  const vw = page.viewportSize()!.width
  const vh = page.viewportSize()!.height
  const banner = page.getByRole('banner').first()
  await expect(banner).toBeVisible()
  await expect(banner.getByRole('img', { name: 'Dekko ISHO Group' }).first()).toBeInViewport()

  const box = (await banner.boundingBox())!
  expect(box.width, 'header is wider than the screen').toBeLessThanOrEqual(vw + 1)
  // A fixed header must leave most of a short landscape phone screen for content.
  expect(box.height, `header takes ${Math.round((box.height / vh) * 100)}% of the screen height`).toBeLessThanOrEqual(Math.max(96, vh * 0.3))

  const menuButton = page.getByRole('button', { name: 'Open menu' })
  const desktopNav = banner.locator('nav.nav-menu')
  if (vw <= MOBILE_NAV_MAX) {
    await expect(menuButton).toBeInViewport()
    await expect(desktopNav).toHaveCount(0)
    const tap = (await menuButton.boundingBox())!
    expect(Math.min(tap.width, tap.height), 'menu button is too small to tap').toBeGreaterThanOrEqual(24)
  } else {
    await expect(desktopNav).toBeVisible()
    for (const link of await desktopNav.locator(':scope > a, :scope > div > button, :scope > div > a').all()) {
      await expect(link).toBeInViewport({ ratio: 1 })
    }
  }
}
