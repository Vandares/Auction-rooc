import 'dotenv/config'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, getDocs, writeBatch, setDoc } from 'firebase/firestore'
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
const menuItemsCollection = collection(db, 'menuItems')

const sanitizeId = (value) =>
  String(value)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const itemsToSeed = defaultSections.flatMap((section, sectionIndex) =>
  (section.items || []).map((item, itemIndex) => ({
    ...item,
    sectionTitle: section.title,
    sectionOrder: sectionIndex,
    itemOrder: itemIndex,
  }))
)

const clearExistingCollection = async () => {
  const snapshot = await getDocs(menuItemsCollection)
  if (snapshot.empty) return

  const batch = writeBatch(db)
  snapshot.docs.forEach((docSnapshot) => {
    batch.delete(docSnapshot.ref)
  })
  await batch.commit()
}

const run = async () => {
  if (itemsToSeed.length === 0) {
    console.log('No menu items found in seed data. Nothing to upload.')
    return
  }

  console.log(`Seeding ${itemsToSeed.length} menu item(s) to Firestore collection 'menuItems'...`)
  await clearExistingCollection()

  for (const item of itemsToSeed) {
    const itemId = sanitizeId(`${item.sectionTitle}-${item.itemOrder}-${item.name || 'item'}`)
    const itemRef = doc(menuItemsCollection, itemId)
    await setDoc(itemRef, item)
  }

  console.log('Seed complete.')
}

run().catch((error) => {
  console.error('Seed script failed:', error)
  process.exit(1)
})
