import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    env: { API_ENV_FILE: 'test/test.env' },
    // Integration files share one emulator; running them one at a time keeps resets predictable.
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 30_000,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/server.ts', 'src/email/samples.ts'],
      reporter: ['text-summary', 'html'],
      thresholds: { statements: 80, branches: 60, functions: 80, lines: 85 },
    },
  },
})
