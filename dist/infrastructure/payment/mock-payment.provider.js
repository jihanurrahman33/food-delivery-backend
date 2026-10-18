"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockPaymentProvider = void 0;
const crypto_1 = __importDefault(require("crypto"));
const payment_entity_1 = require("../../domain/entities/payment.entity");
const app_error_1 = require("../../core/errors/app-error");
class MockPaymentProvider {
    name = 'mock';
    secretKey;
    constructor(secretKey = 'whsec_food_delivery_secure_webhook_key_2026') {
        this.secretKey = secretKey;
    }
    async createPaymentIntent(orderId, amount, currency = 'USD', metadata) {
        const transactionReference = `txn_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        // Sign the transaction reference and amount to simulate real signed clientSecrets
        const clientSecret = crypto_1.default
            .createHmac('sha256', this.secretKey)
            .update(`${transactionReference}:${amount}:${currency}`)
            .digest('hex');
        return {
            transactionReference,
            clientSecret: `cs_${clientSecret}`,
            amount,
            currency,
            provider: this.name,
        };
    }
    async verifyPayment(transactionReference, signature) {
        // Basic validation on mock reference format
        if (!transactionReference || !transactionReference.startsWith('txn_mock_')) {
            return {
                success: false,
                transactionReference,
                status: payment_entity_1.PaymentStatus.FAILED,
                amount: 0,
                rawResponse: { error: 'Invalid mock transaction reference' },
            };
        }
        return {
            success: true,
            transactionReference,
            status: payment_entity_1.PaymentStatus.SUCCEEDED,
            amount: 0,
            rawResponse: {
                verifiedAt: new Date().toISOString(),
                gateway: 'FoodDeliverySandboxGate',
                status: 'authorized_and_settled',
            },
        };
    }
    async handleWebhook(payload, signature) {
        // Cryptographic signature check
        const expectedSignature = crypto_1.default
            .createHmac('sha256', this.secretKey)
            .update(typeof payload === 'string' ? payload : JSON.stringify(payload))
            .digest('hex');
        if (signature !== expectedSignature) {
            throw app_error_1.AppError.badRequest('Invalid webhook signature');
        }
        const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
        return {
            event: data.event || 'payment_intent.succeeded',
            orderId: data.orderId,
            transactionReference: data.transactionReference,
            status: payment_entity_1.PaymentStatus.SUCCEEDED,
            amount: Number(data.amount || 0),
        };
    }
}
exports.MockPaymentProvider = MockPaymentProvider;
