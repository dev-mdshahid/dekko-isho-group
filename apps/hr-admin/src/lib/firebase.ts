import { initializeApp } from 'firebase/app'
import { browserLocalPersistence, connectAuthEmulator, getAuth, setPersistence } from 'firebase/auth'

const emulatorHost = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST

const app = initializeApp(
  emulatorHost
    ? { apiKey: 'demo-key', authDomain: 'localhost', projectId: 'demo-dekko-isho' }
    : __FIREBASE_CONFIG__,
)

export const auth = getAuth(app)
void setPersistence(auth, browserLocalPersistence)

if (emulatorHost) connectAuthEmulator(auth, `http://${emulatorHost}`, { disableWarnings: true })
