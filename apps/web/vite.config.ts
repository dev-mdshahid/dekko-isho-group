import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

const { version } = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as { version: string }

// https://vite.dev/config/
export default defineConfig({
  envPrefix: ['VITE_', 'SUSTAINABILITY_'],
  define: { __APP_VERSION__: JSON.stringify(version) },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
