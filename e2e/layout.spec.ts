import { expect, test, type Page } from '@playwright/test'
import { expectCleanLayout, expectNavbar, layoutOf, MOBILE_NAV_MAX, scrollThrough, settle, skipSplash } from './layout-checks'
import { HR, hrLogin, MARKETING_ROUTES, trackErrors, VERSION } from './support'

const PAGES = [...MARKETING_ROUTES, '/career/jobs/software-engineer', '/404']

async function checkWholePage(page: Page, route: string) {
  await settle(page)
  await expectNavbar(page)
  await expectCleanLayout(page, `${route} (top of page)`)
  await scrollThrough(page)
  await expectCleanLayout(page, `${route} (scrolled to the bottom)`)
  const version = page.getByTestId('app-version')
  await version.scrollIntoViewIfNeeded()
  await expect(version).toHaveText(`v${VERSION}`)
  await expect(version).toBeInViewport()
}

test.beforeEach(async ({ page }, info) => {
  if (!info.tags.includes('@splash')) await skipSplash(page)
})

test('intro splash plays and reveals the home page', { tag: '@splash' }, async ({ page }) => {
  const tracker = trackErrors(page)
  await page.goto('/')
  await settle(page)
  await expect(page.locator('#boot-splash')).toBeHidden()
  await expectNavbar(page)
  await expectCleanLayout(page, 'home after the intro')
  tracker.expectNone()
})

test.describe('page layout', () => {
  for (const route of PAGES) {
    test(`${route} fits the screen`, async ({ page }) => {
      const tracker = trackErrors(page)
      await page.goto(route)
      await checkWholePage(page, route)
      tracker.expectNone()
    })
  }
})

test.describe('navigation', () => {
  test('menu opens, fits the screen and closes', async ({ page }) => {
    await page.goto('/')
    await settle(page)
    const vw = page.viewportSize()!.width

    if (vw <= MOBILE_NAV_MAX) {
      await page.getByRole('button', { name: 'Open menu' }).click()
      const drawer = page.getByRole('dialog', { name: 'Navigation menu' })
      await expect(drawer).toBeVisible()
      const box = (await drawer.boundingBox())!
      expect(box.x).toBeGreaterThanOrEqual(-1)
      expect(box.x + box.width).toBeLessThanOrEqual(vw + 1)
      await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')

      await drawer.getByRole('button', { name: 'Apparel Solutions' }).click()
      const sublink = drawer.getByRole('link', { name: /manufacturing/i }).first()
      await sublink.scrollIntoViewIfNeeded()
      await expect(sublink).toBeInViewport()
      await expectCleanLayout(page, 'open menu')

      await page.keyboard.press('Escape')
      await expect(drawer).toBeHidden()
      await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
    } else {
      const nav = page.getByRole('banner').first().locator('nav.nav-menu')
      await nav.getByRole('button', { name: 'Apparel Solutions' }).click()
      const sublink = page.getByRole('banner').first().getByRole('link', { name: /manufacturing/i }).first()
      await expect(sublink).toBeVisible()
      await expect(sublink).toBeInViewport({ ratio: 1 })
      await expectCleanLayout(page, 'open dropdown')
      await page.keyboard.press('Escape')
      await expect(sublink).toBeHidden()
    }
  })

  test('menu links take you to the page', async ({ page }) => {
    await page.goto('/')
    await settle(page)
    if (page.viewportSize()!.width <= MOBILE_NAV_MAX) {
      await page.getByRole('button', { name: 'Open menu' }).click()
      await page.getByRole('dialog', { name: 'Navigation menu' }).getByRole('link', { name: 'Sustainability' }).click()
    } else {
      await page.getByRole('banner').first().getByRole('link', { name: 'Sustainability' }).click()
    }
    await expect(page).toHaveURL(/\/sustainability$/)
    await expect(page.getByRole('dialog', { name: 'Navigation menu' })).toHaveCount(0)
  })
})

