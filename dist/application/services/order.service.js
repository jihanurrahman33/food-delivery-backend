"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const uuid_1 = require("uuid");
const app_error_1 = require("../../core/errors/app-error");
const order_entity_1 = require("../../domain/entities/order.entity");
class OrderService {
    orderRepo;
    foodItemRepo;
    restaurantRepo;
    chatRepo;
    reviewRepo;
    constructor(orderRepo, foodItemRepo, restaurantRepo, chatRepo, reviewRepo) {
        this.orderRepo = orderRepo;
        this.foodItemRepo = foodItemRepo;
        this.restaurantRepo = restaurantRepo;
        this.chatRepo = chatRepo;
        this.reviewRepo = reviewRepo;
    }
    validatePromoCode(promoCode, subtotal) {
        const code = promoCode.trim().toUpperCase();
        if (code === 'SAVE20') {
            return { discount: parseFloat((subtotal * 0.2).toFixed(2)), rate: 0.2 };
        }
        if (code === 'FOODIE10') {
            return { discount: parseFloat((subtotal * 0.1).toFixed(2)), rate: 0.1 };
        }
        if (code === 'DISCOUNT40') {
            return { discount: parseFloat((subtotal * 0.4).toFixed(2)), rate: 0.4 };
        }
        throw app_error_1.AppError.badRequest(`Invalid or expired promo code: '${promoCode}'`);
    }
    async placeOrder(userId, customerName, customerPhone, dto) {
        const restaurant = await this.restaurantRepo.findById(dto.restaurantId);
        if (!restaurant) {
            throw app_error_1.AppError.notFound(`Restaurant '${dto.restaurantId}' not found`);
        }
        if (!dto.items || dto.items.length === 0) {
            throw app_error_1.AppError.badRequest('Cart items cannot be empty');
        }
        // Build verified items server-side to prevent client price spoofing
        const verifiedItems = [];
        let calculatedSubtotal = 0;
        for (const itemDto of dto.items) {
            const food = await this.foodItemRepo.findById(itemDto.foodItemId);
            if (!food) {
                throw app_error_1.AppError.notFound(`Food item '${itemDto.foodItemId}' not found`);
            }
            if (food.restaurantId !== restaurant.id) {
                throw app_error_1.AppError.badRequest(`Item '${food.name}' does not belong to restaurant '${restaurant.name}'`);
            }
            const selectedAddons = (food.availableAddons || []).filter((a) => itemDto.selectedAddonIds?.includes(a.id));
            const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
            const unitPrice = food.price + addonsTotal;
            const itemTotal = parseFloat((unitPrice * itemDto.quantity).toFixed(2));
            calculatedSubtotal += itemTotal;
            verifiedItems.push({
                id: `ci_${(0, uuid_1.v4)().replace(/-/g, '').substring(0, 10)}`,
                foodItemId: food.id,
                name: food.name,
                price: food.price,
                quantity: itemDto.quantity,
                imageUrl: food.imageUrl,
                selectedAddons,
                specialInstructions: itemDto.specialInstructions,
                itemTotal,
            });
        }
        calculatedSubtotal = parseFloat(calculatedSubtotal.toFixed(2));
        const deliveryFee = calculatedSubtotal >= 25.0 ? 0.0 : (restaurant.deliveryFee ?? 2.5);
        const tax = parseFloat((calculatedSubtotal * 0.08).toFixed(2));
        let discount = 0;
        if (dto.promoCode && dto.promoCode.trim().length > 0) {
            const promoResult = this.validatePromoCode(dto.promoCode, calculatedSubtotal);
            discount = promoResult.discount;
        }
        const total = parseFloat((calculatedSubtotal + deliveryFee + tax - discount).toFixed(2));
        const defaultRider = {
            id: 'rider_01',
            name: 'Robert Fox',
            phone: '+1 (555) 789-0123',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
            rating: 4.9,
            vehicleType: 'Vespa Sprint 150',
            licensePlate: 'NYC-5491',
        };
        const newOrder = {
            id: `FD-${Math.floor(10000 + Math.random() * 90000)}`,
            userId,
            customerName,
            customerPhone,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            restaurantImageUrl: restaurant.imageUrl,
            items: verifiedItems,
            subtotal: calculatedSubtotal,
            deliveryFee,
            tax,
            discount,
            total,
            status: order_entity_1.OrderStatus.CONFIRMED,
            deliveryAddress: dto.deliveryAddress,
            paymentMethod: dto.paymentMethod,
            paymentStatus: 'paid',
            rider: defaultRider,
            estimatedDeliveryMinutes: 25,
            notes: dto.notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        return this.orderRepo.create(newOrder);
    }
    async getActiveOrders(userId) {
        const all = await this.orderRepo.findAll({ userId });
        return all.filter((o) => o.status !== order_entity_1.OrderStatus.DELIVERED && o.status !== order_entity_1.OrderStatus.CANCELLED);
    }
    async getOrderHistory(userId) {
        const all = await this.orderRepo.findAll({ userId });
        return all.filter((o) => o.status === order_entity_1.OrderStatus.DELIVERED || o.status === order_entity_1.OrderStatus.CANCELLED);
    }
    async getOrderById(orderId, userId) {
        const order = await this.orderRepo.findById(orderId);
        if (!order) {
            throw app_error_1.AppError.notFound(`Order with ID '${orderId}' not found`);
        }
        // Ensure resource ownership (unless rider/chef/admin checks)
        if (userId && order.userId !== userId) {
            throw app_error_1.AppError.forbidden('You do not have permission to view this order');
        }
        return order;
    }
    async cancelOrder(orderId, userId) {
        const order = await this.getOrderById(orderId, userId);
        if (order.status === order_entity_1.OrderStatus.DELIVERED) {
            throw app_error_1.AppError.badRequest('Cannot cancel an order that has already been delivered');
        }
        if (order.status === order_entity_1.OrderStatus.CANCELLED) {
            throw app_error_1.AppError.badRequest('This order is already cancelled');
        }
        const updated = await this.orderRepo.update(orderId, { status: order_entity_1.OrderStatus.CANCELLED });
        if (!updated) {
            throw app_error_1.AppError.notFound('Order not found');
        }
        return updated;
    }
    async getChatMessages(orderId, userId) {
        await this.getOrderById(orderId, userId);
        return this.chatRepo.findByOrderId(orderId);
    }
    async sendChatMessage(orderId, senderId, senderRole, senderName, text) {
        await this.getOrderById(orderId);
        const message = {
            id: `msg_${(0, uuid_1.v4)().replace(/-/g, '').substring(0, 10)}`,
            orderId,
            senderId,
            senderRole,
            senderName,
            text: text.trim(),
            timestamp: new Date().toISOString(),
            isRead: true,
        };
        return this.chatRepo.create(message);
    }
    async rateOrder(orderId, userId, dto) {
        const order = await this.getOrderById(orderId, userId);
        if (dto.review && dto.review.trim().length > 0) {
            await this.reviewRepo.create({
                id: `rev_${(0, uuid_1.v4)().replace(/-/g, '').substring(0, 10)}`,
                restaurantId: order.restaurantId,
                orderId: order.id,
                userId,
                author: order.customerName || 'Customer',
                rating: dto.restaurantRating,
                riderRating: dto.riderRating,
                comment: dto.review.trim(),
                createdAt: new Date().toISOString(),
            });
        }
        return { success: true, message: 'Rating submitted successfully' };
    }
}
exports.OrderService = OrderService;
