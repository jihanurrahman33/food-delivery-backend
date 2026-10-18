"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRiderRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const createRiderRouter = (controller) => {
    const router = (0, express_1.Router)();
    router.use(auth_middleware_1.authenticateJwt);
    router.use((0, rbac_middleware_1.requireRole)('rider'));
    router.get('/dashboard', controller.getDashboard);
    router.get('/available-orders', controller.getAvailableDeliveries);
    router.post('/orders/:id/accept', controller.acceptDelivery);
    router.put('/orders/:id/status', controller.updateTripStatus);
    router.put('/status', controller.toggleOnlineStatus);
    return router;
};
exports.createRiderRouter = createRiderRouter;
