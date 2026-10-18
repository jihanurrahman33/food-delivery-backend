import { appConfig } from './config';
import { AuthService } from './application/services/auth.service';
import { RestaurantService } from './application/services/restaurant.service';
import { OrderService } from './application/services/order.service';
import { PaymentService } from './application/services/payment.service';
import { ProfileService } from './application/services/profile.service';
import { ChefService } from './application/services/chef.service';
import { RiderService } from './application/services/rider.service';
import {
  IAddressRepository,
  IBannerRepository,
  ICategoryRepository,
  IChatMessageRepository,
  IFoodItemRepository,
  INotificationRepository,
  IOrderRepository,
  IPaymentRepository,
  IRestaurantRepository,
  IReviewRepository,
  IUserRepository,
} from './domain/repositories';
import { JsonUserRepository } from './infrastructure/persistence/json/repositories/json-user.repository';
import { JsonRestaurantRepository } from './infrastructure/persistence/json/repositories/json-restaurant.repository';
import { JsonFoodItemRepository } from './infrastructure/persistence/json/repositories/json-food-item.repository';
import { JsonCategoryRepository } from './infrastructure/persistence/json/repositories/json-category.repository';
import { JsonBannerRepository } from './infrastructure/persistence/json/repositories/json-banner.repository';
import { JsonOrderRepository } from './infrastructure/persistence/json/repositories/json-order.repository';
import { JsonPaymentRepository } from './infrastructure/persistence/json/repositories/json-payment.repository';
import { JsonAddressRepository } from './infrastructure/persistence/json/repositories/json-address.repository';
import { JsonReviewRepository } from './infrastructure/persistence/json/repositories/json-review.repository';
import { JsonNotificationRepository } from './infrastructure/persistence/json/repositories/json-notification.repository';
import { JsonChatMessageRepository } from './infrastructure/persistence/json/repositories/json-chat-message.repository';
import { AuthController } from './presentation/controllers/auth.controller';
import { HomeController } from './presentation/controllers/home.controller';
import { RestaurantController } from './presentation/controllers/restaurant.controller';
import { OrderController } from './presentation/controllers/order.controller';
import { PaymentController } from './presentation/controllers/payment.controller';
import { ProfileController } from './presentation/controllers/profile.controller';
import { ChefController } from './presentation/controllers/chef.controller';
import { RiderController } from './presentation/controllers/rider.controller';
import { HealthController } from './presentation/controllers/health.controller';

export class DependencyContainer {
  private static instance: DependencyContainer;

  // Repositories
  public readonly userRepo: IUserRepository;
  public readonly restaurantRepo: IRestaurantRepository;
  public readonly foodItemRepo: IFoodItemRepository;
  public readonly categoryRepo: ICategoryRepository;
  public readonly bannerRepo: IBannerRepository;
  public readonly orderRepo: IOrderRepository;
  public readonly paymentRepo: IPaymentRepository;
  public readonly addressRepo: IAddressRepository;
  public readonly reviewRepo: IReviewRepository;
  public readonly notificationRepo: INotificationRepository;
  public readonly chatRepo: IChatMessageRepository;

  // Services
  public readonly authService: AuthService;
  public readonly restaurantService: RestaurantService;
  public readonly orderService: OrderService;
  public readonly paymentService: PaymentService;
  public readonly profileService: ProfileService;
  public readonly chefService: ChefService;
  public readonly riderService: RiderService;

  // Controllers
  public readonly authController: AuthController;
  public readonly homeController: HomeController;
  public readonly restaurantController: RestaurantController;
  public readonly orderController: OrderController;
  public readonly paymentController: PaymentController;
  public readonly profileController: ProfileController;
  public readonly chefController: ChefController;
  public readonly riderController: RiderController;
  public readonly healthController: HealthController;

  constructor(dataDir: string = appConfig.DATA_DIR) {
    // 1. Initialize Repositories
    this.userRepo = new JsonUserRepository(dataDir);
    this.restaurantRepo = new JsonRestaurantRepository(dataDir);
    this.foodItemRepo = new JsonFoodItemRepository(dataDir);
    this.categoryRepo = new JsonCategoryRepository(dataDir);
    this.bannerRepo = new JsonBannerRepository(dataDir);
    this.orderRepo = new JsonOrderRepository(dataDir);
    this.paymentRepo = new JsonPaymentRepository(dataDir);
    this.addressRepo = new JsonAddressRepository(dataDir);
    this.reviewRepo = new JsonReviewRepository(dataDir);
    this.notificationRepo = new JsonNotificationRepository(dataDir);
    this.chatRepo = new JsonChatMessageRepository(dataDir);

    // 2. Initialize Services with Injected Repositories
    this.authService = new AuthService(this.userRepo);
    this.restaurantService = new RestaurantService(
      this.restaurantRepo,
      this.foodItemRepo,
      this.categoryRepo,
      this.bannerRepo,
      this.reviewRepo
    );
    this.orderService = new OrderService(
      this.orderRepo,
      this.foodItemRepo,
      this.restaurantRepo,
      this.chatRepo,
      this.reviewRepo
    );
    this.paymentService = new PaymentService(this.paymentRepo, this.orderRepo);
    this.profileService = new ProfileService(this.addressRepo, this.notificationRepo, this.userRepo);
    this.chefService = new ChefService(this.orderRepo, this.foodItemRepo, this.restaurantRepo);
    this.riderService = new RiderService(this.orderRepo);

    // 3. Initialize Controllers with Injected Services
    this.authController = new AuthController(this.authService);
    this.homeController = new HomeController(this.restaurantService);
    this.restaurantController = new RestaurantController(this.restaurantService);
    this.orderController = new OrderController(this.orderService);
    this.paymentController = new PaymentController(this.paymentService);
    this.profileController = new ProfileController(this.profileService);
    this.chefController = new ChefController(this.chefService);
    this.riderController = new RiderController(this.riderService);
    this.healthController = new HealthController();
  }

  public static getInstance(dataDir?: string): DependencyContainer {
    if (!DependencyContainer.instance || dataDir) {
      DependencyContainer.instance = new DependencyContainer(dataDir);
    }
    return DependencyContainer.instance;
  }
}

export const container = DependencyContainer.getInstance();
