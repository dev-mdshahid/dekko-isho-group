/// <reference types="vite/client" />

declare const __APP_VERSION__: string

interface ImportMetaEnv {
  readonly SUSTAINABILITY_REPORT_2025_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
