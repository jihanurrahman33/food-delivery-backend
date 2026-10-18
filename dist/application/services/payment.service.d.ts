import { PaymentTransaction } from '../../domain/entities/payment.entity';
import { IOrderRepository, IPaymentRepository } from '../../domain/repositories';
import { PaymentIntentResult, PaymentVerificationResult } from '../../infrastructure/payment/payment-provider.interface';
export declare class PaymentService {
    private readonly paymentRepo;
    private readonly orderRepo;
    constructor(paymentRepo: IPaymentRepository, orderRepo: IOrderRepository);
    createPaymentIntent(userId: string, orderId: string, paymentMethod?: string, providerName?: string): Promise<PaymentIntentResult>;
    verifyPayment(userId: string, transactionReference: string, providerName?: string): Promise<PaymentVerificationResult>;
    handleWebhook(providerName: string, payload: any, signature: string): Promise<{
        processed: boolean;
        orderId: string;
    }>;
    getTransactions(userId: string): Promise<PaymentTransaction[]>;
}
