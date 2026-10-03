import { expect, test } from '@playwright/test'
import { settle } from './layout-checks'
import { HR } from './support'

/**
 * Screenshot comparison of the first screen of key pages on every device and orientation.
 * Baselines live in e2e/__screenshots__/<device>/; after an intended design change, review and refresh them with
 * `npm run test:e2e:update-screenshots`.
 */
test.use({ contextOptions: { reducedMotion: 'reduce' } })

const PAGES: Array<[name: string, path: string]> = [
  ['home', '/'],
  ['about', '/about'],
  ['career-jobs', '/career/jobs'],
  ['career-role', '/career/jobs/software-engineer'],
  ['contact', '/contact'],
  ['not-found', '/404'],
]

test.describe('looks right', () => {
  for (const [name, path] of PAGES) {
    test(name, async ({ page }) => {
      await page.goto(path)
      await settle(page)
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot(`${name}.png`, {
        // Moving media and the release number change between runs; everything else must match.
        mask: [page.locator('video, iframe, canvas, [data-testid="app-version"], .marquee, [class*="marquee"]')],
      })
    })
  }

  test('hr-sign-in', async ({ page }) => {
    await page.goto(`${HR}/login`)
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('hr-sign-in.png')
  })
})
