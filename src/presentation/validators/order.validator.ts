import { z } from 'zod';

export const createOrderSchema = z.object({
  restaurantId: z.string().min(1, 'Restaurant ID is required'),
  items: z
    .array(
      z.object({
        foodItemId: z.string().min(1, 'Food item ID is required'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1'),
        selectedAddonIds: z.array(z.string()).optional(),
        specialInstructions: z.string().max(200).optional(),
      })
    )
    .min(1, 'Order must contain at least 1 item'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  promoCode: z.string().optional(),
  notes: z.string().max(300).optional(),
});

export const validatePromoSchema = z.object({
  promoCode: z.string().min(1, 'Promo code is required'),
  subtotal: z.number().min(0, 'Subtotal must be non-negative'),
});

export const sendChatSchema = z.object({
  text: z.string().min(1, 'Message text cannot be empty').max(500),
});

export const rateOrderSchema = z.object({
  restaurantRating: z.number().min(1).max(5),
  riderRating: z.number().min(1).max(5).optional(),
  review: z.string().max(500).optional(),
});
