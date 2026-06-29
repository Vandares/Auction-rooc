import { useState, useEffect } from 'react'
import './App.css'
import { defaultSections } from './seedMenuData.js'
import { db, storage, isFirebaseConfigured, signInFirebaseAnon } from './firebaseConfig'
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

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
  'قمح': '🌾 Wheat',
  'حليب': '🥛 Milk',
  'بيض': '🥚 Eggs',
  'مكسرات': '🥜 Tree Nuts',
  'سمك': '🐟 Fish',
  'قشريات': '🦐 Shellfish',
  'جلوتين': '🍞 Gluten',
  'صويا': '🌿 Soy',
  'سمسم': '🌻 Sesame',
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
    items: section.items.map((item) => ({
      ...item,
      visible: item.visible === false ? false : true,
      allergens: normalizeAllergens(item.allergens),
    })),
  }))

const addIds = (sections) =>
  sections.map((section) => ({
    ...section,
    items: section.items.map((item, itemIndex) => ({
      ...item,
      id: `${section.title}-${itemIndex}-${item.name}`.replace(/\s+/g, '-'),
      visible: item.visible === false ? false : true,
      allergens: normalizeAllergens(item.allergens),
    })),
  }))

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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const logo = document.querySelector('.hero-image')
      if (logo) {
        logo.style.transform = `rotate(${window.scrollY * 0.2}deg)`
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showAdminLogin) {
        setShowAdminLogin(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showAdminLogin])

  const [sections, setSections] = useState(() => loadSections())

  useEffect(() => {
    try {
      localStorage.setItem('menuData', JSON.stringify(sections))
    } catch (error) {
      console.error('Failed to persist menu data', error)
      setSaveError('Unable to save changes locally. The uploaded image may be too large.')
    }
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

  const canSave = sections.every((section) =>
    section.items.every(
      (item) =>
        item.visible === false || (item.name?.trim().length > 0 && item.price?.trim().length > 0)
    )
  )

  const handleSave = async () => {
    if (!canSave) {
      setSaveError('Name and Price are required for all visible items')
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
          setSaveError(`Saved locally, but failed to sync shared menu: ${error.message || 'Unknown error.'}`)
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

  const handleItemChange = (sectionTitle, itemId, field, value) => {
    setSaveError('')
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.title !== sectionTitle) return section
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

  const handleAllergenToggle = (sectionTitle, itemId, allergen) => {
    setSaveError('')
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.title !== sectionTitle) return section
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

  const handleImageUpload = async (sectionTitle, itemId, file) => {
    if (!file) return

    const previewFile = () => {
      const reader = new FileReader()
      reader.onload = () => {
        handleItemChange(sectionTitle, itemId, 'image', reader.result)
      }
      reader.readAsDataURL(file)
    }

    if (isFirebaseConfigured) {
      try {
        const fileName = file.name.replace(/\s+/g, '-')
        const storagePath = `menu-images/${sectionTitle.replace(/\s+/g, '-')}/${itemId}-${Date.now()}-${fileName}`
        const uploadRef = storageRef(storage, storagePath)
        const snapshot = await uploadBytes(uploadRef, file)
        const imageUrl = await getDownloadURL(snapshot.ref)
        handleItemChange(sectionTitle, itemId, 'image', imageUrl)
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

  const handleRemoveImage = (sectionTitle, itemId) => {
    handleItemChange(sectionTitle, itemId, 'image', '')
  }

  const handleToggleVisible = (sectionTitle, itemId) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.title !== sectionTitle) return section
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

  const handleRequestRemoveItem = (sectionTitle, itemId) => {
    setItemToRemove({ sectionTitle, itemId })
  }

  const handleConfirmRemoveItem = () => {
    if (!itemToRemove) return
    const { sectionTitle, itemId } = itemToRemove
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.title !== sectionTitle) return section
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
    id: `${sectionTitle}-${Date.now()}`.replace(/\s+/g, '-'),
    name: 'New item',
    description: '',
    calories: '',
    price: '',
    icons: [],
    image: '',
    visible: true,
    allergens: [],
  })

  const handleAddItem = (sectionTitle) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.title !== sectionTitle
          ? section
          : {
              ...section,
              items: [...section.items, getNewItem(sectionTitle)],
            }
      )
    )
  }

  const handleDragStart = (event, sectionTitle, itemId) => {
    event.dataTransfer.effectAllowed = 'move'
    setDragInfo({ sectionTitle, itemId })
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event, sectionTitle, targetId) => {
    event.preventDefault()
    if (!dragInfo || dragInfo.sectionTitle !== sectionTitle) return
    if (dragInfo.itemId === targetId) return

    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.title !== sectionTitle) return section

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
    <div className="page">
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <button className="popup-close" onClick={() => setShowPopup(false)}>
              ✕
            </button>
            <h2>Welcome 👋</h2>
            <p>Hi, welcome to Sol Beach Kitchen</p>
          </div>
        </div>
      )}

      <div className="topbar">
        <div className="search-placeholder">Search</div>
        <div className="topbar-actions">
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

      {isAdmin ? (
        <>
          <header className="hero admin-hero">
            <img src="/logo.png" alt="Sol Beach Resort" className="hero-image" />
            <p className="subtitle">Admin Dashboard</p>
          </header>

          <section className="admin-instructions">
            <p>You can edit products here and reorder them within each section using drag and drop.</p>
            {saveError && <p className="admin-save-error">{saveError}</p>}
            {saveMessage && <p className="admin-save-feedback">{saveMessage}</p>}
          </section>

          {sections.map((section) => (
            <section className="admin-section" key={section.title}>
              <div className="admin-section-header">
                <h2>{section.title}</h2>
                <span>{section.items.length} items</span>
              </div>
              <div className="admin-grid">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className={`admin-item ${item.visible === false ? 'hidden-item' : ''} ${dragInfo?.itemId === item.id ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDrop={(event) => handleDrop(event, section.title, item.id)}
                  >
                    <div className="admin-item-top">
                      <div
                        className="drag-handle"
                        draggable
                        onDragStart={(event) => handleDragStart(event, section.title, item.id)}
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
                        onClick={() => handleRequestRemoveItem(section.title, item.id)}
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
                          handleItemChange(section.title, item.id, 'name', event.target.value)
                        }
                      />
                    </label>
                    <label>
                      Description
                      <textarea
                        className="admin-textarea"
                        value={item.description}
                        onChange={(event) =>
                          handleItemChange(section.title, item.id, 'description', event.target.value)
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
                              onClick={() => handleAllergenToggle(section.title, item.id, option.value)}
                            >
                              {option.value}
                            </button>
                          )
                        })}
                      </div>
                      <span className="admin-allergen-help">Click a label to toggle allergens. You can select multiple.</span>
                    </label>
                    <div className="admin-image-actions">
                      <label>
                        Image URL
                        <input
                          className="admin-input"
                          value={item.image || ''}
                          onChange={(event) =>
                            handleItemChange(section.title, item.id, 'image', event.target.value)
                          }
                        />
                      </label>
                      <button
                        type="button"
                        className="admin-remove-button"
                        onClick={() => handleRemoveImage(section.title, item.id)}
                      >
                        Remove picture
                      </button>
                      <button
                        type="button"
                        className="admin-toggle-button"
                        onClick={() => handleToggleVisible(section.title, item.id)}
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
                            handleItemChange(section.title, item.id, 'price', event.target.value)
                          }
                        />
                      </label>
                      <label>
                        Calories
                        <input
                          className="admin-input"
                          value={item.calories}
                          onChange={(event) =>
                            handleItemChange(section.title, item.id, 'calories', event.target.value)
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
                  onClick={() => handleAddItem(section.title)}
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
            <p className="subtitle">Sol Beach Kitchen</p>
          </header>

          {sections.map((section) => (
            <section
              className={`menu-section ${section.title === 'BEST SELLERS' ? 'best-sellers' : ''}`}
              key={section.title}
            >
              <h2 className="section-title">{section.title}</h2>

              <div className="menu-grid">
                {section.items
                  .filter((item) => item.visible !== false)
                  .map((item, index) => (
                    <article className="menu-card" key={item.name}>
                    <div className="menu-content">
                      <h3>
                        {item.name}
                        {section.title === 'BEST SELLERS' && (
                          <span className="badge">★ Best Seller</span>
                        )}
                      </h3>

                      <p className="description">{item.description}</p>

                      {item.allergens?.length > 0 && (
                        <div className="allergen-row">
                          {item.allergens.map((allergen, allergenIndex) => (
                            <span key={allergenIndex} className="allergen-badge">
                              {allergen}
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
                      <img src={item.image} alt={item.name} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </>
      )}

      <footer className="footer">
        <p>© 2026 Sol Beach Resort. All rights reserved.</p>
        <span>Made by Sol Beach Resort</span>
      </footer>
    </div>
  )
}

export default App