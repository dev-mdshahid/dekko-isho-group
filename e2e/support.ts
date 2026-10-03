import { readFileSync } from 'node:fs'
import { expect, type Page } from '@playwright/test'

export const API = 'http://localhost:8795'
export const HR = 'http://localhost:5186/hr/admin'
export const ADMIN = { email: 'e2e-admin@test.local', password: 'Test-Passw0rd!' }
export const CV_PDF = new URL('../apps/api/test/fixtures/cv.pdf', import.meta.url).pathname
export const MARKETING_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/gallery',
  '/news',
  '/press',
  '/press/dekko-isho-invested-in-fashol',
  '/awards',
  '/career',
  '/career/jobs',
  '/sustainability',
  '/solutions/manufacturing',
  '/solutions/embroidery',
  '/solutions/industrial-laundry',
  '/solutions/compliance-sustainability',
  '/solutions/design-product-development',
  '/solutions/technology-integration',
  '/dekko-isho',
  '/dekko-garments',
  '/dekko-readywares',
  '/dekko-fashions',
  '/isho-ltd',
  '/klubhaus',
  '/izakaya',
]

export const VERSION = (JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { version: string }).version

/** Fails the test on uncaught page errors and console errors (third-party noise excluded). */
export function trackErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return
    const text = msg.text()
    if (/Failed to load resource|favicon|googletagmanager|google-analytics|challenges\.cloudflare/i.test(text)) return
    errors.push(`console: ${text}`)
  })
  return {
    errors,
    expectNone: () => expect(errors, errors.join('\n')).toEqual([]),
  }
}

/** Applies to a live role through the careers site with the fixture CV; returns the reference shown. */
export async function applyToRole(page: Page, title: string) {
  await page.goto('/career/jobs')
  await page.getByRole('link', { name: title }).click()
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible()
  const chooser = page.waitForEvent('filechooser')
  await page.getByText('Choose a file').click()
  await (await chooser).setFiles(CV_PDF)
  await expect(page.getByText('cv.pdf')).toBeVisible({ timeout: 30_000 })
  await expect(page.getByLabel(/^Full name/)).toHaveValue('Rahim Uddin Ahmed')
  await page.getByLabel(/^Total years of experience/).fill('6')
  await page.getByLabel(/^I agree that Dekko ISHO Group/).check()
  await page.getByRole('button', { name: 'Submit application' }).click()
  const success = page.getByRole('status').filter({ hasText: 'Application sent' })
  await expect(success).toBeVisible()
  return (await success.locator('dd').textContent())?.trim() ?? ''
}

export async function hrLogin(page: Page) {
  await page.goto(`${HR}/login`)
  await page.getByLabel('Work email').fill(ADMIN.email)
  await page.getByLabel('Password').fill(ADMIN.password)
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page).not.toHaveURL(/\/login/)
}
