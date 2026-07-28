import { useState, useEffect } from 'react'
import './App.css'
import { defaultSections } from './seedMenuData.js'
import {
  db,
  isFirebaseConfigured,
  signInFirebaseAnon,
  getFirebaseStorage,
} from './firebaseConfig'
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'

const allergenOptions = [
  { value: '🌾 Wheat', label: 'Wheat' },
  { value: '🥛 Milk', label: 'Milk' },
  { value: '🥚 Eggs', label: 'Eggs' },
  { value: '🥜 Tree Nuts', label: 'Tree Nuts' },
  { value: '🐟 Fish', label: 'Fish' },
  { value: '🦐 Shellfish', label: 'Shellfish' },
  { value: '🍞 Gluten', label: 'Gluten' },
  { value: '🌿 Soy', label: 'Soy' },
  { value: '🌻 Sesame', label: 'Sesame' },
  { value: '🥜 Peanuts', label: 'Peanuts' },
  { value: '🫘 Legumes', label: 'Legumes' },
]

const allergenNormalizeMap = {
  قمح: '🌾 Wheat',
  حليب: '🥛 Milk',
  بيض: '🥚 Eggs',
  مكسرات: '🥜 Tree Nuts',
  سمك: '🐟 Fish',
  قشريات: '🦐 Shellfish',
  جلوتين: '🍞 Gluten',
  صويا: '🌿 Soy',
  سمسم: '🌻 Sesame',
  '🌾 قمح': '🌾 Wheat',
  '🥛 حليب': '🥛 Milk',
  '🥚 بيض': '🥚 Eggs',
  '🥜 مكسرات': '🥜 Tree Nuts',
  '🐟 سمك': '🐟 Fish',
  '🦐 قشريات': '🦐 Shellfish',
  '🍞 جلوتين': '🍞 Gluten',
  '🌿 صويا': '🌿 Soy',
  '🌻 سمسم': '🌻 Sesame',
}

// Allergens are stored in English; these are the labels shown in Arabic mode.
const allergenArabicLabels = {
  '🌾 Wheat': '🌾 قمح',
  '🥛 Milk': '🥛 حليب',
  '🥚 Eggs': '🥚 بيض',
  '🥜 Tree Nuts': '🥜 مكسرات',
  '🐟 Fish': '🐟 سمك',
  '🦐 Shellfish': '🦐 قشريات',
  '🍞 Gluten': '🍞 جلوتين',
  '🌿 Soy': '🌿 صويا',
  '🌻 Sesame': '🌻 سمسم',
  '🥜 Peanuts': '🥜 فول سوداني',
  '🫘 Legumes': '🫘 بقوليات',
}

// Only the standard section names can be translated. Anything the admin types
// in is shown exactly as entered, in either language.
const sectionTitleArabic = {
  'BEST SELLERS': 'الأكثر مبيعاً',
  BREAKFAST: 'الإفطار',
  APPETIZERS: 'المقبلات',
  SALADS: 'السلطات',
  SANDWICHES: 'الساندويتشات',
  BURGERS: 'البرغر',
  'MAIN COURSES': 'الأطباق الرئيسية',
  'PASTA & PIZZA': 'الباستا والبيتزا',
  SIDES: 'الأطباق الجانبية',
  DESSERTS: 'الحلويات',
  'HOT DRINKS': 'المشروبات الساخنة',
  'COLD DRINKS': 'المشروبات الباردة',
  SMOOTHIES: 'السموذي',
  'FRESH JUICES': 'العصائر الطازجة',
  LUNCH: 'الغداء',
  DINNER: 'العشاء',
  // Renamed sections. The old keys above are kept so the Arabic labels stay
  // correct on any menu that has not been renamed yet.
  'FRESH FRUIT & JUICES': 'الفواكه والعصائر الطازجة',
  'ICED SMOOTHIES': 'سموذي مثلج',
  'SOL CREPERIE': 'سول كريبري',
}

