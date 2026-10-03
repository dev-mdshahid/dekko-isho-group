import { expect, test } from '@playwright/test'
import { MARKETING_ROUTES, trackErrors, VERSION } from './support'

test.describe('marketing site', () => {
  test('home page shows the current version in the footer', async ({ page }) => {
    const tracker = trackErrors(page)
    await page.goto('/')
    await expect(page.getByTestId('app-version')).toHaveText(`v${VERSION}`)
    tracker.expectNone()
  })

  for (const route of MARKETING_ROUTES) {
    test(`renders ${route}`, async ({ page }) => {
      const tracker = trackErrors(page)
      const res = await page.goto(route, { waitUntil: 'load' })
      expect(res?.ok()).toBe(true)
      await expect(page.locator('#Footer')).toBeAttached()
      await expect(page.getByRole('heading', { name: 'Page Not Found' })).toHaveCount(0)
      tracker.expectNone()
    })
  }

  test('unknown pages show the 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')
    await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible()
  })

  test('old blog links redirect to press', async ({ page }) => {
    await page.goto('/blog')
    await expect(page).toHaveURL(/\/press$/)
  })

  test('contact form sends a message', async ({ page }) => {
    await page.goto('/contact')
    const form = page.locator('form[name="email-form"]')
    await form.getByPlaceholder('Full Name *').fill('Karim Hossain')
    await form.getByPlaceholder('Email *').fill('karim@example.com')
    await form.getByPlaceholder('Phone Number').fill('01711223344')
    await form.getByPlaceholder('Message *').fill('We would like to discuss a partnership.')
    await form.locator('button[type="submit"]').click()
    await expect(page.locator('.w-form', { has: form }).locator('.w-form-done')).toBeVisible()
  })
})
