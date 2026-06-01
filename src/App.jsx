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
      title: 'BREAKFAST',
      items: [
        {
          name: 'Oriental Breakfast',
          description: 'Traditional Middle Eastern breakfast with hummus, falafel, and fresh pita bread.',
          calories: '480 cal',
          price: '﷼ 75',
          icons: ['☀️'],
          image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'American Breakfast',
          description: 'Classic breakfast with scrambled eggs, bacon, sausage, and toast.',
          calories: '650 cal',
          price: '﷼ 75',
          icons: ['☀️'],
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Omelette',
          description: 'Fluffy omelette with cheese, vegetables, and your choice of fillings.',
          calories: '420 cal',
          price: '﷼ 32',
          icons: ['☀️'],
          image: 'https://images.unsplash.com/photo-1514516870920-49c9be741c16?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Fried Eggs',
          description: 'Sunny-side up or over-easy eggs served with your choice of sides.',
          calories: '310 cal',
          price: '﷼ 48',
          icons: ['☀️'],
          image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    {
      title: 'APPETIZERS',
      items: [
        {
          name: 'French Fries',
          description: 'Crispy golden fries with seasoning.',
          calories: '350 cal',
          price: '﷼ 28',
          icons: ['🍟'],
          image: 'https://images.unsplash.com/photo-1599599810694-17b2e6c81a47?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Hash Browns',
          description: 'Crispy shredded potato patties.',
          calories: '320 cal',
          price: '﷼ 25',
          icons: ['🍟'],
          image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b0?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Onion Rings',
          description: 'Crispy battered onion rings with dipping sauce.',
          calories: '380 cal',
          price: '﷼ 30',
          icons: ['🍟'],
          image: 'https://images.unsplash.com/photo-1591080876316-37a2e8da7a59?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Bread Basket',
          description: 'Assorted fresh breads and pastries with butter and jam.',
          calories: '200 cal',
          price: '﷼ 22',
          icons: ['🍞'],
          image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Chicken Nuggets',
          description: 'Golden bite-sized chicken nuggets with dipping sauce.',
          calories: '400 cal',
          price: '﷼ 35',
          icons: ['🍗'],
          image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Chicken Tenders',
          description: 'Crispy chicken tenders served with signature sauces.',
          calories: '420 cal',
          price: '﷼ 38',
          icons: ['🍗'],
          image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Mozzarella Sticks',
          description: 'Fried mozzarella sticks with marinara dipping sauce.',
          calories: '390 cal',
          price: '﷼ 36',
          icons: ['🧀'],
          image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Fried Calamari',
          description: 'Crispy golden calamari with lemon and dipping sauce.',
          calories: '490 cal',
          price: '﷼ 42',
          icons: ['🐟'],
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    {
      title: 'SALADS',
      items: [
        {
          name: 'Taboule',
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
      ],
    },
    {
      title: 'SANDWICHES',
      items: [
        {
          name: 'Haloumi Sandwich',
          description: 'Grilled haloumi cheese with fresh tomato and herbs in toasted bread.',
          calories: '480 cal',
          price: '﷼ 48',
          icons: ['🥪'],
          image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'SOL Club Sandwich',
          description: 'Triple layer sandwich with chicken, bacon, lettuce, and tomato.',
          calories: '620 cal',
          price: '﷼ 58',
          icons: ['🥪'],
          image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Tuna Sandwich',
          description: 'Fresh tuna salad with lettuce, tomato, and mayo on soft bread.',
          calories: '420 cal',
          price: '﷼ 45',
          icons: ['🥪'],
          image: 'https://images.unsplash.com/photo-1559333086-b0a56225a93c?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Smoked Salmon Sandwich',
          description: 'Delicate smoked salmon with cream cheese and fresh dill.',
          calories: '560 cal',
          price: '﷼ 52',
          icons: ['🥪'],
          image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Smoked Salmon Sandwich with Egg',
          description: 'Premium smoked salmon with scrambled eggs and capers on toasted bread.',
          calories: '620 cal',
          price: '﷼ 55',
          icons: ['🥪'],
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Steak Sandwich',
          description: 'Tender beef steak with grilled onions and savory sauce.',
          calories: '580 cal',
          price: '﷼ 65',
          icons: ['🥪'],
          image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Chicken Fajita Sandwich',
          description: 'Spiced grilled chicken with peppers and onions.',
          calories: '510 cal',
          price: '﷼ 55',
          icons: ['🥪'],
          image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Diet Chicken Sandwich',
          description: 'Grilled chicken with fresh vegetables and light sauce.',
          calories: '380 cal',
          price: '﷼ 48',
          icons: ['🥪'],
          image: 'https://images.unsplash.com/photo-1562547256-a6d86a26cef8?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Crispy Chicken Sandwich',
          description: 'Golden fried chicken with pickles and mayo.',
          calories: '540 cal',
          price: '﷼ 50',
          icons: ['🥪'],
          image: 'https://images.unsplash.com/photo-1562547256-a6d86a26cef8?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'SOL Sub Sandwich',
          description: 'Long sub filled with assorted meats and vegetables.',
          calories: '600 cal',
          price: '﷼ 55',
          icons: ['🥪'],
          image: 'https://images.unsplash.com/photo-1511689915989-24d7b1295f0e?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Fried Shrimp Sandwich',
          description: 'Crispy shrimp tucked into a toasted bun with slaw.',
          calories: '620 cal',
          price: '﷼ 48',
          icons: ['🥪'],
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Grilled Shrimp Sandwich',
          description: 'Grilled shrimp, lettuce, and sauce on fresh bread.',
          calories: '600 cal',
          price: '﷼ 50',
          icons: ['🥪'],
          image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    {
      title: 'BURGERS',
      items: [
        {
          name: 'Grilled Chicken Burger',
          description: 'Juicy grilled chicken breast with lettuce and tomato.',
          calories: '520 cal',
          price: '﷼ 52',
          icons: ['🍔'],
          image: 'https://images.unsplash.com/photo-1562547256-a6d86a26cef8?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Cheeseburger',
          description: 'Classic burger with melted cheddar cheese.',
          calories: '540 cal',
          price: '﷼ 48',
          icons: ['🍔'],
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Sol Beach Burger',
          description: 'Premium burger with special sauce and fresh toppings.',
          calories: '620 cal',
          price: '﷼ 62',
          icons: ['🍔'],
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    {
      title: 'MAIN COURSES',
      items: [
        {
          name: 'Beef Tenderloin',
          description: 'Succulent beef tenderloin cooked to perfection.',
          calories: '700 cal',
          price: '﷼ 75',
          icons: ['🥩'],
          image: 'https://images.unsplash.com/photo-1553163147-622ab57e3457?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Diet Chicken Breast',
          description: 'Lean grilled chicken breast with light seasoning.',
          calories: '320 cal',
          price: '﷼ 50',
          icons: ['🍗'],
          image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Chicken Milanese',
          description: 'Breaded chicken cutlet served with lemon and greens.',
          calories: '650 cal',
          price: '﷼ 58',
          icons: ['🍗'],
          image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Grilled Shrimp',
          description: 'Seasoned grilled shrimp served with lemon butter.',
          calories: '360 cal',
          price: '﷼ 50',
          icons: ['🍤'],
          image: 'https://images.unsplash.com/photo-1481931715705-36f1b6205269?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Grilled Salmon',
          description: 'Perfectly grilled salmon with herbs and a light glaze.',
          calories: '520 cal',
          price: '﷼ 58',
          icons: ['🐟'],
          image: 'https://images.unsplash.com/photo-1514516870920-49c9be741c16?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Fried Shrimp Meal',
          description: 'Golden fried shrimp served with fries and tartar sauce.',
          calories: '700 cal',
          price: '﷼ 54',
          icons: ['🍤'],
          image: 'https://images.unsplash.com/photo-1481931715705-36f1b6205269?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Shrimp Fried Rice',
          description: 'Wok-fried rice with shrimp, vegetables, and soy sauce.',
          calories: '610 cal',
          price: '﷼ 45',
          icons: ['🍤'],
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    {
      title: 'PASTA & PIZZA',
      items: [
        {
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato, mozzarella, and fresh basil.',
          calories: '740 cal',
          price: '﷼ 45',
          icons: ['🍕'],
          image: 'https://images.unsplash.com/photo-1548365328-5f3f5aee2a8b?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Pepperoni Pizza',
          description: 'Spicy pepperoni with cheese and tomato sauce.',
          calories: '810 cal',
          price: '﷼ 50',
          icons: ['🍕'],
          image: 'https://images.unsplash.com/photo-1548365329-48874cfe1ab7?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Vegetarian Pizza',
          description: 'Loaded with fresh vegetables, mozzarella, and herbs.',
          calories: '700 cal',
          price: '﷼ 48',
          icons: ['🍕'],
          image: 'https://images.unsplash.com/photo-1601924582971-035f9e9396b8?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Spaghetti Bolognese',
          description: 'Rich meat sauce served over al dente spaghetti.',
          calories: '680 cal',
          price: '﷼ 47',
          icons: ['🍝'],
          image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Penne Arrabbiata',
          description: 'Spicy tomato sauce with garlic and penne pasta.',
          calories: '620 cal',
          price: '﷼ 44',
          icons: ['🍝'],
          image: 'https://images.unsplash.com/photo-1601315561298-70eb2998f44d?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Lasagna',
          description: 'Layered pasta with meat, cheese, and rich tomato sauce.',
          calories: '750 cal',
          price: '﷼ 52',
          icons: ['🍝'],
          image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Seafood Pasta',
          description: 'Pasta tossed with shrimp, mussels, and a light garlic sauce.',
          calories: '710 cal',
          price: '﷼ 55',
          icons: ['🍝'],
          image: 'https://images.unsplash.com/photo-1543332164-37929f27c5f5?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    {
      title: 'DESSERTS',
      items: [
        {
          name: 'Fruit Skewers',
          description: 'Fresh seasonal fruit skewers served chilled.',
          calories: '150 cal',
          price: '﷼ 25',
          icons: ['🍓'],
          image: 'https://images.unsplash.com/photo-1505253210343-1ad73e2a8a5d?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    {
      title: 'HOT DRINKS',
      items: [
        {
          name: 'Double Espresso',
          description: 'Strong double shot of espresso.',
          calories: '10 cal',
          price: '﷼ 18',
          icons: ['☕'],
          image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Macchiato',
          description: 'Espresso with a small amount of steamed milk.',
          calories: '30 cal',
          price: '﷼ 20',
          icons: ['☕'],
          image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Americano',
          description: 'Espresso diluted with hot water for a smooth finish.',
          calories: '15 cal',
          price: '﷼ 18',
          icons: ['☕'],
          image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Latte',
          description: 'Creamy espresso drink with steamed milk.',
          calories: '180 cal',
          price: '﷼ 22',
          icons: ['☕'],
          image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Nescafe',
          description: 'Classic instant coffee served hot.',
          calories: '5 cal',
          price: '﷼ 15',
          icons: ['☕'],
          image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Turkish Coffee',
          description: 'Rich, strong coffee brewed Turkish-style.',
          calories: '20 cal',
          price: '﷼ 20',
          icons: ['☕'],
          image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Hot Chocolate',
          description: 'Warm chocolate drink topped with foam.',
          calories: '240 cal',
          price: '﷼ 22',
          icons: ['☕'],
          image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Cappuccino',
          description: 'Espresso with steamed milk and milk foam.',
          calories: '160 cal',
          price: '﷼ 22',
          icons: ['☕'],
          image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Espresso',
          description: 'Single shot of bold espresso.',
          calories: '5 cal',
          price: '﷼ 15',
          icons: ['☕'],
          image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Cortado',
          description: 'Espresso cut with a small amount of warm milk.',
          calories: '60 cal',
          price: '﷼ 20',
          icons: ['☕'],
          image: 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Red Tea',
          description: 'Hot red tea served traditional style.',
          calories: '0 cal',
          price: '﷼ 12',
          icons: ['🍵'],
          image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Green Tea',
          description: 'Soothing hot green tea.',
          calories: '0 cal',
          price: '﷼ 12',
          icons: ['🍵'],
          image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    {
      title: 'COLD DRINKS',
      items: [
        {
          name: 'Soft Drinks',
          description: 'Chilled sodas to refresh your meal.',
          calories: '150 cal',
          price: '﷼ 15',
          icons: ['🥤'],
          image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'RedBull',
          description: 'Energy drink to keep you going.',
          calories: '110 cal',
          price: '﷼ 20',
          icons: ['🥤'],
          image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Redbull With Flavor',
          description: 'Flavored energy drink for an extra kick.',
          calories: '120 cal',
          price: '﷼ 22',
          icons: ['🥤'],
          image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Holsten Beer',
          description: 'Cold Holsten beer served chilled.',
          calories: '200 cal',
          price: '﷼ 30',
          icons: ['🍺'],
          image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Iced Tea',
          description: 'Refreshing iced tea with a hint of lemon.',
          calories: '90 cal',
          price: '﷼ 18',
          icons: ['🥤'],
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Mojito',
          description: 'Classic mint mojito with lime and soda.',
          calories: '180 cal',
          price: '﷼ 28',
          icons: ['🍹'],
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Passion Fruit Mojito',
          description: 'Fruity twist on the classic mojito.',
          calories: '190 cal',
          price: '﷼ 30',
          icons: ['🍹'],
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Tropic Thunder',
          description: 'Tropical fruity drink served over ice.',
          calories: '160 cal',
          price: '﷼ 30',
          icons: ['🍹'],
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Love Potion',
          description: 'Sweet flavored drink with a romantic twist.',
          calories: '170 cal',
          price: '﷼ 32',
          icons: ['🍹'],
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Ceaser Pineapple Juice',
          description: 'Fresh pineapple juice with a tropical flavor.',
          calories: '120 cal',
          price: '﷼ 22',
          icons: ['🥤'],
          image: 'https://images.unsplash.com/photo-1547516508-4fc106dcd200?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Ceaser Apple Juice',
          description: 'Fresh apple juice served chilled.',
          calories: '110 cal',
          price: '﷼ 22',
          icons: ['🥤'],
          image: 'https://images.unsplash.com/photo-1547516508-4fc106dcd200?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Iced Latte',
          description: 'Chilled latte with ice and milk.',
          calories: '190 cal',
          price: '﷼ 25',
          icons: ['🥤'],
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Iced Mocha',
          description: 'Cold chocolate coffee drink over ice.',
          calories: '220 cal',
          price: '﷼ 27',
          icons: ['🥤'],
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Suntop Orange',
          description: 'Sweet orange juice in a chilled can.',
          calories: '130 cal',
          price: '﷼ 18',
          icons: ['🥤'],
          image: 'https://images.unsplash.com/photo-1547516508-4fc106dcd200?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Sparkling Water',
          description: 'Refreshing carbonated mineral water.',
          calories: '0 cal',
          price: '﷼ 12',
          icons: ['💧'],
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Mineral Water',
          description: 'Pure bottled mineral water.',
          calories: '0 cal',
          price: '﷼ 10',
          icons: ['💧'],
          image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    {
      title: 'SMOOTHIES',
      items: [
        {
          name: 'Orange Smoothie',
          description: 'Fresh orange smoothie with yogurt.',
          calories: '220 cal',
          price: '﷼ 30',
          icons: ['🥭'],
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Watermelon Smoothie',
          description: 'Refreshing watermelon blended with ice.',
          calories: '190 cal',
          price: '﷼ 30',
          icons: ['🍉'],
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Mango Smoothie',
          description: 'Creamy mango smoothie with tropical flavor.',
          calories: '230 cal',
          price: '﷼ 32',
          icons: ['🥭'],
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Pomegranate Smoothie',
          description: 'Rich pomegranate smoothie with a tart finish.',
          calories: '210 cal',
          price: '﷼ 32',
          icons: ['🍹'],
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Lemon & Mint',
          description: 'Zesty lemon smoothie with fresh mint.',
          calories: '180 cal',
          price: '﷼ 28',
          icons: ['🍋'],
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Pinacolada',
          description: 'Creamy pineapple coconut smoothie.',
          calories: '260 cal',
          price: '﷼ 34',
          icons: ['🥥'],
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Karkadeh',
          description: 'Hibiscus smoothie with sweet and tart notes.',
          calories: '170 cal',
          price: '﷼ 28',
          icons: ['🌺'],
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    {
      title: 'FRESH JUICES',
      items: [
        {
          name: 'Fresh Orange Juice',
          description: 'Freshly squeezed orange juice.',
          calories: '120 cal',
          price: '﷼ 22',
          icons: ['🍊'],
          image: 'https://images.unsplash.com/photo-1547516508-4fc106dcd200?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Fresh Watermelon Juice',
          description: 'Chilled watermelon juice.',
          calories: '110 cal',
          price: '﷼ 22',
          icons: ['🍉'],
          image: 'https://images.unsplash.com/photo-1547516508-4fc106dcd200?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Fresh Mango Juice',
          description: 'Fresh mango juice with tropical sweetness.',
          calories: '140 cal',
          price: '﷼ 25',
          icons: ['🥭'],
          image: 'https://images.unsplash.com/photo-1547516508-4fc106dcd200?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Tan Optimizer',
          description: 'Refreshing juice blend to energize your day.',
          calories: '130 cal',
          price: '﷼ 28',
          icons: ['🍹'],
          image: 'https://images.unsplash.com/photo-1547516508-4fc106dcd200?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Ora-ngo',
          description: 'Citrus juice with a zesty orange twist.',
          calories: '125 cal',
          price: '﷼ 28',
          icons: ['🍊'],
          image: 'https://images.unsplash.com/photo-1547516508-4fc106dcd200?auto=format&fit=crop&w=600&q=80',
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