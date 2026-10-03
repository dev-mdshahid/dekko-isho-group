import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const { version } = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')) as { version: string }

// The Firebase web config already lives in the website's .env (FIREBASE_*); reuse it.
export default defineConfig(({ mode }) => {
  const web = loadEnv(mode, fileURLToPath(new URL('../web', import.meta.url)), 'FIREBASE_')
  const firebaseConfig = {
    apiKey: web.FIREBASE_API_KEY ?? '',
    authDomain: web.FIREBASE_AUTH_DOMAIN ?? '',
    projectId: web.FIREBASE_PROJECT_ID ?? '',
    appId: web.FIREBASE_APP_ID ?? '',
  }
  return {
    base: '/hr/admin/',
    plugins: [react()],
    define: { __FIREBASE_CONFIG__: JSON.stringify(firebaseConfig), __APP_VERSION__: JSON.stringify(version) },
    build: {
      outDir: fileURLToPath(new URL('../web/dist/hr/admin', import.meta.url)),
      emptyOutDir: true,
      sourcemap: false,
    },
  }
})
