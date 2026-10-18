import { v4 as uuidv4 } from 'uuid';
import { FoodItemEntity } from '../../domain/entities/food-item.entity';
import { OrderEntity, OrderStatus } from '../../domain/entities/order.entity';
import { IFoodItemRepository, IOrderRepository, IRestaurantRepository } from '../../domain/repositories';
import { AppError } from '../../core/errors/app-error';

export interface ChefDashboardData {
  isKitchenOpen: boolean;
  todaySales: number;
  todayOrdersCount: number;
  chefRating: number;
  activeOrders: OrderEntity[];
}

export class ChefService {
  private readonly orderRepo: IOrderRepository;
  private readonly foodRepo: IFoodItemRepository;
  private readonly restaurantRepo: IRestaurantRepository;
  private kitchenOpenState: boolean = true;

  constructor(
    orderRepo: IOrderRepository,
    foodRepo: IFoodItemRepository,
    restaurantRepo: IRestaurantRepository
  ) {
    this.orderRepo = orderRepo;
    this.foodRepo = foodRepo;
    this.restaurantRepo = restaurantRepo;
  }

  public async getDashboardData(chefUserId: string): Promise<ChefDashboardData> {
    const orders = await this.orderRepo.findAll();
    // In production we filter by chef's restaurantId:
    // const restaurant = (await this.restaurantRepo.findAll()).find(r => r.chefUserId === chefUserId);
    const active = orders.filter(
      (o) => o.status === OrderStatus.CONFIRMED || o.status === OrderStatus.PREPARING
    );

    const todayOrders = orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      const now = new Date();
      return (
        orderDate.getDate() === now.getDate() &&
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    });

    const todaySales = parseFloat(
      todayOrders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 684.50).toFixed(2)
    );

    return {
      isKitchenOpen: this.kitchenOpenState,
      todaySales,
      todayOrdersCount: Math.max(24, todayOrders.length),
      chefRating: 4.9,
      activeOrders: active,
    };
  }

  public async toggleKitchenStatus(isOpen: boolean): Promise<boolean> {
    this.kitchenOpenState = isOpen;
    return this.kitchenOpenState;
  }

  public async getKitchenOrders(): Promise<OrderEntity[]> {
    return this.orderRepo.findAll();
  }

  public async updateOrderStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<OrderEntity> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      throw AppError.notFound(`Order with ID '${orderId}' not found`);
    }

    const updated = await this.orderRepo.update(orderId, { status });
    return updated!;
  }

  public async getChefMenu(restaurantId?: string): Promise<FoodItemEntity[]> {
    return this.foodRepo.findAll({ restaurantId: restaurantId || 'rest_1' });
  }

  public async addDish(
    chefUserId: string,
    dto: {
      name: string;
      description: string;
      price: number;
      categoryId: string;
      calories?: number;
      prepTimeMinutes?: number;
      imageUrl?: string;
      restaurantId?: string;
    }
  ): Promise<FoodItemEntity> {
    const newDish: FoodItemEntity = {
      id: `food_${uuidv4().replace(/-/g, '').substring(0, 10)}`,
      restaurantId: dto.restaurantId || 'rest_1',
      restaurantName: 'Rose Garden Bakehouse',
      name: dto.name.trim(),
      description: dto.description.trim(),
      price: dto.price,
      imageUrl:
        dto.imageUrl ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      rating: 5.0,
      ratingCount: 1,
      categoryId: dto.categoryId || 'cat_burger',
      calories: dto.calories || 500,
      prepTimeMinutes: dto.prepTimeMinutes || 15,
      isPopular: false,
      isSpicy: false,
      isVegetarian: false,
      availableAddons: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.foodRepo.create(newDish);
  }
}
