import { IPaymentProvider, PaymentIntentResult, PaymentVerificationResult, WebhookEventResult } from './payment-provider.interface';
export declare class MockPaymentProvider implements IPaymentProvider {
    readonly name = "mock";
    private readonly secretKey;
    constructor(secretKey?: string);
    createPaymentIntent(orderId: string, amount: number, currency?: string, metadata?: Record<string, any>): Promise<PaymentIntentResult>;
    verifyPayment(transactionReference: string, signature?: string): Promise<PaymentVerificationResult>;
    handleWebhook(payload: any, signature: string): Promise<WebhookEventResult>;
}
