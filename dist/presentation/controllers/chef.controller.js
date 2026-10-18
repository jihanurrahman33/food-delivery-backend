"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChefController = void 0;
const api_response_1 = require("../../core/types/api-response");
class ChefController {
    chefService;
    constructor(chefService) {
        this.chefService = chefService;
    }
    getDashboard = async (req, res, next) => {
        try {
            const data = await this.chefService.getDashboardData(req.user.userId);
            res.status(200).json(api_response_1.ResponseFormatter.success(data, 'Chef dashboard data retrieved', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getOrders = async (req, res, next) => {
        try {
            const orders = await this.chefService.getKitchenOrders();
            res.status(200).json(api_response_1.ResponseFormatter.success(orders, 'Kitchen orders retrieved', { total: orders.length }, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    updateOrderStatus = async (req, res, next) => {
        try {
            const id = req.params.id;
            const { status } = req.body;
            const updated = await this.chefService.updateOrderStatus(id, status);
            res.status(200).json(api_response_1.ResponseFormatter.success(updated, `Order updated to '${status}'`, undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    toggleKitchenStatus = async (req, res, next) => {
        try {
            const { isOpen } = req.body;
            const result = await this.chefService.toggleKitchenStatus(Boolean(isOpen));
            res.status(200).json(api_response_1.ResponseFormatter.success({ isKitchenOpen: result }, 'Kitchen status updated', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getMenu = async (req, res, next) => {
        try {
            const menu = await this.chefService.getChefMenu();
            res.status(200).json(api_response_1.ResponseFormatter.success(menu, 'Chef menu retrieved', { total: menu.length }, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    addDish = async (req, res, next) => {
        try {
            const dish = await this.chefService.addDish(req.user.userId, req.body);
            res.status(201).json(api_response_1.ResponseFormatter.success(dish, 'New dish added to menu', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
}
exports.ChefController = ChefController;
