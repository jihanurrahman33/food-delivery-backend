"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateOrderSchema = exports.sendChatSchema = exports.validatePromoSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
exports.createOrderSchema = zod_1.z.object({
    restaurantId: zod_1.z.string().min(1, 'Restaurant ID is required'),
    items: zod_1.z
        .array(zod_1.z.object({
        foodItemId: zod_1.z.string().min(1, 'Food item ID is required'),
        quantity: zod_1.z.number().int().min(1, 'Quantity must be at least 1'),
        selectedAddonIds: zod_1.z.array(zod_1.z.string()).optional(),
        specialInstructions: zod_1.z.string().max(200).optional(),
    }))
        .min(1, 'Order must contain at least 1 item'),
    deliveryAddress: zod_1.z.string().min(5, 'Delivery address is required'),
    paymentMethod: zod_1.z.string().min(1, 'Payment method is required'),
    promoCode: zod_1.z.string().optional(),
    notes: zod_1.z.string().max(300).optional(),
});
exports.validatePromoSchema = zod_1.z.object({
    promoCode: zod_1.z.string().min(1, 'Promo code is required'),
    subtotal: zod_1.z.number().min(0, 'Subtotal must be non-negative'),
});
exports.sendChatSchema = zod_1.z.object({
    text: zod_1.z.string().min(1, 'Message text cannot be empty').max(500),
});
exports.rateOrderSchema = zod_1.z.object({
    restaurantRating: zod_1.z.number().min(1).max(5),
    riderRating: zod_1.z.number().min(1).max(5).optional(),
    review: zod_1.z.string().max(500).optional(),
});
