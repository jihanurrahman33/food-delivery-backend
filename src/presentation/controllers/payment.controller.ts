import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../../application/services/payment.service';
import { ResponseFormatter } from '../../core/types/api-response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class PaymentController {
  private readonly paymentService: PaymentService;

  constructor(paymentService: PaymentService) {
    this.paymentService = paymentService;
  }

  public createIntent = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderId, paymentMethod, provider } = req.body;
      const intent = await this.paymentService.createPaymentIntent(
        req.user!.userId,
        orderId,
        paymentMethod,
        provider
      );
      res.status(200).json(
        ResponseFormatter.success(intent, 'Payment intent created', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public verifyPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { transactionReference, provider } = req.body;
      const result = await this.paymentService.verifyPayment(
        req.user!.userId,
        transactionReference,
        provider
      );
      res.status(200).json(
        ResponseFormatter.success(result, 'Payment verification complete', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const provider = (req.params.provider as string) || 'mock';
      const signature = (req.headers['x-webhook-signature'] as string) || '';
      const result = await this.paymentService.handleWebhook(provider, req.body, signature);
      res.status(200).json(
        ResponseFormatter.success(result, 'Webhook processed successfully')
      );
    } catch (err) {
      next(err);
    }
  };

  public getTransactions = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transactions = await this.paymentService.getTransactions(req.user!.userId);
      res.status(200).json(
        ResponseFormatter.success(transactions, 'Transactions retrieved', { total: transactions.length }, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };
}
