import { PaymentStatus } from '../../domain/entities/payment.entity';
export interface PaymentIntentResult {
    transactionReference: string;
    clientSecret: string;
    amount: number;
    currency: string;
    provider: string;
}
export interface PaymentVerificationResult {
    success: boolean;
    transactionReference: string;
    status: PaymentStatus;
    amount: number;
    rawResponse: Record<string, any>;
}
export interface WebhookEventResult {
    event: string;
    orderId: string;
    transactionReference: string;
    status: PaymentStatus;
    amount: number;
}
export interface IPaymentProvider {
    readonly name: string;
    createPaymentIntent(orderId: string, amount: number, currency?: string, metadata?: Record<string, any>): Promise<PaymentIntentResult>;
    verifyPayment(transactionReference: string, signature?: string): Promise<PaymentVerificationResult>;
    handleWebhook(payload: any, signature: string): Promise<WebhookEventResult>;
}
