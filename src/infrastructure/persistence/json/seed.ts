import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { appConfig } from '../../../config';
import { logger } from '../../../core/utils/logger';

export async function seedInitialData(dataDir: string = appConfig.DATA_DIR): Promise<void> {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const writeJsonIfMissing = (fileName: string, data: any) => {
    const fullPath = path.join(dataDir, `${fileName}.json`);
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
      logger.info(`Seeded ${fileName}.json`);
    }
  };

  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('password123', salt);

  // 1. Users
  const users = [
    {
      id: 'usr_001',
      name: 'Jihanur Rahman',
      email: 'jihanurrahman33@gmail.com',
      phone: '+1 (555) 234-5678',
      passwordHash: defaultPasswordHash,
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      role: 'customer',
      address: '76A Eighth Avenue, New York, NY 10011',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'usr_chef_1',
      name: 'Chef Gordon',
      email: 'chef@fooddelivery.com',
      phone: '+1 (555) 345-6789',
      passwordHash: defaultPasswordHash,
      avatarUrl:
        'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop&q=80',
      role: 'chef',
      address: 'Rose Garden Kitchen, West End',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'usr_rider_1',
      name: 'Robert Fox',
      email: 'rider@fooddelivery.com',
      phone: '+1 (555) 789-0123',
      passwordHash: defaultPasswordHash,
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      role: 'rider',
      address: 'Midtown Hub, New York, NY',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'usr_admin_1',
      name: 'System Admin',
      email: 'admin@fooddelivery.com',
      phone: '+1 (555) 999-0000',
      passwordHash: defaultPasswordHash,
      avatarUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      role: 'admin',
      address: 'Headquarters, New York, NY',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ];
  writeJsonIfMissing('users', users);

  // 2. Categories
  const categories = [
    {
      id: 'cat_all',
      name: 'All',
      icon: '🍽️',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200',
      sortOrder: 0,
    },
    {
      id: 'cat_burger',
      name: 'Burger',
      icon: '🍔',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200',
      sortOrder: 1,
    },
    {
      id: 'cat_pizza',
      name: 'Pizza',
      icon: '🍕',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200',
      sortOrder: 2,
    },
    {
      id: 'cat_asian',
      name: 'Asian',
      icon: '🍜',
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200',
      sortOrder: 3,
    },
    {
      id: 'cat_mexican',
      name: 'Mexican',
      icon: '🌮',
      imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200',
      sortOrder: 4,
    },
    {
      id: 'cat_dessert',
      name: 'Dessert',
      icon: '🍰',
      imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=200',
      sortOrder: 5,
    },
    {
      id: 'cat_drinks',
      name: 'Drinks',
      icon: '🥤',
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200',
      sortOrder: 6,
    },
  ];
  writeJsonIfMissing('categories', categories);

  // 3. Banners
  const banners = [
    {
      id: 'ban_1',
      title: 'Get Special Discount',
      subtitle: 'Up to 40% OFF on gourmet burgers',
      discountText: '40% OFF',
      imageUrl:
        'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
      actionRoute: '/restaurants',
    },
    {
      id: 'ban_2',
      title: 'Free Delivery Weekend',
      subtitle: 'Enjoy free delivery for orders above $25',
      discountText: 'FREE DELIVERY',
      imageUrl:
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
      actionRoute: '/offers',
    },
    {
      id: 'ban_3',
      title: 'Fresh Artisan Pizzas',
      subtitle: 'Handcrafted with organic ingredients',
      discountText: 'BUY 1 GET 1',
      imageUrl:
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
      actionRoute: '/restaurants',
    },
  ];
  writeJsonIfMissing('banners', banners);

  // 4. Restaurants
  const restaurants = [
    {
      id: 'rest_1',
      name: 'Rose Garden Bakehouse',
      imageUrl:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      logoUrl:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80',
      rating: 4.8,
      ratingCount: 382,
      deliveryTime: '20-25 min',
      deliveryFee: 2.5,
      distanceKm: 1.8,
      address: '42 Baker Street, West End',
      tags: ['Burger', 'American', 'Sandwiches'],
      isOpen: true,
      isFeatured: true,
      chefUserId: 'usr_chef_1',
    },
    {
      id: 'rest_2',
      name: 'Piazza Bella Napoli',
      imageUrl:
        'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&auto=format&fit=crop&q=80',
      logoUrl:
        'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=150&auto=format&fit=crop&q=80',
      rating: 4.9,
      ratingCount: 520,
      deliveryTime: '25-30 min',
      deliveryFee: 0.0,
      distanceKm: 2.4,
      address: '15 Little Italy Blvd, Downtown',
      tags: ['Pizza', 'Italian', 'Pasta'],
      isOpen: true,
      isFeatured: true,
    },
    {
      id: 'rest_3',
      name: 'Tokyo Ramen & Sushi Bar',
      imageUrl:
        'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&auto=format&fit=crop&q=80',
      logoUrl:
        'https://images.unsplash.com/photo-1552611052-33e04de081de?w=150&auto=format&fit=crop&q=80',
      rating: 4.7,
      ratingCount: 290,
      deliveryTime: '15-20 min',
      deliveryFee: 1.99,
      distanceKm: 1.2,
      address: '88 Sakura Way, Midtown',
      tags: ['Asian', 'Ramen', 'Japanese'],
      isOpen: true,
      isFeatured: false,
    },
    {
      id: 'rest_4',
      name: 'El Fuego Cantina',
      imageUrl:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
      logoUrl:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=150&auto=format&fit=crop&q=80',
      rating: 4.6,
      ratingCount: 215,
      deliveryTime: '30-35 min',
      deliveryFee: 3.0,
      distanceKm: 3.5,
      address: '124 Sonora Plaza, South Bay',
      tags: ['Mexican', 'Tacos', 'Burritos'],
      isOpen: true,
      isFeatured: false,
    },
  ];
  writeJsonIfMissing('restaurants', restaurants);

  // 5. Foods
  const burgerAddons = [
    { id: 'add_1', name: 'Extra Cheddar Cheese', price: 1.5 },
    { id: 'add_2', name: 'Crispy Smoked Bacon', price: 2.25 },
    { id: 'add_3', name: 'Caramelized Onions', price: 0.95 },
    { id: 'add_4', name: 'Spicy Jalapeno Peppers', price: 0.75 },
    { id: 'add_5', name: 'Truffle Mayo Dip', price: 1.25 },
  ];

  const pizzaAddons = [
    { id: 'add_6', name: 'Stuffed Garlic Crust', price: 2.5 },
    { id: 'add_7', name: 'Extra Mozzarella', price: 1.95 },
    { id: 'add_8', name: 'Mushrooms & Olives', price: 1.2 },
    { id: 'add_9', name: 'Pepperoni Slices', price: 2.0 },
  ];

  const foods = [
    {
      id: 'food_1',
      restaurantId: 'rest_1',
      restaurantName: 'Rose Garden Bakehouse',
      name: 'Classic Smash Cheeseburger',
      description:
        'Juicy double smashed angus beef patties, melted aged cheddar, secret house aioli, caramelized onions, and crisp dill pickles on toasted brioche.',
      price: 9.99,
      imageUrl:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
      rating: 4.9,
      ratingCount: 142,
      categoryId: 'cat_burger',
      calories: 620,
      prepTimeMinutes: 15,
      isPopular: true,
      isSpicy: false,
      isVegetarian: false,
      availableAddons: burgerAddons,
    },
    {
      id: 'food_2',
      restaurantId: 'rest_1',
      restaurantName: 'Rose Garden Bakehouse',
      name: 'Spicy Crispy Chicken Deluxe',
      description:
        'Golden crispy buttermilk chicken breast coated in Nashville hot spices, sweet pickled slaw, and chipotle mayo.',
      price: 11.5,
      imageUrl:
        'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80',
      rating: 4.8,
      ratingCount: 98,
      categoryId: 'cat_burger',
      calories: 580,
      prepTimeMinutes: 18,
      isPopular: true,
      isSpicy: true,
      isVegetarian: false,
      availableAddons: burgerAddons,
    },
    {
      id: 'food_3',
      restaurantId: 'rest_2',
      restaurantName: 'Piazza Bella Napoli',
      name: 'Woodfired Margherita DOC',
      description:
        'San Marzano tomato sauce, fresh buffalo mozzarella, fragrant Genovese basil, and extra virgin olive oil.',
      price: 14.25,
      imageUrl:
        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80',
      rating: 4.9,
      ratingCount: 210,
      categoryId: 'cat_pizza',
      calories: 780,
      prepTimeMinutes: 20,
      isPopular: true,
      isSpicy: false,
      isVegetarian: true,
      availableAddons: pizzaAddons,
    },
    {
      id: 'food_4',
      restaurantId: 'rest_2',
      restaurantName: 'Piazza Bella Napoli',
      name: 'Diavola Pepperoni Crunch',
      description:
        'Zesty pepperoni slices, spicy calabrian chilis, crushed tomatoes, and smoked provolone cheese on blistered sourdough.',
      price: 16.5,
      imageUrl:
        'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',
      rating: 4.7,
      ratingCount: 165,
      categoryId: 'cat_pizza',
      calories: 840,
      prepTimeMinutes: 20,
      isPopular: false,
      isSpicy: true,
      isVegetarian: false,
      availableAddons: pizzaAddons,
    },
    {
      id: 'food_5',
      restaurantId: 'rest_3',
      restaurantName: 'Tokyo Ramen & Sushi Bar',
      name: 'Rich Tonkotsu Black Garlic Ramen',
      description:
        'Slow simmered 16-hour pork bone broth, springy ramen noodles, tender chashu pork belly, ajitsuke tamago egg, and fragrant black garlic oil.',
      price: 15.0,
      imageUrl:
        'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
      rating: 4.9,
      ratingCount: 320,
      categoryId: 'cat_asian',
      calories: 650,
      prepTimeMinutes: 12,
      isPopular: true,
      isSpicy: false,
      isVegetarian: false,
      availableAddons: [],
    },
    {
      id: 'food_6',
      restaurantId: 'rest_4',
      restaurantName: 'El Fuego Cantina',
      name: 'Birria Beef Tacos Trio',
      description:
        'Three slow-braised beef birria tacos with melted cheese, diced onions, cilantro, and warm rich consommé for dipping.',
      price: 13.5,
      imageUrl:
        'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80',
      rating: 4.8,
      ratingCount: 180,
      categoryId: 'cat_mexican',
      calories: 710,
      prepTimeMinutes: 15,
      isPopular: true,
      isSpicy: true,
      isVegetarian: false,
      availableAddons: [],
    },
  ];
  writeJsonIfMissing('foods', foods);

  // 6. Addresses
  const addresses = [
    {
      id: 'addr_1',
      userId: 'usr_001',
      label: 'Home',
      fullAddress: '76A Eighth Avenue, New York, NY 10011',
      street: '76A Eighth Avenue',
      apartment: 'Apt 4B',
      deliveryNotes: 'Leave in lobby by door phone',
      isDefault: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'addr_2',
      userId: 'usr_001',
      label: 'Office',
      fullAddress: '450 Lexington Ave, New York, NY 10017',
      street: '450 Lexington Ave',
      apartment: 'Floor 12, Tech Hub',
      deliveryNotes: 'Call upon arrival',
      isDefault: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'addr_3',
      userId: 'usr_001',
      label: 'Parents',
      fullAddress: '128 Queens Blvd, Forest Hills, NY 11375',
      street: '128 Queens Blvd',
      apartment: 'House #3',
      deliveryNotes: 'Ring bell twice',
      isDefault: false,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ];
  writeJsonIfMissing('addresses', addresses);

  // 7. Payment Cards
  const paymentCards = [
    {
      id: 'card_1',
      userId: 'usr_001',
      cardHolderName: 'Jihanur Rahman',
      cardNumber: '•••• •••• •••• 4242',
      expiryDate: '08/28',
      brand: 'Visa',
      isDefault: true,
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'card_2',
      userId: 'usr_001',
      cardHolderName: 'Jihanur Rahman',
      cardNumber: '•••• •••• •••• 8821',
      expiryDate: '11/27',
      brand: 'Mastercard',
      isDefault: false,
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  ];
  writeJsonIfMissing('payment_cards', paymentCards);

  // 8. Orders
  const rider = {
    id: 'rider_01',
    name: 'Robert Fox',
    phone: '+1 (555) 789-0123',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    rating: 4.9,
    vehicleType: 'Vespa Sprint 150',
    licensePlate: 'NYC-5491',
  };

  const orders = [
    {
      id: 'FD-98421',
      userId: 'usr_001',
      customerName: 'Jihanur Rahman',
      customerPhone: '+1 (555) 234-5678',
      restaurantId: 'rest_1',
      restaurantName: 'Rose Garden Bakehouse',
      restaurantImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
      items: [
        {
          id: 'ci_1',
          foodItemId: 'food_1',
          name: 'Classic Smash Cheeseburger',
          price: 9.99,
          quantity: 2,
          selectedAddons: [{ id: 'add_1', name: 'Extra Cheddar Cheese', price: 1.5 }],
          itemTotal: 22.98,
        },
        {
          id: 'ci_2',
          foodItemId: 'food_2',
          name: 'Spicy Crispy Chicken Deluxe',
          price: 11.5,
          quantity: 1,
          selectedAddons: [],
          itemTotal: 11.5,
        },
      ],
      subtotal: 32.98,
      deliveryFee: 2.5,
      tax: 2.64,
      discount: 5.0,
      total: 33.12,
      status: 'onTheWay',
      deliveryAddress: '76A Eighth Avenue, New York, NY 10011',
      paymentMethod: 'Visa •••• 4242',
      paymentStatus: 'paid',
      rider,
      estimatedDeliveryMinutes: 12,
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: 'FD-77210',
      userId: 'usr_001',
      customerName: 'Jihanur Rahman',
      customerPhone: '+1 (555) 234-5678',
      restaurantId: 'rest_2',
      restaurantName: 'Piazza Bella Napoli',
      restaurantImageUrl: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=400',
      items: [
        {
          id: 'ci_3',
          foodItemId: 'food_3',
          name: 'Woodfired Margherita DOC',
          price: 14.25,
          quantity: 1,
          selectedAddons: [],
          itemTotal: 14.25,
        },
      ],
      subtotal: 14.25,
      deliveryFee: 0.0,
      tax: 1.14,
      discount: 0.0,
      total: 15.39,
      status: 'delivered',
      deliveryAddress: '76A Eighth Avenue, New York, NY 10011',
      paymentMethod: 'Visa •••• 4242',
      paymentStatus: 'paid',
      rider,
      estimatedDeliveryMinutes: 0,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  writeJsonIfMissing('orders', orders);

  // 9. Notifications
  const notifications = [
    {
      id: 'notif_1',
      userId: 'usr_001',
      title: 'Your order has been picked up!',
      description: 'Robert Fox is on the way with your delicious meal from Rose Garden Bakehouse.',
      time: '10 min ago',
      iconName: 'delivery_dining',
      isRead: false,
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      id: 'notif_2',
      userId: 'usr_001',
      title: 'Flash Deal: 40% OFF Gourmet Burgers',
      description: 'Use promo code SAVE20 on your next order. Valid until midnight!',
      time: '2 hours ago',
      iconName: 'local_offer',
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'notif_3',
      userId: 'usr_001',
      title: 'Payment Confirmed',
      description: 'Payment of $33.12 via Visa •••• 4242 was successful.',
      time: 'Yesterday',
      iconName: 'check_circle',
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  writeJsonIfMissing('notifications', notifications);

  // 10. Chat Messages
  const chatMessages = [
    {
      id: 'msg_1',
      orderId: 'FD-98421',
      senderId: 'usr_rider_1',
      senderRole: 'rider',
      senderName: 'Robert Fox',
      text: 'Hello! I have picked up your order from Rose Garden Bakehouse.',
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: 'msg_2',
      orderId: 'FD-98421',
      senderId: 'usr_001',
      senderRole: 'customer',
      senderName: 'Jihanur Rahman',
      text: 'Great, thanks! Please leave it with the front desk if needed.',
      timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: 'msg_3',
      orderId: 'FD-98421',
      senderId: 'usr_rider_1',
      senderRole: 'rider',
      senderName: 'Robert Fox',
      text: 'Sure thing, I will be there in about 10 minutes!',
      timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      isRead: true,
    },
  ];
  writeJsonIfMissing('chat_messages', chatMessages);

  // 11. Reviews
  const reviews = [
    {
      id: 'rev_1',
      restaurantId: 'rest_1',
      orderId: 'FD-98421',
      userId: 'usr_001',
      author: 'Courtney Henry',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
      rating: 5.0,
      riderRating: 5.0,
      comment: 'Best smash burger in the neighborhood. Arrived hot and crispy, the secret aioli is sensational!',
      createdAt: '2026-01-10T12:00:00.000Z',
    },
    {
      id: 'rev_2',
      restaurantId: 'rest_1',
      userId: 'usr_002',
      author: 'Devon Lane',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
      rating: 4.8,
      comment: 'Super fast delivery and fresh ingredients. Definitely ordering again next Friday.',
      createdAt: '2026-01-12T14:30:00.000Z',
    },
    {
      id: 'rev_3',
      restaurantId: 'rest_2',
      userId: 'usr_003',
      author: 'Jane Cooper',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      rating: 5.0,
      comment: 'Authentic Neapolitan pizza crust! Chewy yet airy, tomato sauce tastes like real Italy.',
      createdAt: '2026-01-14T18:45:00.000Z',
    },
  ];
  writeJsonIfMissing('reviews', reviews);

  // 12. Payments
  const payments = [
    {
      id: 'pay_1',
      orderId: 'FD-98421',
      userId: 'usr_001',
      amount: 33.12,
      currency: 'USD',
      provider: 'mock',
      paymentMethod: 'card',
      transactionReference: 'txn_mock_seed_98421',
      status: 'succeeded',
      metadata: { orderId: 'FD-98421' },
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
  ];
  writeJsonIfMissing('payments', payments);

  logger.info('Database seed complete!');
}

if (require.main === module) {
  seedInitialData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