test.describe('rotating the device', () => {
  test('layout re-flows from portrait to landscape and back', async ({ page }, info) => {
    test.skip(layoutOf(info).orientation !== 'portrait', 'rotation starts from portrait')
    const portrait = page.viewportSize()!
    const landscape = { width: portrait.height, height: portrait.width }

    for (const route of ['/', '/career/jobs', '/career/jobs/software-engineer']) {
      await page.setViewportSize(portrait)
      await page.goto(route)
      await settle(page)
      const menuOpenBefore = portrait.width <= MOBILE_NAV_MAX
      if (menuOpenBefore) await page.getByRole('button', { name: 'Open menu' }).click()

      await page.setViewportSize(landscape)
      await page.waitForTimeout(400)
      // Crossing into the desktop layout closes the phone/tablet menu on its own.
      if (menuOpenBefore && landscape.width > MOBILE_NAV_MAX) await expect(page.getByRole('dialog', { name: 'Navigation menu' })).toHaveCount(0)
      if (menuOpenBefore && landscape.width <= MOBILE_NAV_MAX) await page.keyboard.press('Escape')
      await expectNavbar(page)
      await expectCleanLayout(page, `${route} after rotating to landscape`)

      await page.setViewportSize(portrait)
      await page.waitForTimeout(400)
      await expectNavbar(page)
      await expectCleanLayout(page, `${route} after rotating back to portrait`)
    }
  })
})

test.describe('careers on this screen', () => {
  test('filters are reachable and the application form fits', async ({ page }) => {
    await page.goto('/career/jobs')
    await settle(page)
    await expect(page.locator('.careers-results-count')).toHaveText(/\d+ roles?/)
    const sidebar = page.getByRole('complementary', { name: 'Filter roles' })
    if (await sidebar.isVisible()) {
      await expect(sidebar.getByRole('checkbox', { name: /^Manufacturing/ })).toBeVisible()
    } else {
      await page.getByRole('button', { name: /^Filters/ }).click()
      const drawer = page.getByRole('dialog')
      await expect(drawer).toBeVisible()
      const box = (await drawer.boundingBox())!
      expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1)
      await expect(drawer.getByRole('checkbox', { name: /^Manufacturing/ })).toBeVisible()
      await drawer.getByRole('button', { name: 'Close filters' }).click()
    }

    await page.goto('/career/jobs/software-engineer')
    await settle(page)
    const submit = page.getByRole('button', { name: 'Submit application' })
    await submit.scrollIntoViewIfNeeded()
    await expect(submit).toBeInViewport()
    const vw = page.viewportSize()!.width
    for (const input of await page.locator('.apply-form input:visible, .apply-form textarea:visible, .apply-form select:visible').all()) {
      const box = await input.boundingBox()
      if (box) expect(box.x + box.width, 'a form field runs off the screen').toBeLessThanOrEqual(vw + 1)
    }
    await expectCleanLayout(page, 'application form')
  })
})

test.describe('HR portal on this screen', () => {
  test('sign-in page fits', async ({ page }) => {
    await page.goto(`${HR}/login`)
    await expect(page.getByLabel('Work email')).toBeInViewport()
    const submit = page.getByRole('button', { name: /sign in/i })
    await submit.scrollIntoViewIfNeeded()
    await expect(submit).toBeInViewport({ ratio: 1 })
    await expectCleanLayout(page, 'HR sign-in')
  })

  test('main screens fit and the menu works', async ({ page }) => {
    await hrLogin(page)
    for (const path of ['/', '/circulars', '/cv-bank', '/circulars/new']) {
      await page.goto(`${HR}${path}`)
      await page.waitForLoadState('networkidle')
      await expectCleanLayout(page, `HR ${path}`)
    }
    const menu = page.getByRole('button', { name: 'Open menu' })
    if (await menu.isVisible()) {
      await menu.click()
      const sidebar = page.getByRole('complementary', { name: 'Main navigation' })
      await expect(sidebar.getByRole('link', { name: 'CV Bank' })).toBeInViewport()
      await sidebar.getByRole('link', { name: 'CV Bank' }).click()
      await expect(page).toHaveURL(/\/cv-bank$/)
    } else {
      await expect(page.getByRole('complementary', { name: 'Main navigation' }).getByRole('link', { name: 'CV Bank' })).toBeInViewport()
    }
  })
})
