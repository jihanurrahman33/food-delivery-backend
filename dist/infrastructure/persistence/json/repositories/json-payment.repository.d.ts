import { PaymentTransaction } from '../../../../domain/entities/payment.entity';
import { IPaymentRepository } from '../../../../domain/repositories';
export declare class JsonPaymentRepository implements IPaymentRepository {
    private readonly store;
    constructor(dataDir: string);
    create(transaction: PaymentTransaction): Promise<PaymentTransaction>;
    findById(id: string): Promise<PaymentTransaction | null>;
    findByOrderId(orderId: string): Promise<PaymentTransaction[]>;
    findByReference(ref: string): Promise<PaymentTransaction | null>;
    update(id: string, partial: Partial<PaymentTransaction>): Promise<PaymentTransaction | null>;
}
