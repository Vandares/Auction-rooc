import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
)

export const firebaseApp = isFirebaseConfigured
  ? initializeApp(firebaseConfig)
  : null

export const db = isFirebaseConfigured ? getFirestore(firebaseApp) : null
export const auth = isFirebaseConfigured ? getAuth(firebaseApp) : null

// Only the admin image upload touches Storage, so its SDK is fetched on demand
// instead of shipping in the bundle every customer downloads.
let storagePromise = null

export const getFirebaseStorage = () => {
  if (!firebaseApp) return Promise.resolve(null)

  if (!storagePromise) {
    storagePromise = import('firebase/storage').then(({ getStorage }) =>
      getStorage(firebaseApp)
    )
  }

  return storagePromise
}

export const signInFirebaseAnon = async () => {
  if (!auth) return null
  try {
    const result = await signInAnonymously(auth)
    return result
  } catch (error) {
    console.error('Firebase anonymous auth failed', error)
    throw error
  }
}
