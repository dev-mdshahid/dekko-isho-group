import { readFileSync } from 'node:fs'
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { config } from '../config.js'

let app: App | undefined
let db: Firestore | undefined

export function firebaseApp(): App {
  if (app) return app
  if (getApps().length) {
    app = getApps()[0]
    return app
  }
  if (config.firebase.useEmulators) {
    if (!config.firebase.projectId.startsWith('demo-')) {
      throw new Error(`Emulators must use a demo- project id, got "${config.firebase.projectId}"`)
    }
    app = initializeApp({ projectId: config.firebase.projectId })
  } else {
    if (!config.firebase.credentialsPath) throw new Error('GOOGLE_APPLICATION_CREDENTIALS is required outside the emulators')
    const serviceAccount = JSON.parse(readFileSync(config.firebase.credentialsPath, 'utf8'))
    if (serviceAccount.project_id !== config.firebase.projectId) {
      throw new Error(
        `Service account is for "${serviceAccount.project_id}" but FIREBASE_PROJECT_ID is "${config.firebase.projectId}"`,
      )
    }
    app = initializeApp({ credential: cert(serviceAccount), projectId: config.firebase.projectId })
  }
  return app
}

export function firestore(): Firestore {
  if (db) return db
  db = getFirestore(firebaseApp())
  db.settings({ ignoreUndefinedProperties: true })
  return db
}

export function auth() {
  return getAuth(firebaseApp())
}

export const nowIso = () => new Date().toISOString()
