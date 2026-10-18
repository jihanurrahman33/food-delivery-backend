import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../core/errors/app-error';
import { PaymentStatus, PaymentTransaction } from '../../domain/entities/payment.entity';
import { IOrderRepository, IPaymentRepository } from '../../domain/repositories';
import { PaymentProviderFactory } from '../../infrastructure/payment/payment-provider.factory';
import { PaymentIntentResult, PaymentVerificationResult } from '../../infrastructure/payment/payment-provider.interface';

export class PaymentService {
  private readonly paymentRepo: IPaymentRepository;
  private readonly orderRepo: IOrderRepository;

  constructor(paymentRepo: IPaymentRepository, orderRepo: IOrderRepository) {
    this.paymentRepo = paymentRepo;
    this.orderRepo = orderRepo;
  }

  public async createPaymentIntent(
    userId: string,
    orderId: string,
    paymentMethod: string = 'card',
    providerName: string = 'mock'
  ): Promise<PaymentIntentResult> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      throw AppError.notFound(`Order '${orderId}' not found`);
    }

    if (order.userId !== userId) {
      throw AppError.forbidden('You do not own this order');
    }

    const provider = PaymentProviderFactory.getProvider(providerName);
    const intent = await provider.createPaymentIntent(order.id, order.total, 'USD', {
      userId,
      paymentMethod,
    });

    const transaction: PaymentTransaction = {
      id: `pay_${uuidv4().replace(/-/g, '').substring(0, 10)}`,
      orderId: order.id,
      userId,
      amount: order.total,
      currency: 'USD',
      provider: provider.name,
      paymentMethod,
      transactionReference: intent.transactionReference,
      signature: intent.clientSecret,
      status: PaymentStatus.PENDING,
      metadata: { orderId: order.id },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.paymentRepo.create(transaction);

    return intent;
  }

  public async verifyPayment(
    userId: string,
    transactionReference: string,
    providerName: string = 'mock'
  ): Promise<PaymentVerificationResult> {
    const transaction = await this.paymentRepo.findByReference(transactionReference);
    if (!transaction) {
      throw AppError.notFound(`Transaction with reference '${transactionReference}' not found`);
    }

    if (transaction.userId !== userId) {
      throw AppError.forbidden('Transaction ownership verification failed');
    }

    // Already settled
    if (transaction.status === PaymentStatus.SUCCEEDED) {
      return {
        success: true,
        transactionReference,
        status: PaymentStatus.SUCCEEDED,
        amount: transaction.amount,
        rawResponse: { note: 'Already settled and verified' },
      };
    }

    const provider = PaymentProviderFactory.getProvider(providerName);
    const verification = await provider.verifyPayment(transactionReference, transaction.signature);

    if (verification.success) {
      await this.paymentRepo.update(transaction.id, {
        status: PaymentStatus.SUCCEEDED,
        updatedAt: new Date().toISOString(),
      });

      await this.orderRepo.update(transaction.orderId, {
        paymentStatus: 'paid',
        transactionId: transaction.id,
      });
    } else {
      await this.paymentRepo.update(transaction.id, {
        status: PaymentStatus.FAILED,
        updatedAt: new Date().toISOString(),
      });
    }

    return verification;
  }

  public async handleWebhook(
    providerName: string,
    payload: any,
    signature: string
  ): Promise<{ processed: boolean; orderId: string }> {
    const provider = PaymentProviderFactory.getProvider(providerName);
    const event = await provider.handleWebhook(payload, signature);

    // Idempotent order & payment update
    const transaction = await this.paymentRepo.findByReference(event.transactionReference);
    if (transaction) {
      await this.paymentRepo.update(transaction.id, { status: event.status });
      await this.orderRepo.update(transaction.orderId, {
        paymentStatus: event.status === PaymentStatus.SUCCEEDED ? 'paid' : 'failed',
      });
    }

    return { processed: true, orderId: event.orderId };
  }

  public async getTransactions(userId: string): Promise<PaymentTransaction[]> {
    const all = await this.paymentRepo.findByOrderId(''); // Or query by userId if method available
    // Alternatively filter all payments
    const payments = await (this.paymentRepo as any).store?.readAll?.() || [];
    return payments.filter((p: PaymentTransaction) => p.userId === userId);
  }
}