const uiText = {
  en: {
    searchLabel: 'Search the menu',
    clearSearch: 'Clear search',
    noResultsTitle: 'Nothing matches that search',
    noResultsBody: 'Try a different word, or clear the search to see the full menu.',
    sectionsNav: 'Menu sections',
    kitchen: 'Sol Beach Kitchen',
    welcomeTitle: 'Welcome 👋',
    welcomeBody: 'Hi, welcome to Sol Beach Kitchen',
    closeLabel: 'Close',
    bestSeller: '★ Best Seller',
    rights: '© 2026 Sol Beach Resort. All rights reserved.',
    madeBy: 'Made by Sol Beach Resort',
    switchTo: 'العربية',
  },
  ar: {
    searchLabel: 'ابحث في القائمة',
    clearSearch: 'مسح البحث',
    noResultsTitle: 'لا توجد نتائج مطابقة',
    noResultsBody: 'جرّب كلمة أخرى، أو امسح البحث لعرض القائمة كاملة.',
    sectionsNav: 'أقسام القائمة',
    kitchen: 'مطبخ سول بيتش',
    welcomeTitle: 'أهلاً وسهلاً 👋',
    welcomeBody: 'مرحباً بك في مطبخ سول بيتش',
    closeLabel: 'إغلاق',
    bestSeller: '★ الأكثر مبيعاً',
    rights: '© 2026 منتجع سول بيتش. جميع الحقوق محفوظة.',
    madeBy: 'من إعداد منتجع سول بيتش',
    switchTo: 'English',
  },
}

const normalizeAllergenValue = (value) => {
  if (!value) return ''
  const trimmed = String(value).trim()
  return allergenNormalizeMap[trimmed] || trimmed
}

const normalizeAllergens = (allergens) =>
  Array.from(
    new Set(
      (Array.isArray(allergens) ? allergens : [allergens])
        .map(normalizeAllergenValue)
        .filter(Boolean)
    )
  )

const normalizeSavedSections = (sections) =>
  sections.map((section) => ({
    ...section,
    items: (section.items || []).map((item) => ({
      ...item,
      visible: item.visible === false ? false : true,
      allergens: normalizeAllergens(item.allergens),
    })),
  }))

const slugify = (title) =>
  String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Random half keeps two items created in the same millisecond apart.
const makeUniqueId = (prefix) => {
  const random =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)

  return `${slugify(prefix) || 'item'}-${Date.now().toString(36)}-${random}`
}

// Sections used to be addressed by their title, so a rename orphaned every
// item in them and two sections sharing a name were indistinguishable. Give
// each one a stable id, derived from the title only when it does not already
// have one, so existing saved menus keep working untouched.
const withSectionIds = (sections) => {
  const used = new Set()

  sections.forEach((section) => {
    if (section?.id) used.add(section.id)
  })

  return sections.map((section, sectionIndex) => {
    if (section?.id) return section

    const base = `sec-${slugify(section?.title) || `section-${sectionIndex + 1}`}`
    let id = base
    let suffix = 2

    while (used.has(id)) {
      id = `${base}-${suffix}`
      suffix += 1
    }

    used.add(id)

    return { ...section, id }
  })
}

const addIds = (sections) =>
  withSectionIds(sections).map((section) => ({
    ...section,
    items: (section.items || []).map((item, itemIndex) => ({
      ...item,
      id: item.id || `${section.title}-${itemIndex}-${item.name}`.replace(/\s+/g, '-'),
      visible: item.visible === false ? false : true,
      allergens: normalizeAllergens(item.allergens),
    })),
  }))

const toLabel = (title) =>
  String(title || '')
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const loadSections = () => {
  const saved = localStorage.getItem('menuData')
  if (!saved) return addIds(defaultSections)

  try {
    return addIds(normalizeSavedSections(JSON.parse(saved)))
  } catch (error) {
    console.error('Unable to parse saved menu data', error)
    localStorage.removeItem('menuData')
    return addIds(defaultSections)
  }
}

