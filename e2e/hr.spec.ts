import { expect, test } from '@playwright/test'
import { ADMIN, applyToRole, HR, hrLogin, trackErrors, VERSION } from './support'

test.describe('HR portal', () => {
  test('rejects a wrong password', async ({ page }) => {
    await page.goto(`${HR}/login`)
    await page.getByLabel('Work email').fill(ADMIN.email)
    await page.getByLabel('Password').fill('not-the-password')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('sends signed-out visitors to the login page', async ({ page }) => {
    await page.goto(`${HR}/cv-bank`)
    await expect(page).toHaveURL(/\/login/)
  })

  test('HR creates and publishes a circular that goes live on the careers site', async ({ page }) => {
    const tracker = trackErrors(page)
    await hrLogin(page)
    await expect(page.locator('.sidebar-version')).toHaveText(`v${VERSION}`)

    await page.goto(`${HR}/circulars/new`)
    await page.getByLabel(/^Job title/).fill('Merchandising Manager')
    await page.getByLabel(/^Department/).selectOption({ label: 'Manufacturing' })
    await page.getByLabel(/^Card summary/).fill('Lead buyer relationships for our knitwear lines.')
    await page.getByRole('button', { name: 'Publish' }).click()
    await expect(page.getByText('Live on the careers page')).toBeVisible()

    await page.goto('http://localhost:5185/career/jobs')
    await page.getByRole('link', { name: 'Merchandising Manager' }).click()
    await expect(page.getByRole('heading', { level: 1, name: 'Merchandising Manager' })).toBeVisible()
    tracker.expectNone()
  })

  test('applications show up in the CV bank and can be moved along', async ({ page }) => {
    await applyToRole(page, 'Production Supervisor')
    await hrLogin(page)
    await page.goto(`${HR}/cv-bank`)
    await page.getByLabel('Search by name, email or phone').fill('Rahim')
    const row = page.getByRole('row').filter({ hasText: 'Rahim Uddin Ahmed' }).first()
    await expect(row).toBeVisible()
    await row.click()

    await expect(page.getByRole('heading', { level: 1, name: 'Rahim Uddin Ahmed' })).toBeVisible()
    const stage = page.getByLabel('Stage')
    const options = await stage.locator('option').allTextContents()
    await stage.selectOption({ index: Math.min(1, options.length - 1) })
    await page.getByLabel('New note').fill('Strong backend background.')
    await page.getByRole('button', { name: /add note/i }).click()
    await expect(page.getByText('Strong backend background.')).toBeVisible()
  })
})
