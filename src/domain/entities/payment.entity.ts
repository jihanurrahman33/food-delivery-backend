export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  provider: string; // 'mock' | 'stripe' | 'paypal'
  paymentMethod: string; // 'card' | 'paypal' | 'applepay' | 'cash'
  transactionReference: string;
  signature?: string;
  status: PaymentStatus;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
