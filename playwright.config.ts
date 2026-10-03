import { defineConfig, devices } from '@playwright/test'
import { layoutProjects } from './e2e/devices'

/**
 * End-to-end suite. Run with `npm run test:e2e`, which starts throwaway emulators on the test ports
 * and seeds them first; these servers then run against that state on ports that never clash with dev.
 * The website and HR portal are served as production builds, so the tests see what ships.
 *
 * - `functional`: core flows on desktop Chrome (apply, HR publish, CV bank, contact form…)
 * - one project per device + orientation: layout checks and screenshot comparisons (runs after `functional`,
 *   so the data on screen is the same every run)
 */
export const PORTS = { api: 8795, web: 5185, hr: 5186 }

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  workers: process.env.CI ? 2 : '50%',
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled', caret: 'hide', scale: 'css' },
  },
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{arg}{ext}',
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${PORTS.web}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'functional',
      testMatch: /(site|careers|hr)\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    ...layoutProjects({ testMatch: /(layout|visual)\.spec\.ts/, dependencies: ['functional'] }),
  ],
  webServer: [
    {
      command: 'API_ENV_FILE=test/test.env npx tsx src/server.ts',
      cwd: 'apps/api',
      url: `http://localhost:${PORTS.api}/api/health`,
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: `npx vite build --mode e2e --outDir dist-e2e --emptyOutDir --logLevel warn && npx vite preview --mode e2e --outDir dist-e2e --host localhost --port ${PORTS.web} --strictPort`,
      cwd: 'apps/web',
      url: `http://localhost:${PORTS.web}`,
      reuseExistingServer: false,
      timeout: 180_000,
    },
    {
      command: `npx vite build --mode e2e --outDir dist-e2e --emptyOutDir --logLevel warn && npx vite preview --mode e2e --outDir dist-e2e --host localhost --port ${PORTS.hr} --strictPort`,
      cwd: 'apps/hr-admin',
      url: `http://localhost:${PORTS.hr}/hr/admin/`,
      reuseExistingServer: false,
      timeout: 180_000,
    },
  ],
})
