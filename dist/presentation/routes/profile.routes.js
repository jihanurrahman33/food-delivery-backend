"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfileRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_validator_1 = require("../validators/auth.validator");
const payment_validator_1 = require("../validators/payment.validator");
const createProfileRouter = (controller) => {
    const router = (0, express_1.Router)();
    // Profile info
    router.get('/profile', auth_middleware_1.authenticateJwt, controller.getProfile);
    router.put('/profile', auth_middleware_1.authenticateJwt, (0, validate_middleware_1.validateRequest)({ body: auth_validator_1.updateProfileSchema }), controller.updateProfile);
    // Address routes
    router.get('/addresses', auth_middleware_1.authenticateJwt, controller.getAddresses);
    router.post('/addresses', auth_middleware_1.authenticateJwt, (0, validate_middleware_1.validateRequest)({ body: payment_validator_1.createAddressSchema }), controller.addAddress);
    router.delete('/addresses/:id', auth_middleware_1.authenticateJwt, controller.deleteAddress);
    router.put('/addresses/:id/default', auth_middleware_1.authenticateJwt, controller.setDefaultAddress);
    // Payment Cards routes
    router.get('/cards', auth_middleware_1.authenticateJwt, controller.getCards);
    router.post('/cards', auth_middleware_1.authenticateJwt, (0, validate_middleware_1.validateRequest)({ body: payment_validator_1.createCardSchema }), controller.addCard);
    router.delete('/cards/:id', auth_middleware_1.authenticateJwt, controller.deleteCard);
    // Notifications routes
    router.get('/notifications', auth_middleware_1.authenticateJwt, controller.getNotifications);
    router.put('/notifications/mark-read', auth_middleware_1.authenticateJwt, controller.markNotificationsRead);
    return router;
};
exports.createProfileRouter = createProfileRouter;
