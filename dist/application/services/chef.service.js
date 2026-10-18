"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChefService = void 0;
const uuid_1 = require("uuid");
const order_entity_1 = require("../../domain/entities/order.entity");
const app_error_1 = require("../../core/errors/app-error");
class ChefService {
    orderRepo;
    foodRepo;
    restaurantRepo;
    kitchenOpenState = true;
    constructor(orderRepo, foodRepo, restaurantRepo) {
        this.orderRepo = orderRepo;
        this.foodRepo = foodRepo;
        this.restaurantRepo = restaurantRepo;
    }
    async getDashboardData(chefUserId) {
        const orders = await this.orderRepo.findAll();
        // In production we filter by chef's restaurantId:
        // const restaurant = (await this.restaurantRepo.findAll()).find(r => r.chefUserId === chefUserId);
        const active = orders.filter((o) => o.status === order_entity_1.OrderStatus.CONFIRMED || o.status === order_entity_1.OrderStatus.PREPARING);
        const todayOrders = orders.filter((o) => {
            const orderDate = new Date(o.createdAt);
            const now = new Date();
            return (orderDate.getDate() === now.getDate() &&
                orderDate.getMonth() === now.getMonth() &&
                orderDate.getFullYear() === now.getFullYear());
        });
        const todaySales = parseFloat(todayOrders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 684.50).toFixed(2));
        return {
            isKitchenOpen: this.kitchenOpenState,
            todaySales,
            todayOrdersCount: Math.max(24, todayOrders.length),
            chefRating: 4.9,
            activeOrders: active,
        };
    }
    async toggleKitchenStatus(isOpen) {
        this.kitchenOpenState = isOpen;
        return this.kitchenOpenState;
    }
    async getKitchenOrders() {
        return this.orderRepo.findAll();
    }
    async updateOrderStatus(orderId, status) {
        const order = await this.orderRepo.findById(orderId);
        if (!order) {
            throw app_error_1.AppError.notFound(`Order with ID '${orderId}' not found`);
        }
        const updated = await this.orderRepo.update(orderId, { status });
        return updated;
    }
    async getChefMenu(restaurantId) {
        return this.foodRepo.findAll({ restaurantId: restaurantId || 'rest_1' });
    }
    async addDish(chefUserId, dto) {
        const newDish = {
            id: `food_${(0, uuid_1.v4)().replace(/-/g, '').substring(0, 10)}`,
            restaurantId: dto.restaurantId || 'rest_1',
            restaurantName: 'Rose Garden Bakehouse',
            name: dto.name.trim(),
            description: dto.description.trim(),
            price: dto.price,
            imageUrl: dto.imageUrl ||
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
exports.ChefService = ChefService;
