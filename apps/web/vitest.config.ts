import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.{ts,tsx}'],
      setupFiles: ['src/test/setup.ts'],
      env: { VITE_API_BASE_URL: 'http://api.test', VITE_TURNSTILE_SITE_KEY: '' },
      coverage: {
        provider: 'v8',
        reporter: ['text-summary', 'html'],
        // Business logic and the careers flow. Marketing pages are covered by the Playwright smoke tests.
        include: [
          'src/lib/api.ts',
          'src/hooks/useMediaQuery.ts',
          'src/hooks/useNavMenu.ts',
          'src/components/layout/Navbar.tsx',
          'src/lib/careersApi.ts',
          'src/lib/forms.ts',
          'src/lib/useTurnstile.ts',
          'src/lib/version.ts',
          'src/pages/careers/**/*.{ts,tsx}',
          'src/components/common/Turnstile.tsx',
        ],
        exclude: ['src/**/*.test.{ts,tsx}', 'src/pages/careers/CareerRoutes.tsx'],
        thresholds: { statements: 89, branches: 81, functions: 90, lines: 95 },
      },
    },
  }),
)
