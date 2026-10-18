import { PaymentTransaction } from '../../../../domain/entities/payment.entity';
import { IPaymentRepository } from '../../../../domain/repositories';
import { JsonFileStore } from '../json-file-store';

export class JsonPaymentRepository implements IPaymentRepository {
  private readonly store: JsonFileStore<PaymentTransaction>;

  constructor(dataDir: string) {
    this.store = new JsonFileStore<PaymentTransaction>('payments', dataDir);
  }

  async create(transaction: PaymentTransaction): Promise<PaymentTransaction> {
    return this.store.insert(transaction);
  }

  async findById(id: string): Promise<PaymentTransaction | null> {
    return this.store.findById(id);
  }

  async findByOrderId(orderId: string): Promise<PaymentTransaction[]> {
    return this.store.filter((t) => t.orderId === orderId);
  }

  async findByReference(ref: string): Promise<PaymentTransaction | null> {
    return this.store.findOne((t) => t.transactionReference === ref);
  }

  async update(id: string, partial: Partial<PaymentTransaction>): Promise<PaymentTransaction | null> {
    return this.store.update(id, { ...partial, updatedAt: new Date().toISOString() });
  }
}
