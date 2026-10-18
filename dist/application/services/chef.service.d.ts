import { FoodItemEntity } from '../../domain/entities/food-item.entity';
import { OrderEntity, OrderStatus } from '../../domain/entities/order.entity';
import { IFoodItemRepository, IOrderRepository, IRestaurantRepository } from '../../domain/repositories';
export interface ChefDashboardData {
    isKitchenOpen: boolean;
    todaySales: number;
    todayOrdersCount: number;
    chefRating: number;
    activeOrders: OrderEntity[];
}
export declare class ChefService {
    private readonly orderRepo;
    private readonly foodRepo;
    private readonly restaurantRepo;
    private kitchenOpenState;
    constructor(orderRepo: IOrderRepository, foodRepo: IFoodItemRepository, restaurantRepo: IRestaurantRepository);
    getDashboardData(chefUserId: string): Promise<ChefDashboardData>;
    toggleKitchenStatus(isOpen: boolean): Promise<boolean>;
    getKitchenOrders(): Promise<OrderEntity[]>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<OrderEntity>;
    getChefMenu(restaurantId?: string): Promise<FoodItemEntity[]>;
    addDish(chefUserId: string, dto: {
        name: string;
        description: string;
        price: number;
        categoryId: string;
        calories?: number;
        prepTimeMinutes?: number;
        imageUrl?: string;
        restaurantId?: string;
    }): Promise<FoodItemEntity>;
}
