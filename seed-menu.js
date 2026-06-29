import 'dotenv/config'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { defaultSections } from './src/seedMenuData.js'

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyD1UaB_w9CAJYFTIMS1EpQh0niQ24dK10c',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'sol-menu.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'sol-menu',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'sol-menu.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1091037473356',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:1091037473356:web:6629e21bc72c0edee2e9',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const normalizeSections = (sections) =>
  sections.map((section) => ({
    ...section,
    items: (section.items || []).map((item) => ({
      name: item.name || 'New item',
      description: item.description || '',
      calories: item.calories || '',
      price: item.price || '',
      icons: item.icons || [],
      image: item.image || '',
      visible: item.visible === false ? false : true,
      allergens: item.allergens || [],
    })),
  }))

const run = async () => {
  const menuDocRef = doc(db, 'menu', 'default')

  await setDoc(
    menuDocRef,
    {
      sections: normalizeSections(defaultSections),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )

  console.log('Menu sections uploaded to Firestore: menu/default')
}

run().catch((error) => {
  console.error('Seed script failed:', error)
  process.exit(1)
})