import { expect, test } from '@playwright/test'
import { CV_PDF, trackErrors } from './support'

test.describe('careers', () => {
  test('lists open roles and filters them', async ({ page }) => {
    const tracker = trackErrors(page)
    await page.goto('/career/jobs')
    const cards = page.locator('article.careers-card')
    await expect(page.getByRole('link', { name: 'Software Engineer' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Production Supervisor' })).toBeVisible()

    const sidebar = page.getByRole('complementary', { name: 'Filter roles' })
    await sidebar.getByRole('checkbox', { name: /^Manufacturing/ }).click()
    await expect(page).toHaveURL(/dept=manufacturing/)
    await expect(cards.filter({ hasText: 'Production Supervisor' })).toHaveCount(1)
    await expect(cards.filter({ hasText: 'Software Engineer' })).toHaveCount(0)

    await sidebar.getByRole('button', { name: 'Clear all' }).click()
    await page.getByPlaceholder('Search by job title, skill or keyword').fill('software')
    await expect(cards).toHaveCount(1)
    await expect(cards.first()).toContainText('Software Engineer')

    await page.getByPlaceholder('Search by job title, skill or keyword').fill('astronaut')
    await expect(page.getByRole('heading', { name: 'No roles match your search' })).toBeVisible()
    tracker.expectNone()
  })

  test('career page shows the latest open roles', async ({ page }) => {
    const tracker = trackErrors(page)
    await page.goto('/career')
    const section = page.locator('#open-positions')
    await section.scrollIntoViewIfNeeded()
    const rows = section.locator('.career-position-row')
    await expect(rows.filter({ hasText: 'Software Engineer' })).toHaveCount(1)
    // Playwright treats opacity 0 as visible, so check the fade-in actually finished.
    for (const row of await rows.all()) {
      await row.scrollIntoViewIfNeeded()
      await expect(row).toHaveCSS('opacity', '1')
    }
    await section.getByRole('link', { name: /Software Engineer/ }).click()
    await expect(page).toHaveURL(/\/career\/jobs\/software-engineer$/)
    tracker.expectNone()
  })

  test('candidate applies with a CV and gets a reference', async ({ page }) => {
    const tracker = trackErrors(page)
    await page.goto('/career/jobs')
    await page.getByRole('link', { name: 'Software Engineer' }).click()
    await expect(page.getByRole('heading', { level: 1, name: 'Software Engineer' })).toBeVisible()

    // Submitting empty shows what is missing.
    await page.getByRole('button', { name: 'Submit application' }).click()
    await expect(page.getByText(/Please check the \d+ highlighted fields below/)).toBeVisible()

    // Clicking the drop zone opens the file picker.
    const chooser = page.waitForEvent('filechooser')
    await page.getByText('Choose a file').click()
    await (await chooser).setFiles(CV_PDF)
    await expect(page.getByText('cv.pdf')).toBeVisible({ timeout: 30_000 })

    await expect(page.getByLabel(/^Full name/)).toHaveValue('Rahim Uddin Ahmed')
    await expect(page.getByLabel(/^Email/)).toHaveValue('rahim.ahmed@example.com')

    await page.getByLabel(/^Total years of experience/).fill('6')
    await page.getByLabel(/^I agree that Dekko ISHO Group/).check()
    await page.getByRole('button', { name: 'Submit application' }).click()

    const success = page.getByRole('status').filter({ hasText: 'Application sent' })
    await expect(success).toBeVisible()
    await expect(success.locator('dd')).toHaveText(/\S+/)
    tracker.expectNone()
  })

  test('unknown role shows the not-found page', async ({ page }) => {
    await page.goto('/career/jobs/no-such-role')
    await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible()
  })
})
