import { z } from 'zod';

export const createPaymentIntentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  paymentMethod: z.string().default('card'),
  provider: z.string().default('mock'),
});

export const verifyPaymentSchema = z.object({
  transactionReference: z.string().min(1, 'Transaction reference is required'),
  provider: z.string().default('mock'),
});

export const createAddressSchema = z.object({
  label: z.string().min(1).default('Home'),
  fullAddress: z.string().min(5, 'Full address is required'),
  street: z.string().min(2, 'Street is required'),
  apartment: z.string().optional(),
  deliveryNotes: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const createCardSchema = z.object({
  cardHolderName: z.string().min(2, 'Cardholder name is required'),
  cardNumber: z.string().min(12, 'Card number is required'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Expiry date must be MM/YY'),
  brand: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export const createReviewSchema = z.object({
  restaurantId: z.string().min(1, 'Restaurant ID is required'),
  orderId: z.string().optional(),
  rating: z.number().min(1).max(5),
  riderRating: z.number().min(1).max(5).optional(),
  comment: z.string().min(3, 'Review comment must be at least 3 characters').max(500),
});

export const addDishSchema = z.object({
  name: z.string().min(2, 'Dish name is required'),
  description: z.string().min(5, 'Description is required'),
  price: z.number().min(0.5, 'Price must be at least 0.50'),
  categoryId: z.string().min(1, 'Category ID is required'),
  calories: z.number().optional(),
  prepTimeMinutes: z.number().optional(),
  imageUrl: z.string().url().optional(),
  restaurantId: z.string().optional(),
});
