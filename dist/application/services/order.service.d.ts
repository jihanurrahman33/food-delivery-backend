import { ChatMessageEntity } from '../../domain/entities/chat-message.entity';
import { OrderEntity } from '../../domain/entities/order.entity';
import { IChatMessageRepository, IFoodItemRepository, IOrderRepository, IRestaurantRepository, IReviewRepository } from '../../domain/repositories';
export interface CreateOrderDto {
    restaurantId: string;
    items: Array<{
        foodItemId: string;
        quantity: number;
        selectedAddonIds?: string[];
        specialInstructions?: string;
    }>;
    deliveryAddress: string;
    paymentMethod: string;
    promoCode?: string;
    notes?: string;
}
export declare class OrderService {
    private readonly orderRepo;
    private readonly foodItemRepo;
    private readonly restaurantRepo;
    private readonly chatRepo;
    private readonly reviewRepo;
    constructor(orderRepo: IOrderRepository, foodItemRepo: IFoodItemRepository, restaurantRepo: IRestaurantRepository, chatRepo: IChatMessageRepository, reviewRepo: IReviewRepository);
    validatePromoCode(promoCode: string, subtotal: number): {
        discount: number;
        rate: number;
    };
    placeOrder(userId: string, customerName: string, customerPhone: string, dto: CreateOrderDto): Promise<OrderEntity>;
    getActiveOrders(userId: string): Promise<OrderEntity[]>;
    getOrderHistory(userId: string): Promise<OrderEntity[]>;
    getOrderById(orderId: string, userId?: string): Promise<OrderEntity>;
    cancelOrder(orderId: string, userId: string): Promise<OrderEntity>;
    getChatMessages(orderId: string, userId: string): Promise<ChatMessageEntity[]>;
    sendChatMessage(orderId: string, senderId: string, senderRole: 'customer' | 'rider' | 'restaurant', senderName: string, text: string): Promise<ChatMessageEntity>;
    rateOrder(orderId: string, userId: string, dto: {
        restaurantRating: number;
        riderRating?: number;
        review?: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
