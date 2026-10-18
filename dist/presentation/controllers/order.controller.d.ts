import { Response, NextFunction } from 'express';
import { OrderService } from '../../application/services/order.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    placeOrder: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getActiveOrders: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getOrderHistory: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getOrderById: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    cancelOrder: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    validatePromo: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getChatMessages: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    sendChatMessage: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    rateOrder: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
