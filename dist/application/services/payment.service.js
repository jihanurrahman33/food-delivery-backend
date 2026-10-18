"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const uuid_1 = require("uuid");
const app_error_1 = require("../../core/errors/app-error");
const payment_entity_1 = require("../../domain/entities/payment.entity");
const payment_provider_factory_1 = require("../../infrastructure/payment/payment-provider.factory");
class PaymentService {
    paymentRepo;
    orderRepo;
    constructor(paymentRepo, orderRepo) {
        this.paymentRepo = paymentRepo;
        this.orderRepo = orderRepo;
    }
    async createPaymentIntent(userId, orderId, paymentMethod = 'card', providerName = 'mock') {
        const order = await this.orderRepo.findById(orderId);
        if (!order) {
            throw app_error_1.AppError.notFound(`Order '${orderId}' not found`);
        }
        if (order.userId !== userId) {
            throw app_error_1.AppError.forbidden('You do not own this order');
        }
        const provider = payment_provider_factory_1.PaymentProviderFactory.getProvider(providerName);
        const intent = await provider.createPaymentIntent(order.id, order.total, 'USD', {
            userId,
            paymentMethod,
        });
        const transaction = {
            id: `pay_${(0, uuid_1.v4)().replace(/-/g, '').substring(0, 10)}`,
            orderId: order.id,
            userId,
            amount: order.total,
            currency: 'USD',
            provider: provider.name,
            paymentMethod,
            transactionReference: intent.transactionReference,
            signature: intent.clientSecret,
            status: payment_entity_1.PaymentStatus.PENDING,
            metadata: { orderId: order.id },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        await this.paymentRepo.create(transaction);
        return intent;
    }
    async verifyPayment(userId, transactionReference, providerName = 'mock') {
        const transaction = await this.paymentRepo.findByReference(transactionReference);
        if (!transaction) {
            throw app_error_1.AppError.notFound(`Transaction with reference '${transactionReference}' not found`);
        }
        if (transaction.userId !== userId) {
            throw app_error_1.AppError.forbidden('Transaction ownership verification failed');
        }
        // Already settled
        if (transaction.status === payment_entity_1.PaymentStatus.SUCCEEDED) {
            return {
                success: true,
                transactionReference,
                status: payment_entity_1.PaymentStatus.SUCCEEDED,
                amount: transaction.amount,
                rawResponse: { note: 'Already settled and verified' },
            };
        }
        const provider = payment_provider_factory_1.PaymentProviderFactory.getProvider(providerName);
        const verification = await provider.verifyPayment(transactionReference, transaction.signature);
        if (verification.success) {
            await this.paymentRepo.update(transaction.id, {
                status: payment_entity_1.PaymentStatus.SUCCEEDED,
                updatedAt: new Date().toISOString(),
            });
            await this.orderRepo.update(transaction.orderId, {
                paymentStatus: 'paid',
                transactionId: transaction.id,
            });
        }
        else {
            await this.paymentRepo.update(transaction.id, {
                status: payment_entity_1.PaymentStatus.FAILED,
                updatedAt: new Date().toISOString(),
            });
        }
        return verification;
    }
    async handleWebhook(providerName, payload, signature) {
        const provider = payment_provider_factory_1.PaymentProviderFactory.getProvider(providerName);
        const event = await provider.handleWebhook(payload, signature);
        // Idempotent order & payment update
        const transaction = await this.paymentRepo.findByReference(event.transactionReference);
        if (transaction) {
            await this.paymentRepo.update(transaction.id, { status: event.status });
            await this.orderRepo.update(transaction.orderId, {
                paymentStatus: event.status === payment_entity_1.PaymentStatus.SUCCEEDED ? 'paid' : 'failed',
            });
        }
        return { processed: true, orderId: event.orderId };
    }
    async getTransactions(userId) {
        const all = await this.paymentRepo.findByOrderId(''); // Or query by userId if method available
        // Alternatively filter all payments
        const payments = await this.paymentRepo.store?.readAll?.() || [];
        return payments.filter((p) => p.userId === userId);
    }
}
exports.PaymentService = PaymentService;
