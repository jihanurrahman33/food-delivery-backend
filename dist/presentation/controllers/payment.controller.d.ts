import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../../application/services/payment.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createIntent: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    verifyPayment: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    handleWebhook: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getTransactions: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
