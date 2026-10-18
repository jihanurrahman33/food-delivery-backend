import { FoodAddon } from './food-item.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PREPARING = "preparing",
    ON_THE_WAY = "onTheWay",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export interface DeliveryRider {
    id: string;
    name: string;
    phone: string;
    avatarUrl: string;
    rating: number;
    vehicleType: string;
    licensePlate: string;
}
export interface OrderItem {
    id: string;
    foodItemId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    selectedAddons?: FoodAddon[];
    specialInstructions?: string;
    itemTotal: number;
}
export interface OrderEntity {
    id: string;
    userId: string;
    customerName?: string;
    customerPhone?: string;
    restaurantId: string;
    restaurantName: string;
    restaurantImageUrl: string;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    tax: number;
    discount: number;
    total: number;
    status: OrderStatus;
    deliveryAddress: string;
    paymentMethod: string;
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
    rider?: DeliveryRider;
    estimatedDeliveryMinutes: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}
