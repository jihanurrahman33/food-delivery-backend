"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderService = void 0;
const order_entity_1 = require("../../domain/entities/order.entity");
const app_error_1 = require("../../core/errors/app-error");
class RiderService {
    orderRepo;
    isOnlineState = true;
    todayEarningsState = 128.50;
    todayTripsState = 14;
    constructor(orderRepo) {
        this.orderRepo = orderRepo;
    }
    async getDashboardData(riderId) {
        const orders = await this.orderRepo.findAll();
        const available = orders.filter((o) => o.status === order_entity_1.OrderStatus.CONFIRMED);
        const active = orders.find((o) => o.rider?.id === riderId && (o.status === order_entity_1.OrderStatus.PREPARING || o.status === order_entity_1.OrderStatus.ON_THE_WAY)) || null;
        return {
            isOnline: this.isOnlineState,
            todayEarnings: this.todayEarningsState,
            todayTrips: this.todayTripsState,
            riderRating: 4.92,
            availableDeliveries: available,
            activeDelivery: active,
        };
    }
    async toggleOnlineStatus(isOnline) {
        this.isOnlineState = isOnline;
        return this.isOnlineState;
    }
    async getAvailableDeliveries() {
        const orders = await this.orderRepo.findAll();
        return orders.filter((o) => o.status === order_entity_1.OrderStatus.CONFIRMED || o.status === order_entity_1.OrderStatus.PREPARING);
    }
    async acceptDelivery(orderId, riderId, riderName) {
        const order = await this.orderRepo.findById(orderId);
        if (!order) {
            throw app_error_1.AppError.notFound(`Order with ID '${orderId}' not found`);
        }
        if (order.status === order_entity_1.OrderStatus.CANCELLED || order.status === order_entity_1.OrderStatus.DELIVERED) {
            throw app_error_1.AppError.badRequest('Cannot accept an order that is already completed or cancelled');
        }
        const updated = await this.orderRepo.update(orderId, {
            status: order_entity_1.OrderStatus.ON_THE_WAY,
            rider: {
                id: riderId,
                name: riderName,
                phone: '+1 (555) 789-0123',
                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
                rating: 4.9,
                vehicleType: 'Vespa Sprint 150',
                licensePlate: 'NYC-5491',
            },
        });
        return updated;
    }
    async updateTripStatus(orderId, status) {
        const order = await this.orderRepo.findById(orderId);
        if (!order) {
            throw app_error_1.AppError.notFound(`Order with ID '${orderId}' not found`);
        }
        const updated = await this.orderRepo.update(orderId, { status });
        if (status === order_entity_1.OrderStatus.DELIVERED) {
            this.todayEarningsState += 9.50;
            this.todayTripsState += 1;
        }
        return updated;
    }
}
exports.RiderService = RiderService;