function App() {
  const [showPopup, setShowPopup] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [dragInfo, setDragInfo] = useState(null)
  const [itemToRemove, setItemToRemove] = useState(null)
  const [sectionToRemove, setSectionToRemove] = useState(null)
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState(() => loadSections())
  const [searchQuery, setSearchQuery] = useState('')
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('menuLang') === 'ar' ? 'ar' : 'en'
    } catch {
      return 'en'
    }
  })

  const isArabic = language === 'ar'
  const t = uiText[language] || uiText.en
  const trimmedQuery = searchQuery.trim().toLowerCase()

  const sectionHeading = (title) =>
    isArabic ? sectionTitleArabic[String(title || '').toUpperCase()] || title : title

  const sectionChipLabel = (title) =>
    isArabic ? sectionTitleArabic[String(title || '').toUpperCase()] || title : toLabel(title)

  const allergenLabel = (allergen) =>
    isArabic ? allergenArabicLabels[allergen] || allergen : allergen

  // What the customer actually sees: hidden items removed, then the search
  // applied. Sections with nothing left to show drop out entirely.
  const customerSections = sections
    .map((section) => ({
      ...section,
      visibleItems: (section.items || []).filter((item) => {
        if (item.visible === false) return false
        if (!trimmedQuery) return true

        return `${item.name || ''} ${item.description || ''}`
          .toLowerCase()
          .includes(trimmedQuery)
      }),
    }))
    .filter((section) => section.visibleItems.length > 0)

  // Chips follow the same list, so searching narrows the nav too.
  const navSections = customerSections.map((section) => ({
    id: section.id,
    title: section.title,
    image: section.visibleItems.find((item) => item.image)?.image || '',
  }))

  const scrollToSection = (id) => {
    const target = document.getElementById(id)
    if (!target) return

    const top = target.getBoundingClientRect().top + window.scrollY - 70
    window.scrollTo({ top, behavior: 'smooth' })
  }

  useEffect(() => {
    // Coalesce scroll events into one write per frame; the raw event fires far
    // more often than the screen can repaint.
    let frame = 0

    const handleScroll = () => {
      if (frame) return

      frame = window.requestAnimationFrame(() => {
        frame = 0
        const logo = document.querySelector('.hero-image')
        if (logo) {
          logo.style.transform = `rotate(${window.scrollY * 0.2}deg)`
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('menuLang', language)
    } catch (error) {
      console.error('Unable to remember language choice', error)
    }
  }, [language])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showAdminLogin) {
        setShowAdminLogin(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showAdminLogin])

  useEffect(() => {
    // This is only a local cache -- Firestore is the source of truth once it is
    // configured, so a failure here must never touch the menu held in state.
    // Debounced so typing in the admin form doesn't re-serialise on every key.
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem('menuData', JSON.stringify(sections))
        return
      } catch (error) {
        console.error('Failed to cache menu data', error)
      }

      // The quota is almost always blown by inline base64 previews left behind
      // by a failed upload. Drop just those from the cached copy so the rest of
      // the menu still survives a reload.
      try {
        const withoutInlineImages = sections.map((section) => ({
          ...section,
          items: (section.items || []).map((item) =>
            typeof item.image === 'string' && item.image.startsWith('data:')
              ? { ...item, image: '' }
              : item
          ),
        }))

        localStorage.setItem('menuData', JSON.stringify(withoutInlineImages))
        setSaveError(
          'This browser ran out of local storage, so uploaded image previews were not cached. Your menu is safe -- click Save Changes to publish it.'
        )
      } catch (error) {
        console.error('Failed to cache menu data without inline images', error)
        setSaveError(
          'Unable to cache the menu in this browser. Your changes are still on screen -- click Save Changes to publish them.'
        )
      }
    }, 400)

    return () => window.clearTimeout(timer)
  }, [sections])

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== 'menuData' || !event.newValue) return

      try {
        setSections(addIds(normalizeSavedSections(JSON.parse(event.newValue))))
      } catch (error) {
        console.error('Failed to load menu data from storage event', error)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  useEffect(() => {
    if (!isFirebaseConfigured) return

    const initFirebase = async () => {
      try {
        await signInFirebaseAnon()
      } catch (error) {
        console.error('Firebase anonymous sign-in failed', error)
      }

      setLoading(true)
      const menuDocRef = doc(db, 'menu', 'default')

      const unsubscribe = onSnapshot(
        menuDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data()
            if (data?.sections) {
              setSections(addIds(normalizeSavedSections(data.sections)))
            }
          }
          setLoading(false)
        },
        (error) => {
          console.error('Firebase realtime error', error)
          setSaveError(`Firebase sync error: ${error.message || 'Check console for details.'}`)
          setLoading(false)
        }
      )

      return unsubscribe
    }

    const unsubscribePromise = initFirebase()

    return () => {
      unsubscribePromise.then((unsubscribe) => {
        if (typeof unsubscribe === 'function') unsubscribe()
      })
    }
  }, [])

  const handleLogin = (event) => {
    event.preventDefault()

    if (loginUsername === 'admin' && loginPassword === '1234') {
      setIsAdmin(true)
      setShowAdminLogin(false)
      setLoginError('')
      return
    }

    setLoginError('Invalid username or password')
  }

  const handleLogout = () => {
    setIsAdmin(false)
    setLoginUsername('')
    setLoginPassword('')
    setLoginError('')
    setSaveMessage('')
    setSaveError('')
  }

  const everySectionNamed = sections.every((section) => section.title?.trim().length > 0)

  const everyItemComplete = sections.every((section) =>
    section.items.every(
      (item) =>
        item.visible === false || (item.name?.trim().length > 0 && item.price?.trim().length > 0)
    )
  )

  const canSave = everySectionNamed && everyItemComplete

  const handleSave = async () => {
    if (!canSave) {
      setSaveError(
        everySectionNamed
          ? 'Name and Price are required for all visible items'
          : 'Every section needs a name'
      )
      setSaveMessage('')
      return
    }

    if (isFirebaseConfigured) {
      try {
        const menuDocRef = doc(db, 'menu', 'default')

        await setDoc(
          menuDocRef,
          {
            sections,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        )

        localStorage.setItem('menuData', JSON.stringify(sections))
        setSaveError('')
        setSaveMessage('Changes saved for everyone')
        window.setTimeout(() => setSaveMessage(''), 2500)
        return
      } catch (error) {
        console.error('Firebase save failed', error)

        try {
          localStorage.setItem('menuData', JSON.stringify(sections))
          setSaveError(
            `Saved locally, but failed to sync shared menu: ${
              error.message || 'Unknown error.'
            }`
          )
          setSaveMessage('Changes saved locally')
          window.setTimeout(() => setSaveMessage(''), 2500)
        } catch (storageError) {
          console.error('Local save fallback failed', storageError)
          setSaveError('Failed to save menu data. Please try again.')
          setSaveMessage('')
        }

        return
      }
    }

    try {
      localStorage.setItem('menuData', JSON.stringify(sections))
      setSaveError('')
      setSaveMessage('Changes saved locally')
      window.setTimeout(() => setSaveMessage(''), 2500)
    } catch (error) {
      console.error('Failed to persist menu data', error)
      setSaveError('Unable to save changes locally. The uploaded image may be too large.')
    }
  }

  const handleItemChange = (sectionId, itemId, field, value) => {
    setSaveError('')

    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== sectionId) return section

        return {
          ...section,
          items: section.items.map((item) =>
            item.id !== itemId
              ? item
              : {
                  ...item,
                  [field]: value,
                }
          ),
        }
      })
    )
  }

  const handleAllergenToggle = (sectionId, itemId, allergen) => {
    setSaveError('')

    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== sectionId) return section

        return {
          ...section,
          items: section.items.map((item) => {
            if (item.id !== itemId) return item

            const currentAllergens = item.allergens || []
            const selected = currentAllergens.includes(allergen)

            return {
              ...item,
              allergens: selected
                ? currentAllergens.filter((value) => value !== allergen)
                : [...currentAllergens, allergen],
            }
          }),
        }
      })
    )
  }

  const handleImageUpload = async (sectionId, itemId, file) => {
    if (!file) return

    const previewFile = () => {
      const reader = new FileReader()

      reader.onload = () => {
        handleItemChange(sectionId, itemId, 'image', reader.result)
      }

      reader.readAsDataURL(file)
    }

    if (isFirebaseConfigured) {
      try {
        // Loaded on demand: only an admin uploading a picture needs the
        // Storage SDK, so customers never download it.
        const [{ ref: storageRef, uploadBytes, getDownloadURL }, storage] =
          await Promise.all([import('firebase/storage'), getFirebaseStorage()])

        if (!storage) throw new Error('Firebase Storage unavailable')

        const fileName = file.name.replace(/\s+/g, '-')
        const storagePath = `menu-images/${sectionId}/${itemId}-${Date.now()}-${fileName}`
        const uploadRef = storageRef(storage, storagePath)
        const snapshot = await uploadBytes(uploadRef, file)
        const imageUrl = await getDownloadURL(snapshot.ref)

        handleItemChange(sectionId, itemId, 'image', imageUrl)
        return
      } catch (error) {
        console.error('Firebase image upload failed', error)
        setSaveError('Image upload failed. Showing local preview instead.')
        previewFile()
        return
      }
    }

    previewFile()
  }

  const handleRemoveImage = (sectionId, itemId) => {
    handleItemChange(sectionId, itemId, 'image', '')
  }

  const handleToggleVisible = (sectionId, itemId) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== sectionId) return section

        return {
          ...section,
          items: section.items.map((item) =>
            item.id !== itemId
              ? item
              : {
                  ...item,
                  visible: !item.visible,
                }
          ),
        }
      })
    )
  }

  const handleRequestRemoveItem = (sectionId, itemId) => {
    setItemToRemove({ sectionId, itemId })
  }

  const handleConfirmRemoveItem = () => {
    if (!itemToRemove) return

    const { sectionId, itemId } = itemToRemove

    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== sectionId) return section

        return {
          ...section,
          items: section.items.filter((item) => item.id !== itemId),
        }
      })
    )

    setItemToRemove(null)
  }

  const handleCancelRemoveItem = () => {
    setItemToRemove(null)
  }

  const getNewItem = (sectionTitle) => ({
    id: makeUniqueId(sectionTitle),
    name: 'New item',
    description: '',
    calories: '',
    price: '',
    icons: [],
    image: '',
    visible: true,
    allergens: [],
  })

  const handleAddItem = (sectionId) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              items: [...section.items, getNewItem(section.title)],
            }
      )
    )
  }

  // Safe now that items are tied to their section by id rather than by title.
  const handleSectionTitleChange = (sectionId, value) => {
    setSaveError('')

    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id !== sectionId ? section : { ...section, title: value }
      )
    )
  }

  const handleSectionTitleBlur = (sectionId) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id !== sectionId ? section : { ...section, title: section.title.trim() }
      )
    )
  }

  const handleAddSection = () => {
    const title = newSectionTitle.trim().toUpperCase()

    if (!title) {
      setSaveError('Section name is required')
      setSaveMessage('')
      return
    }

    const sectionExists = sections.some(
      (section) => section.title.toLowerCase() === title.toLowerCase()
    )

    if (sectionExists) {
      setSaveError('This section already exists')
      setSaveMessage('')
      return
    }

    setSections((prevSections) => [
      ...prevSections,
      {
        id: makeUniqueId(`sec-${title}`),
        title,
        items: [],
      },
    ])

    setNewSectionTitle('')
    setSaveError('')
    setSaveMessage('Section added. Click Save Changes to publish it.')
    window.setTimeout(() => setSaveMessage(''), 2500)
  }

  const handleMoveSection = (sectionIndex, direction) => {
    setSections((prevSections) => {
      const newSections = [...prevSections]
      const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1

      if (targetIndex < 0 || targetIndex >= newSections.length) {
        return prevSections
      }

      const [movedSection] = newSections.splice(sectionIndex, 1)
      newSections.splice(targetIndex, 0, movedSection)

      return newSections
    })

    setSaveError('')
    setSaveMessage('Section order changed. Click Save Changes to publish it.')
    window.setTimeout(() => setSaveMessage(''), 2500)
  }

  const handleRequestRemoveSection = (section) => {
    setSectionToRemove({ id: section.id, title: section.title })
  }

  const handleCancelRemoveSection = () => {
    setSectionToRemove(null)
  }

  const handleConfirmRemoveSection = () => {
    if (!sectionToRemove) return

    // Matching on id removes exactly the section the admin clicked. Matching on
    // title used to remove every section sharing that name.
    setSections((prevSections) =>
      prevSections.filter((section) => section.id !== sectionToRemove.id)
    )

    setSectionToRemove(null)
    setSaveError('')
    setSaveMessage('Section removed. Click Save Changes to publish it.')
    window.setTimeout(() => setSaveMessage(''), 2500)
  }

  const handleDragStart = (event, sectionId, itemId) => {
    event.dataTransfer.effectAllowed = 'move'
    setDragInfo({ sectionId, itemId })
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event, sectionId, targetId) => {
    event.preventDefault()

    if (!dragInfo || dragInfo.sectionId !== sectionId) return
    if (dragInfo.itemId === targetId) return

    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id !== sectionId) return section

        const items = [...section.items]
        const fromIndex = items.findIndex((item) => item.id === dragInfo.itemId)
        const toIndex = items.findIndex((item) => item.id === targetId)

        if (fromIndex === -1 || toIndex === -1) return section

        const [movedItem] = items.splice(fromIndex, 1)
        items.splice(toIndex, 0, movedItem)

        return {
          ...section,
          items,
        }
      })
    )

    setDragInfo(null)
  }

  return (
    <div
      className="page"
      dir={isArabic && !isAdmin ? 'rtl' : 'ltr'}
      lang={isArabic && !isAdmin ? 'ar' : 'en'}
    >
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <button
              className="popup-close"
              type="button"
              onClick={() => setShowPopup(false)}
              aria-label={t.closeLabel}
            >
              ✕
            </button>
            <h2>{isAdmin ? uiText.en.welcomeTitle : t.welcomeTitle}</h2>
            <p>{isAdmin ? uiText.en.welcomeBody : t.welcomeBody}</p>
          </div>
        </div>
      )}

      <div className="topbar">
        {isAdmin ? (
          <div className="search-placeholder">Admin Dashboard</div>
        ) : (
          <div className="search-box">
            <span className="search-icon" aria-hidden="true">
              ⌕
            </span>

            <input
              className="search-input"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t.searchLabel}
              aria-label={t.searchLabel}
            />

            {searchQuery && (
              <button
                className="search-clear"
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label={t.clearSearch}
              >
                ✕
              </button>
            )}
          </div>
        )}

        <div className="topbar-actions">
          {!isAdmin && (
            <button
              className="lang-toggle"
              type="button"
              onClick={() => setLanguage(isArabic ? 'en' : 'ar')}
            >
              {t.switchTo}
            </button>
          )}

          {!isAdmin ? (
            <button className="admin-link" type="button" onClick={() => setShowAdminLogin(true)}>
              Admin
            </button>
          ) : (
            <>
              <button
                className="admin-save-button"
                type="button"
                onClick={handleSave}
                disabled={!canSave}
              >
                Save Changes
              </button>

              <button className="admin-link" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

          <button className="menu-icon" type="button">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {showAdminLogin && !isAdmin && (
        <div className="admin-login-overlay">
          <div className="admin-login-box">
            <button className="admin-close" onClick={() => setShowAdminLogin(false)}>
              ✕
            </button>

            <h2>Admin Login</h2>

            <form className="admin-login-form" onSubmit={handleLogin}>
              <label>
                Username
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(event) => setLoginUsername(event.target.value)}
                  className="admin-input"
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  className="admin-input"
                />
              </label>

              <button className="admin-button" type="submit">
                Sign In
              </button>
            </form>

            {loginError && <p className="admin-error">{loginError}</p>}
          </div>
        </div>
      )}

      {itemToRemove && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <button className="confirm-close" type="button" onClick={handleCancelRemoveItem}>
              ✕
            </button>

            <h2>Confirm removal</h2>
            <p>Are you sure you want to remove this item? This action cannot be undone.</p>

            <div className="confirm-actions">
              <button className="confirm-button cancel" type="button" onClick={handleCancelRemoveItem}>
                Cancel
              </button>

              <button className="confirm-button danger" type="button" onClick={handleConfirmRemoveItem}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {sectionToRemove && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <button className="confirm-close" type="button" onClick={handleCancelRemoveSection}>
              ✕
            </button>

            <h2>Confirm section removal</h2>
            <p>
              Are you sure you want to remove the section "{sectionToRemove.title}"?
              All items inside it will be removed.
            </p>

            <div className="confirm-actions">
              <button
                className="confirm-button cancel"
                type="button"
                onClick={handleCancelRemoveSection}
              >
                Cancel
              </button>

              <button
                className="confirm-button danger"
                type="button"
                onClick={handleConfirmRemoveSection}
              >
                Remove Section
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdmin ? (
        <>
          <header className="hero admin-hero">
            <img src="/logo.png" alt="Sol Beach Resort" className="hero-image" />
            <p className="subtitle">Admin Dashboard</p>
          </header>

          <section className="admin-instructions">
            <p>You can edit products here and reorder them within each section using drag and drop.</p>

            <div className="admin-add-section-box">
              <input
                className="admin-input"
                type="text"
                placeholder="New section name"
                value={newSectionTitle}
                onChange={(event) => setNewSectionTitle(event.target.value)}
              />

              <button className="admin-button" type="button" onClick={handleAddSection}>
                + Add Section
              </button>
            </div>

            {loading && <p className="admin-save-feedback">Loading menu...</p>}
            {saveError && <p className="admin-save-error">{saveError}</p>}
            {saveMessage && <p className="admin-save-feedback">{saveMessage}</p>}
          </section>

          {sections.map((section, sectionIndex) => (
            <section className="admin-section" key={section.id}>
              <div className="admin-section-header">
                <div className="admin-section-identity">
                  <label className="admin-section-name">
                    Section name
                    <input
                      className="admin-input"
                      value={section.title}
                      onChange={(event) =>
                        handleSectionTitleChange(section.id, event.target.value)
                      }
                      onBlur={() => handleSectionTitleBlur(section.id)}
                    />
                  </label>

                  <span>{section.items.length} items</span>
                </div>

                <div className="admin-section-actions">
                  <button
                    type="button"
                    className="admin-move-section-button"
                    onClick={() => handleMoveSection(sectionIndex, 'up')}
                    disabled={sectionIndex === 0}
                  >
                    ↑ Move Up
                  </button>

                  <button
                    type="button"
                    className="admin-move-section-button"
                    onClick={() => handleMoveSection(sectionIndex, 'down')}
                    disabled={sectionIndex === sections.length - 1}
                  >
                    ↓ Move Down
                  </button>

                  <button
                    type="button"
                    className="admin-remove-section-button"
                    onClick={() => handleRequestRemoveSection(section)}
                  >
                    Remove Section
                  </button>
                </div>
              </div>

              <div className="admin-grid">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className={`admin-item ${item.visible === false ? 'hidden-item' : ''} ${
                      dragInfo?.itemId === item.id ? 'dragging' : ''
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(event) => handleDrop(event, section.id, item.id)}
                  >
                    <div className="admin-item-top">
                      <div
                        className="drag-handle"
                        draggable
                        onDragStart={(event) => handleDragStart(event, section.id, item.id)}
                        onDragEnd={() => setDragInfo(null)}
                      >
                        ☰
                      </div>

                      <div className="admin-item-title">
                        {item.name}
                        {item.visible === false && <span className="hidden-badge">Hidden</span>}
                      </div>

                      <button
                        type="button"
                        className="admin-remove-item-button"
                        onClick={() => handleRequestRemoveItem(section.id, item.id)}
                      >
                        ✕
                      </button>
                    </div>

                    <label>
                      Name
                      <input
                        className="admin-input"
                        value={item.name}
                        onChange={(event) =>
                          handleItemChange(section.id, item.id, 'name', event.target.value)
                        }
                      />
                    </label>

                    <label>
                      Description
                      <textarea
                        className="admin-textarea"
                        value={item.description}
                        onChange={(event) =>
                          handleItemChange(section.id, item.id, 'description', event.target.value)
                        }
                      />
                    </label>

                    <label>
                      Allergens
                      <div className="admin-allergen-chips">
                        {allergenOptions.map((option) => {
                          const selected = item.allergens?.includes(option.value)

                          return (
                            <button
                              type="button"
                              key={option.value}
                              className={`admin-allergen-chip ${selected ? 'selected' : ''}`}
                              onClick={() => handleAllergenToggle(section.id, item.id, option.value)}
                            >
                              {option.value}
                            </button>
                          )
                        })}
                      </div>

                      <span className="admin-allergen-help">
                        Click a label to toggle allergens. You can select multiple.
                      </span>
                    </label>

                    <div className="admin-image-actions">
                      <label>
                        Image URL
                        <input
                          className="admin-input"
                          value={item.image || ''}
                          onChange={(event) =>
                            handleItemChange(section.id, item.id, 'image', event.target.value)
                          }
                        />
                      </label>

                      <label className="admin-upload-label">
                        Upload picture
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleImageUpload(section.id, item.id, event.target.files?.[0])
                          }
                        />
                      </label>

                      <button
                        type="button"
                        className="admin-remove-button"
                        onClick={() => handleRemoveImage(section.id, item.id)}
                      >
                        Remove picture
                      </button>

                      <button
                        type="button"
                        className="admin-toggle-button"
                        onClick={() => handleToggleVisible(section.id, item.id)}
                      >
                        {item.visible === false ? 'Show item' : 'Hide item'}
                      </button>
                    </div>

                    <div className="admin-image-preview">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="admin-image-placeholder">No image available</div>
                      )}
                    </div>

                    <div className="admin-row">
                      <label>
                        Price
                        <input
                          className="admin-input"
                          value={item.price}
                          onChange={(event) =>
                            handleItemChange(section.id, item.id, 'price', event.target.value)
                          }
                        />
                      </label>

                      <label>
                        Calories
                        <input
                          className="admin-input"
                          value={item.calories}
                          onChange={(event) =>
                            handleItemChange(section.id, item.id, 'calories', event.target.value)
                          }
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="admin-add-item-row">
                <button
                  type="button"
                  className="admin-button admin-add-button"
                  onClick={() => handleAddItem(section.id)}
                >
                  + Add item
                </button>
              </div>
            </section>
          ))}
        </>
      ) : (
        <>
          <header className="hero">
            <img src="/logo.png" alt="Sol Beach Resort" className="hero-image" />
            <p className="subtitle">{t.kitchen}</p>
          </header>

          {navSections.length > 0 && (
            <nav className="category-nav" aria-label={t.sectionsNav}>
              <div className="category-scroll">
                {navSections.map((section) => (
                  <button
                    className="category-chip"
                    type="button"
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                  >
                    <span className="category-thumb">
                      {section.image ? (
                        <img src={section.image} alt="" loading="lazy" />
                      ) : (
                        <span className="category-thumb-fallback" aria-hidden="true">
                          {sectionChipLabel(section.title).charAt(0)}
                        </span>
                      )}
                    </span>

                    <span className="category-label">{sectionChipLabel(section.title)}</span>
                  </button>
                ))}
              </div>
            </nav>
          )}

          {customerSections.length === 0 && (
            <section className="menu-empty">
              <h2>{t.noResultsTitle}</h2>
              <p>{t.noResultsBody}</p>
            </section>
          )}

          {customerSections.map((section) => (
            <section
              className={`menu-section ${section.title === 'BEST SELLERS' ? 'best-sellers' : ''}`}
              key={section.id}
              id={section.id}
            >
              <h2 className="section-title">{sectionHeading(section.title)}</h2>

              <div className="menu-grid">
                {section.visibleItems.map((item) => (
                    <article className="menu-card" key={item.id || item.name}>
                      <div className="menu-content">
                        <h3>
                          {item.name}
                          {section.title === 'BEST SELLERS' && (
                            <span className="badge">{t.bestSeller}</span>
                          )}
                        </h3>

                        <p className="description">{item.description}</p>

                        {item.allergens?.length > 0 && (
                          <div className="allergen-row">
                            {item.allergens.map((allergen, allergenIndex) => (
                              <span key={allergenIndex} className="allergen-badge">
                                {allergenLabel(allergen)}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="meta">
                          <span>{item.calories}</span>
                          <span className="price">{item.price}</span>
                        </div>
                      </div>

                      <div className="image-wrap">
                        {item.image ? (
                          <img src={item.image} alt={item.name} loading="lazy" />
                        ) : null}
                      </div>
                    </article>
                  ))}
              </div>
            </section>
          ))}
        </>
      )}

      <footer className="footer">
        <p>{isAdmin ? uiText.en.rights : t.rights}</p>
        <span>{isAdmin ? uiText.en.madeBy : t.madeBy}</span>
      </footer>
    </div>
  )
}

export default App