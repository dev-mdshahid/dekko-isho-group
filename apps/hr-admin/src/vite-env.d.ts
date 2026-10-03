/// <reference types="vite/client" />

declare const __APP_VERSION__: string
declare const __FIREBASE_CONFIG__: { apiKey: string; authDomain: string; projectId: string; appId: string }

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_FIREBASE_AUTH_EMULATOR_HOST?: string
}
