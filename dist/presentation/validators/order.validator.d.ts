import { z } from 'zod';
export declare const createOrderSchema: z.ZodObject<{
    restaurantId: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        foodItemId: z.ZodString;
        quantity: z.ZodNumber;
        selectedAddonIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        specialInstructions: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    deliveryAddress: z.ZodString;
    paymentMethod: z.ZodString;
    promoCode: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const validatePromoSchema: z.ZodObject<{
    promoCode: z.ZodString;
    subtotal: z.ZodNumber;
}, z.core.$strip>;
export declare const sendChatSchema: z.ZodObject<{
    text: z.ZodString;
}, z.core.$strip>;
export declare const rateOrderSchema: z.ZodObject<{
    restaurantRating: z.ZodNumber;
    riderRating: z.ZodOptional<z.ZodNumber>;
    review: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
