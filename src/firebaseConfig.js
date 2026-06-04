import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD1UaB_w9CAJYFTIMS1EpQh0niQ24dK10c',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'sol-menu.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'sol-menu',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'sol-menu.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1091037473356',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1091037473356:web:6626a9e21bc72c0edee2e9',
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.appId
)

export const firebaseApp = isFirebaseConfigured
  ? initializeApp(firebaseConfig)
  : null

export const db = isFirebaseConfigured ? getFirestore(firebaseApp) : null
export const storage = isFirebaseConfigured ? getStorage(firebaseApp) : null
