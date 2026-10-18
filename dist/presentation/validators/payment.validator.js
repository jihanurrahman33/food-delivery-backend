"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDishSchema = exports.createReviewSchema = exports.createCardSchema = exports.createAddressSchema = exports.verifyPaymentSchema = exports.createPaymentIntentSchema = void 0;
const zod_1 = require("zod");
exports.createPaymentIntentSchema = zod_1.z.object({
    orderId: zod_1.z.string().min(1, 'Order ID is required'),
    paymentMethod: zod_1.z.string().default('card'),
    provider: zod_1.z.string().default('mock'),
});
exports.verifyPaymentSchema = zod_1.z.object({
    transactionReference: zod_1.z.string().min(1, 'Transaction reference is required'),
    provider: zod_1.z.string().default('mock'),
});
exports.createAddressSchema = zod_1.z.object({
    label: zod_1.z.string().min(1).default('Home'),
    fullAddress: zod_1.z.string().min(5, 'Full address is required'),
    street: zod_1.z.string().min(2, 'Street is required'),
    apartment: zod_1.z.string().optional(),
    deliveryNotes: zod_1.z.string().optional(),
    isDefault: zod_1.z.boolean().optional(),
});
exports.createCardSchema = zod_1.z.object({
    cardHolderName: zod_1.z.string().min(2, 'Cardholder name is required'),
    cardNumber: zod_1.z.string().min(12, 'Card number is required'),
    expiryDate: zod_1.z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Expiry date must be MM/YY'),
    brand: zod_1.z.string().optional(),
    isDefault: zod_1.z.boolean().optional(),
});
exports.createReviewSchema = zod_1.z.object({
    restaurantId: zod_1.z.string().min(1, 'Restaurant ID is required'),
    orderId: zod_1.z.string().optional(),
    rating: zod_1.z.number().min(1).max(5),
    riderRating: zod_1.z.number().min(1).max(5).optional(),
    comment: zod_1.z.string().min(3, 'Review comment must be at least 3 characters').max(500),
});
exports.addDishSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Dish name is required'),
    description: zod_1.z.string().min(5, 'Description is required'),
    price: zod_1.z.number().min(0.5, 'Price must be at least 0.50'),
    categoryId: zod_1.z.string().min(1, 'Category ID is required'),
    calories: zod_1.z.number().optional(),
    prepTimeMinutes: zod_1.z.number().optional(),
    imageUrl: zod_1.z.string().url().optional(),
    restaurantId: zod_1.z.string().optional(),
});
