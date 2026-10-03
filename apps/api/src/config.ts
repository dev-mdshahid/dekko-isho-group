import dotenv from 'dotenv'

// The app's .env wins over variables exported by the shell (other projects often export FIREBASE_PROJECT_ID).
// API_ENV_FILE points tests at a committed env file so a developer's real .env is never used.
dotenv.config({ path: process.env.API_ENV_FILE || '.env', override: true, quiet: true } as dotenv.DotenvConfigOptions)

function list(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function bool(value: string | undefined, fallback = false): boolean {
  if (value == null || value === '') return fallback
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase())
}

const env = process.env
const isProd = env.NODE_ENV === 'production'

export const config = {
  isProd,
  port: Number(env.PORT || 8794),
  host: env.HOST || (isProd ? '127.0.0.1' : 'localhost'),
  logLevel: env.LOG_LEVEL || (isProd ? 'info' : 'debug'),

  /** Public website origin (links in emails, share redirects). */
  siteUrl: (env.PUBLIC_SITE_URL || 'http://localhost:5173').replace(/\/$/, ''),
  /** HR portal origin + base path. */
  hrPortalUrl: (env.HR_PORTAL_URL || 'http://localhost:5174/hr/admin').replace(/\/$/, ''),
  /** This API's public origin (media and share URLs). */
  apiPublicUrl: (env.API_PUBLIC_URL || `http://localhost:${env.PORT || 8794}`).replace(/\/$/, ''),
  corsOrigins: list(env.CORS_ORIGINS).length
    ? list(env.CORS_ORIGINS)
    : ['http://localhost:5173', 'http://localhost:5174'],

  firebase: {
    projectId: env.FIREBASE_PROJECT_ID || 'demo-dekko-isho',
    /** Path to the service account JSON. Not needed when using emulators. */
    credentialsPath: env.GOOGLE_APPLICATION_CREDENTIALS || '',
    useEmulators: Boolean(env.FIRESTORE_EMULATOR_HOST),
  },

  storage: {
    driver: (env.STORAGE_DRIVER || (env.B2_KEY_ID ? 'b2' : 'local')) as 'b2' | 'local',
    localDir: env.LOCAL_STORAGE_DIR || '.storage',
    b2: {
      keyId: env.B2_KEY_ID || '',
      applicationKey: env.B2_APPLICATION_KEY || '',
      bucketId: env.B2_BUCKET_ID || '',
      bucketName: env.B2_BUCKET_NAME || '',
      prefix: (env.B2_PREFIX || 'hr-main-website/').replace(/^\/+/, ''),
    },
    signingSecret: env.FILE_SIGNING_SECRET || 'dev-only-signing-secret',
  },

  openai: {
    apiKey: env.OPENAI_API_KEY || '',
    textModel: env.OPENAI_CV_MODEL || 'gpt-4o-mini',
    visionModel: env.OPENAI_CV_VISION_MODEL || 'gpt-4o',
    store: bool(env.OPENAI_RESPONSES_STORE, false),
  },

  turnstile: {
    secret: env.TURNSTILE_SECRET || '',
  },

  mail: {
    enabled: Boolean(env.MAIL_USER && env.MAIL_APP_PASSWORD) && !bool(env.MAIL_DISABLED),
    contactInbox: env.CONTACT_INBOX || 'connect@dekkoisho.com',
  },

  cvParseConcurrency: Number(env.CV_PARSE_CONCURRENCY || 2),
  cronEnabled: bool(env.CRON_ENABLED, true),
  timezone: env.TZ_DISPLAY || 'Asia/Dhaka',
}

export type AppConfig = typeof config

/** Settings that must never reach production; the server refuses to start while any are present. */
export function productionConfigProblems(c: AppConfig = config, e: NodeJS.ProcessEnv = env): string[] {
  if (!c.isProd) return []
  const problems: string[] = []
  const secret = c.storage.signingSecret
  if (secret === 'dev-only-signing-secret' || secret.length < 32) problems.push('FILE_SIGNING_SECRET is missing or too short')
  if (e.FIRESTORE_EMULATOR_HOST || e.FIREBASE_AUTH_EMULATOR_HOST) problems.push('emulator hosts are set')
  if (c.firebase.projectId.startsWith('demo-')) problems.push('FIREBASE_PROJECT_ID is a demo project')
  if (c.storage.driver !== 'b2') problems.push('STORAGE_DRIVER must be b2')
  else if (!c.storage.b2.keyId || !c.storage.b2.applicationKey || !c.storage.b2.bucketId || !c.storage.b2.bucketName) problems.push('Backblaze B2 settings are incomplete')
  return problems
}
