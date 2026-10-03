import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default defineConfig((env) =>
  mergeConfig(
    viteConfig(env),
    defineConfig({
      test: {
        environment: 'jsdom',
        include: ['src/**/*.test.{ts,tsx}'],
        setupFiles: ['src/test/setup.ts'],
        env: { VITE_API_BASE_URL: 'http://api.test', TZ: 'UTC' },
        coverage: {
          provider: 'v8',
          reporter: ['text-summary', 'html'],
          // Shared logic and the form builder. Screens are covered by the Playwright tests.
          include: ['src/lib/**/*.{ts,tsx}', 'src/components/FormBuilder.tsx', 'src/components/Layout.tsx'],
          exclude: ['src/**/*.test.{ts,tsx}', 'src/lib/firebase.ts'],
          thresholds: { statements: 90, branches: 85, functions: 90, lines: 95 },
        },
      },
    }),
  ),
)
