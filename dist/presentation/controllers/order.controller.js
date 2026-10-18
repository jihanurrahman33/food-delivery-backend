"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const api_response_1 = require("../../core/types/api-response");
class OrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    placeOrder = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const order = await this.orderService.placeOrder(userId, req.user?.email || 'Customer', '+1 (555) 234-5678', req.body);
            res.status(201).json(api_response_1.ResponseFormatter.success(order, 'Order placed successfully', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getActiveOrders = async (req, res, next) => {
        try {
            const orders = await this.orderService.getActiveOrders(req.user.userId);
            res.status(200).json(api_response_1.ResponseFormatter.success(orders, 'Active orders retrieved', { total: orders.length }, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getOrderHistory = async (req, res, next) => {
        try {
            const orders = await this.orderService.getOrderHistory(req.user.userId);
            res.status(200).json(api_response_1.ResponseFormatter.success(orders, 'Order history retrieved', { total: orders.length }, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getOrderById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const order = await this.orderService.getOrderById(id, req.user.userId);
            res.status(200).json(api_response_1.ResponseFormatter.success(order, 'Order details retrieved', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    cancelOrder = async (req, res, next) => {
        try {
            const id = req.params.id;
            const order = await this.orderService.cancelOrder(id, req.user.userId);
            res.status(200).json(api_response_1.ResponseFormatter.success(order, 'Order cancelled successfully', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    validatePromo = async (req, res, next) => {
        try {
            const { promoCode, subtotal } = req.body;
            const result = this.orderService.validatePromoCode(promoCode, subtotal);
            res.status(200).json(api_response_1.ResponseFormatter.success(result, 'Promo code applied', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getChatMessages = async (req, res, next) => {
        try {
            const id = req.params.id;
            const messages = await this.orderService.getChatMessages(id, req.user.userId);
            res.status(200).json(api_response_1.ResponseFormatter.success(messages, 'Chat messages retrieved', { total: messages.length }, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    sendChatMessage = async (req, res, next) => {
        try {
            const id = req.params.id;
            const message = await this.orderService.sendChatMessage(id, req.user.userId, req.user.role, req.user.email, req.body.text);
            res.status(201).json(api_response_1.ResponseFormatter.success(message, 'Message sent successfully', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    rateOrder = async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await this.orderService.rateOrder(id, req.user.userId, req.body);
            res.status(200).json(api_response_1.ResponseFormatter.success(result, result.message, undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
}
exports.OrderController = OrderController;
