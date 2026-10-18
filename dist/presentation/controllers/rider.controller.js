"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderController = void 0;
const api_response_1 = require("../../core/types/api-response");
class RiderController {
    riderService;
    constructor(riderService) {
        this.riderService = riderService;
    }
    getDashboard = async (req, res, next) => {
        try {
            const data = await this.riderService.getDashboardData(req.user.userId);
            res.status(200).json(api_response_1.ResponseFormatter.success(data, 'Rider dashboard retrieved', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getAvailableDeliveries = async (req, res, next) => {
        try {
            const deliveries = await this.riderService.getAvailableDeliveries();
            res.status(200).json(api_response_1.ResponseFormatter.success(deliveries, 'Available deliveries retrieved', { total: deliveries.length }, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    acceptDelivery = async (req, res, next) => {
        try {
            const id = req.params.id;
            const order = await this.riderService.acceptDelivery(id, req.user.userId, req.user?.email || 'Robert Fox');
            res.status(200).json(api_response_1.ResponseFormatter.success(order, 'Delivery accepted', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    updateTripStatus = async (req, res, next) => {
        try {
            const id = req.params.id;
            const { status } = req.body;
            const order = await this.riderService.updateTripStatus(id, status);
            res.status(200).json(api_response_1.ResponseFormatter.success(order, `Trip status updated to '${status}'`, undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    toggleOnlineStatus = async (req, res, next) => {
        try {
            const { isOnline } = req.body;
            const result = await this.riderService.toggleOnlineStatus(Boolean(isOnline));
            res.status(200).json(api_response_1.ResponseFormatter.success({ isOnline: result }, 'Rider online status updated', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
}
exports.RiderController = RiderController;
