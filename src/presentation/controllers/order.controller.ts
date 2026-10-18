import { Response, NextFunction } from 'express';
import { OrderService } from '../../application/services/order.service';
import { ResponseFormatter } from '../../core/types/api-response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class OrderController {
  private readonly orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  public placeOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const order = await this.orderService.placeOrder(
        userId,
        req.user?.email || 'Customer',
        '+1 (555) 234-5678',
        req.body
      );
      res.status(201).json(
        ResponseFormatter.success(order, 'Order placed successfully', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public getActiveOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await this.orderService.getActiveOrders(req.user!.userId);
      res.status(200).json(
        ResponseFormatter.success(orders, 'Active orders retrieved', { total: orders.length }, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public getOrderHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await this.orderService.getOrderHistory(req.user!.userId);
      res.status(200).json(
        ResponseFormatter.success(orders, 'Order history retrieved', { total: orders.length }, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public getOrderById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const order = await this.orderService.getOrderById(id, req.user!.userId);
      res.status(200).json(
        ResponseFormatter.success(order, 'Order details retrieved', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public cancelOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const order = await this.orderService.cancelOrder(id, req.user!.userId);
      res.status(200).json(
        ResponseFormatter.success(order, 'Order cancelled successfully', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public validatePromo = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { promoCode, subtotal } = req.body;
      const result = this.orderService.validatePromoCode(promoCode, subtotal);
      res.status(200).json(
        ResponseFormatter.success(result, 'Promo code applied', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public getChatMessages = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const messages = await this.orderService.getChatMessages(id, req.user!.userId);
      res.status(200).json(
        ResponseFormatter.success(messages, 'Chat messages retrieved', { total: messages.length }, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public sendChatMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const message = await this.orderService.sendChatMessage(
        id,
        req.user!.userId,
        req.user!.role as any,
        req.user!.email,
        req.body.text
      );
      res.status(201).json(
        ResponseFormatter.success(message, 'Message sent successfully', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public rateOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const result = await this.orderService.rateOrder(id, req.user!.userId, req.body);
      res.status(200).json(
        ResponseFormatter.success(result, result.message, undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };
}
