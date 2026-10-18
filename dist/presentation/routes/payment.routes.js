"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const payment_validator_1 = require("../validators/payment.validator");
const createPaymentRouter = (controller) => {
    const router = (0, express_1.Router)();
    router.post('/create-intent', auth_middleware_1.authenticateJwt, (0, validate_middleware_1.validateRequest)({ body: payment_validator_1.createPaymentIntentSchema }), controller.createIntent);
    router.post('/initiate', auth_middleware_1.authenticateJwt, (0, validate_middleware_1.validateRequest)({ body: payment_validator_1.createPaymentIntentSchema }), controller.createIntent);
    router.post('/verify', auth_middleware_1.authenticateJwt, (0, validate_middleware_1.validateRequest)({ body: payment_validator_1.verifyPaymentSchema }), controller.verifyPayment);
    router.get('/transactions', auth_middleware_1.authenticateJwt, controller.getTransactions);
    // Webhook endpoints
    router.post('/webhook', controller.handleWebhook);
    router.post('/webhook/:provider', controller.handleWebhook);
    return router;
};
exports.createPaymentRouter = createPaymentRouter;
