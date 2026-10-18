import { z } from 'zod';
export declare const createPaymentIntentSchema: z.ZodObject<{
    orderId: z.ZodString;
    paymentMethod: z.ZodDefault<z.ZodString>;
    provider: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export declare const verifyPaymentSchema: z.ZodObject<{
    transactionReference: z.ZodString;
    provider: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export declare const createAddressSchema: z.ZodObject<{
    label: z.ZodDefault<z.ZodString>;
    fullAddress: z.ZodString;
    street: z.ZodString;
    apartment: z.ZodOptional<z.ZodString>;
    deliveryNotes: z.ZodOptional<z.ZodString>;
    isDefault: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const createCardSchema: z.ZodObject<{
    cardHolderName: z.ZodString;
    cardNumber: z.ZodString;
    expiryDate: z.ZodString;
    brand: z.ZodOptional<z.ZodString>;
    isDefault: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const createReviewSchema: z.ZodObject<{
    restaurantId: z.ZodString;
    orderId: z.ZodOptional<z.ZodString>;
    rating: z.ZodNumber;
    riderRating: z.ZodOptional<z.ZodNumber>;
    comment: z.ZodString;
}, z.core.$strip>;
export declare const addDishSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    categoryId: z.ZodString;
    calories: z.ZodOptional<z.ZodNumber>;
    prepTimeMinutes: z.ZodOptional<z.ZodNumber>;
    imageUrl: z.ZodOptional<z.ZodString>;
    restaurantId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
