"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProviderFactory = void 0;
const mock_payment_provider_1 = require("./mock-payment.provider");
const app_error_1 = require("../../core/errors/app-error");
const config_1 = require("../../config");
class PaymentProviderFactory {
    static providers = new Map();
    static getProvider(providerName) {
        const name = (providerName || config_1.appConfig.PAYMENT_PROVIDER).toLowerCase();
        if (this.providers.has(name)) {
            return this.providers.get(name);
        }
        switch (name) {
            case 'mock': {
                const provider = new mock_payment_provider_1.MockPaymentProvider(config_1.appConfig.PAYMENT_WEBHOOK_SECRET);
                this.providers.set(name, provider);
                return provider;
            }
            case 'stripe':
            case 'paypal':
                // Real gateways can be slotted in here by implementing IPaymentProvider
                throw app_error_1.AppError.badRequest(`Live gateway '${name}' is not configured in current sandbox mode. Use 'mock'.`);
            default:
                throw app_error_1.AppError.badRequest(`Unknown payment provider: ${name}`);
        }
    }
    static registerCustomProvider(provider) {
        this.providers.set(provider.name.toLowerCase(), provider);
    }
}
exports.PaymentProviderFactory = PaymentProviderFactory;
