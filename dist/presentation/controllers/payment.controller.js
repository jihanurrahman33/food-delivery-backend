"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const api_response_1 = require("../../core/types/api-response");
class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    createIntent = async (req, res, next) => {
        try {
            const { orderId, paymentMethod, provider } = req.body;
            const intent = await this.paymentService.createPaymentIntent(req.user.userId, orderId, paymentMethod, provider);
            res.status(200).json(api_response_1.ResponseFormatter.success(intent, 'Payment intent created', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    verifyPayment = async (req, res, next) => {
        try {
            const { transactionReference, provider } = req.body;
            const result = await this.paymentService.verifyPayment(req.user.userId, transactionReference, provider);
            res.status(200).json(api_response_1.ResponseFormatter.success(result, 'Payment verification complete', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    handleWebhook = async (req, res, next) => {
        try {
            const provider = req.params.provider || 'mock';
            const signature = req.headers['x-webhook-signature'] || '';
            const result = await this.paymentService.handleWebhook(provider, req.body, signature);
            res.status(200).json(api_response_1.ResponseFormatter.success(result, 'Webhook processed successfully'));
        }
        catch (err) {
            next(err);
        }
    };
    getTransactions = async (req, res, next) => {
        try {
            const transactions = await this.paymentService.getTransactions(req.user.userId);
            res.status(200).json(api_response_1.ResponseFormatter.success(transactions, 'Transactions retrieved', { total: transactions.length }, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
}
exports.PaymentController = PaymentController;
