"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = exports.DependencyContainer = void 0;
const config_1 = require("./config");
const auth_service_1 = require("./application/services/auth.service");
const restaurant_service_1 = require("./application/services/restaurant.service");
const order_service_1 = require("./application/services/order.service");
const payment_service_1 = require("./application/services/payment.service");
const profile_service_1 = require("./application/services/profile.service");
const chef_service_1 = require("./application/services/chef.service");
const rider_service_1 = require("./application/services/rider.service");
const json_user_repository_1 = require("./infrastructure/persistence/json/repositories/json-user.repository");
const json_restaurant_repository_1 = require("./infrastructure/persistence/json/repositories/json-restaurant.repository");
const json_food_item_repository_1 = require("./infrastructure/persistence/json/repositories/json-food-item.repository");
const json_category_repository_1 = require("./infrastructure/persistence/json/repositories/json-category.repository");
const json_banner_repository_1 = require("./infrastructure/persistence/json/repositories/json-banner.repository");
const json_order_repository_1 = require("./infrastructure/persistence/json/repositories/json-order.repository");
const json_payment_repository_1 = require("./infrastructure/persistence/json/repositories/json-payment.repository");
const json_address_repository_1 = require("./infrastructure/persistence/json/repositories/json-address.repository");
const json_review_repository_1 = require("./infrastructure/persistence/json/repositories/json-review.repository");
const json_notification_repository_1 = require("./infrastructure/persistence/json/repositories/json-notification.repository");
const json_chat_message_repository_1 = require("./infrastructure/persistence/json/repositories/json-chat-message.repository");
const auth_controller_1 = require("./presentation/controllers/auth.controller");
const home_controller_1 = require("./presentation/controllers/home.controller");
const restaurant_controller_1 = require("./presentation/controllers/restaurant.controller");
const order_controller_1 = require("./presentation/controllers/order.controller");
const payment_controller_1 = require("./presentation/controllers/payment.controller");
const profile_controller_1 = require("./presentation/controllers/profile.controller");
const chef_controller_1 = require("./presentation/controllers/chef.controller");
const rider_controller_1 = require("./presentation/controllers/rider.controller");
const health_controller_1 = require("./presentation/controllers/health.controller");
class DependencyContainer {
    static instance;
    // Repositories
    userRepo;
    restaurantRepo;
    foodItemRepo;
    categoryRepo;
    bannerRepo;
    orderRepo;
    paymentRepo;
    addressRepo;
    reviewRepo;
    notificationRepo;
    chatRepo;
    // Services
    authService;
    restaurantService;
    orderService;
    paymentService;
    profileService;
    chefService;
    riderService;
    // Controllers
    authController;
    homeController;
    restaurantController;
    orderController;
    paymentController;
    profileController;
    chefController;
    riderController;
    healthController;
    constructor(dataDir = config_1.appConfig.DATA_DIR) {
        // 1. Initialize Repositories
        this.userRepo = new json_user_repository_1.JsonUserRepository(dataDir);
        this.restaurantRepo = new json_restaurant_repository_1.JsonRestaurantRepository(dataDir);
        this.foodItemRepo = new json_food_item_repository_1.JsonFoodItemRepository(dataDir);
        this.categoryRepo = new json_category_repository_1.JsonCategoryRepository(dataDir);
        this.bannerRepo = new json_banner_repository_1.JsonBannerRepository(dataDir);
        this.orderRepo = new json_order_repository_1.JsonOrderRepository(dataDir);
        this.paymentRepo = new json_payment_repository_1.JsonPaymentRepository(dataDir);
        this.addressRepo = new json_address_repository_1.JsonAddressRepository(dataDir);
        this.reviewRepo = new json_review_repository_1.JsonReviewRepository(dataDir);
        this.notificationRepo = new json_notification_repository_1.JsonNotificationRepository(dataDir);
        this.chatRepo = new json_chat_message_repository_1.JsonChatMessageRepository(dataDir);
        // 2. Initialize Services with Injected Repositories
        this.authService = new auth_service_1.AuthService(this.userRepo);
        this.restaurantService = new restaurant_service_1.RestaurantService(this.restaurantRepo, this.foodItemRepo, this.categoryRepo, this.bannerRepo, this.reviewRepo);
        this.orderService = new order_service_1.OrderService(this.orderRepo, this.foodItemRepo, this.restaurantRepo, this.chatRepo, this.reviewRepo);
        this.paymentService = new payment_service_1.PaymentService(this.paymentRepo, this.orderRepo);
        this.profileService = new profile_service_1.ProfileService(this.addressRepo, this.notificationRepo, this.userRepo);
        this.chefService = new chef_service_1.ChefService(this.orderRepo, this.foodItemRepo, this.restaurantRepo);
        this.riderService = new rider_service_1.RiderService(this.orderRepo);
        // 3. Initialize Controllers with Injected Services
        this.authController = new auth_controller_1.AuthController(this.authService);
        this.homeController = new home_controller_1.HomeController(this.restaurantService);
        this.restaurantController = new restaurant_controller_1.RestaurantController(this.restaurantService);
        this.orderController = new order_controller_1.OrderController(this.orderService);
        this.paymentController = new payment_controller_1.PaymentController(this.paymentService);
        this.profileController = new profile_controller_1.ProfileController(this.profileService);
        this.chefController = new chef_controller_1.ChefController(this.chefService);
        this.riderController = new rider_controller_1.RiderController(this.riderService);
        this.healthController = new health_controller_1.HealthController();
    }
    static getInstance(dataDir) {
        if (!DependencyContainer.instance || dataDir) {
            DependencyContainer.instance = new DependencyContainer(dataDir);
        }
        return DependencyContainer.instance;
    }
}
exports.DependencyContainer = DependencyContainer;
exports.container = DependencyContainer.getInstance();
