import crypto from 'crypto';
import {
  IPaymentProvider,
  PaymentIntentResult,
  PaymentVerificationResult,
  WebhookEventResult,
} from './payment-provider.interface';
import { PaymentStatus } from '../../domain/entities/payment.entity';
import { AppError } from '../../core/errors/app-error';

export class MockPaymentProvider implements IPaymentProvider {
  public readonly name = 'mock';
  private readonly secretKey: string;

  constructor(secretKey: string = 'whsec_food_delivery_secure_webhook_key_2026') {
    this.secretKey = secretKey;
  }

  async createPaymentIntent(
    orderId: string,
    amount: number,
    currency: string = 'USD',
    metadata?: Record<string, any>
  ): Promise<PaymentIntentResult> {
    const transactionReference = `txn_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    // Sign the transaction reference and amount to simulate real signed clientSecrets
    const clientSecret = crypto
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

  async verifyPayment(
    transactionReference: string,
    signature?: string
  ): Promise<PaymentVerificationResult> {
    // Basic validation on mock reference format
    if (!transactionReference || !transactionReference.startsWith('txn_mock_')) {
      return {
        success: false,
        transactionReference,
        status: PaymentStatus.FAILED,
        amount: 0,
        rawResponse: { error: 'Invalid mock transaction reference' },
      };
    }

    return {
      success: true,
      transactionReference,
      status: PaymentStatus.SUCCEEDED,
      amount: 0,
      rawResponse: {
        verifiedAt: new Date().toISOString(),
        gateway: 'FoodDeliverySandboxGate',
        status: 'authorized_and_settled',
      },
    };
  }

  async handleWebhook(payload: any, signature: string): Promise<WebhookEventResult> {
    // Cryptographic signature check
    const expectedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(typeof payload === 'string' ? payload : JSON.stringify(payload))
      .digest('hex');

    if (signature !== expectedSignature) {
      throw AppError.badRequest('Invalid webhook signature');
    }

    const data = typeof payload === 'string' ? JSON.parse(payload) : payload;

    return {
      event: data.event || 'payment_intent.succeeded',
      orderId: data.orderId,
      transactionReference: data.transactionReference,
      status: PaymentStatus.SUCCEEDED,
      amount: Number(data.amount || 0),
    };
  }
}
