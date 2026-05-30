import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [showPopup, setShowPopup] = useState(true)

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

  const sections = [
    {
      title: 'BEST SELLERS',
      items: [
        {
          name: 'SOL Club Sandwich',
          description: 'Our most popular sandwich with fresh ingredients.',
          calories: '520 cal',
          price: '﷼ 55',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'American Breakfast',
          description: 'Classic breakfast with eggs, toast, and sides.',
          calories: '650 cal',
          price: '﷼ 60',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Haloumi Sandwich',
          description: 'Grilled haloumi with fresh bread and sauce.',
          calories: '480 cal',
          price: '﷼ 48',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80',
        },

        {
          name: 'Haloumi Sandwich',
          description: 'Grilled haloumi with fresh bread and sauce.',
          calories: '480 cal',
          price: '﷼ 48',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80',
        },

        
      ],
    },
    {      title: 'SALADS',
      items: [
        {
          name: 'Taboule',
          description: 'A refreshing blend of parsley, tomatoes, bulgur, and lemon dressing.',
          calories: '180 cal',
          price: '﷼ 38',
          icons: ['🥗'],
          image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=600&q=80',
        },
          description: 'A refreshing blend of parsley, tomatoes, bulgur, and lemon dressing.',
          calories: '180 cal',
          price: '﷼ 38',
          icons: ['🥗'],
          image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Rocca Salad',
          description: 'Fresh arugula with cherry tomatoes, parmesan, and balsamic glaze.',
          calories: '210 cal',
          price: '﷼ 40',
          icons: ['🥗'],
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Fatoush',
          description: 'Crisp lettuce, crunchy pita, and sumac-spiced vegetables.',
          calories: '220 cal',
          price: '﷼ 42',
          icons: ['🥗'],
          image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Chicken Ceaser Salad',
          description: 'Grilled chicken with romaine, croutons, and creamy Caesar dressing.',
          calories: '320 cal',
          price: '﷼ 50',
          icons: ['🥗'],
          image: 'https://images.unsplash.com/photo-1568051243854-4f658cb0dbdc?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Seafood Salad',
          description: 'A mix of shrimp, calamari, and greens with citrus dressing.',
          calories: '280 cal',
          price: '﷼ 55',
          icons: ['🥗'],
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Maxican Salad',
          description: 'Spicy salad with corn, beans, avocado, and chili-lime dressing.',
          calories: '275 cal',
          price: '﷼ 48',
          icons: ['🥗'],
          image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Greek Salad',
          description: 'Classic Greek salad with cucumbers, olives, tomatoes, and feta.',
          calories: '240 cal',
          price: '﷼ 45',
          icons: ['🥗'],
          image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Tuna Salad',
          description: 'Fresh tuna with greens, capers, and lemon-herb dressing.',
          calories: '300 cal',
          price: '﷼ 50',
          icons: ['🥗'],
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    {      title: 'BREAKFAST',
      items: [
        {
          name: 'Oriental Breakfast',
          description: 'Traditional Middle Eastern breakfast with hummus, falafel, and fresh pita bread.',
          calories: '480.13 cal',
          price: '﷼ 75',
          icons: ['◔'],
          image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80',
        },

        {
          name: 'American Breakfast',
          description: 'Classic breakfast with scrambled eggs, bacon, sausage, and toast.',
          calories: '480.13 cal',
          price: '﷼ 75',
          icons: ['◔'],
          image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80',
        },

        {
          name: 'Omelette',
          description: 'Fluffy omelette with choice of cheese, vegetables, and meat fillings.',
          calories: '480.13 cal',
          price: '﷼ 32',
          icons: ['◔'],
          image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80',
        },

        {
          name: 'Fried Eggs',
          description: 'Sunny-side up or over-easy eggs served with your choice of sides.',
          calories: '480.13 cal',
          price: '﷼ 48',
          icons: ['◔'],
          image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80',
        },

        {
          name: 'Haloumi Sandwich',
          description: 'Grilled haloumi cheese with fresh tomato and herbs in toasted bread.',
          calories: '480.13 cal',
          price: '﷼ 48',
          icons: ['◔'],
          image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80',
        },

        {
          name: 'SOL Club Sandwich',
          description: 'Triple layer breakfast sandwich with eggs, bacon, and fresh vegetables.',
          calories: '480.13 cal',
          price: '﷼ 48',
          icons: ['◔'],
          image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80',
        },

        {
          name: 'Tuna Sandwich',
          description: 'Fresh tuna salad with lettuce, tomato, and mayo on soft bread.',
          calories: '480.13 cal',
          price: '﷼ 48',
          icons: ['◔'],
          image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80',
        },

        {
          name: 'Smoked Salmon Sandwich',
          description: 'Delicate smoked salmon with cream cheese and fresh dill on bagel.',
          calories: '480.13 cal',
          price: '﷼ 48',
          icons: ['◔'],
          image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80',
        },

        {
          name: 'Smoked Salmon Sandwich with Egg',
          description: 'Premium smoked salmon with scrambled eggs and capers on toasted bread.',
          calories: '480.13 cal',
          price: '﷼ 48',
          icons: ['◔'],
          image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80',
        },

        {
          name: 'Hash Browns',
          description: 'Crispy shredded potatoes, golden-fried and served with sour cream.',
          calories: '480.13 cal',
          price: '﷼ 48',
          icons: ['◔'],
          image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80',
        },

        {
          name: 'Bread Basket',
          description: 'Assorted fresh breads and pastries with butter and jam.',
          calories: '480.13 cal',
          price: '﷼ 48',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    {
      title: 'LUNCH',
      items: [
        {
          name: 'Grilled Chicken Burger',
          description: 'Juicy grilled chicken breast with lettuce and tomato.',
          calories: '520 cal',
          price: '﷼ 52',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1562547256-a6d86a26cef8?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Steak Sandwich',
          description: 'Tender beef steak with grilled onions and sauce.',
          calories: '580 cal',
          price: '﷼ 65',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Chicken Fajita Sandwich',
          description: 'Spiced grilled chicken with peppers and onions.',
          calories: '510 cal',
          price: '﷼ 55',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Diet Chicken Sandwich',
          description: 'Grilled chicken with fresh vegetables and light sauce.',
          calories: '380 cal',
          price: '﷼ 48',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1562547256-a6d86a26cef8?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'SOL Club Sandwich',
          description: 'Triple layer with chicken, bacon and fresh ingredients.',
          calories: '620 cal',
          price: '﷼ 58',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Crispy Chicken Sandwich',
          description: 'Golden fried chicken with pickles and mayo.',
          calories: '540 cal',
          price: '﷼ 50',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1562547256-a6d86a26cef8?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Haloumi Sandwich',
          description: 'Grilled haloumi cheese with fresh bread and sauce.',
          calories: '480 cal',
          price: '﷼ 48',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Tuna Sandwich',
          description: 'Fresh tuna salad with lettuce and tomato.',
          calories: '420 cal',
          price: '﷼ 45',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1559333086-b0a56225a93c?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'SOL Sub Sandwich',
          description: 'Long sub filled with assorted meats and vegetables.',
          calories: '600 cal',
          price: '﷼ 55',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1511689915989-24d7b1295f0e?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'French Fries',
          description: 'Crispy golden fries with seasoning.',
          calories: '350 cal',
          price: '﷼ 28',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1599599810694-17b2e6c81a47?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Hash Browns',
          description: 'Crispy shredded potato patties.',
          calories: '320 cal',
          price: '﷼ 25',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b0?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Onion Rings',
          description: 'Crispy battered onion rings with dipping sauce.',
          calories: '380 cal',
          price: '﷼ 30',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1591080876316-37a2e8da7a59?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Cheeseburger',
          description: 'Classic burger with melted cheddar cheese.',
          calories: '540 cal',
          price: '﷼ 48',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Sol Beach Burger',
          description: 'Premium burger with special sauce and fresh toppings.',
          calories: '620 cal',
          price: '﷼ 62',
          icons: ['★'],
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
  ]

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

        <button className="menu-icon" type="button">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

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
            {section.items.map((item, index) => (
              <article className="menu-card" key={item.name}>
                <div className="menu-content">
                  <h3>
                    {item.name}
                    {section.title === 'BEST SELLERS' && (
                      <span className="badge">★ Best Seller</span>
                    )}
                  </h3>

                  <p className="description">{item.description}</p>

                  <div className="icons-row">
                    {item.icons?.map((icon, iconIndex) => (
                      <span key={iconIndex}>{icon}</span>
                    ))}
                  </div>

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

      <footer className="footer">
        <p>© 2026 Sol Beach Resort. All rights reserved.</p>
        <span>Made by Sol Beach Resort</span>
      </footer>
    </div>
  )
}

export default App