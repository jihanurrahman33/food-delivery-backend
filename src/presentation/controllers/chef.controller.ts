import { Response, NextFunction } from 'express';
import { ChefService } from '../../application/services/chef.service';
import { ResponseFormatter } from '../../core/types/api-response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class ChefController {
  private readonly chefService: ChefService;

  constructor(chefService: ChefService) {
    this.chefService = chefService;
  }

  public getDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.chefService.getDashboardData(req.user!.userId);
      res.status(200).json(
        ResponseFormatter.success(data, 'Chef dashboard data retrieved', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public getOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await this.chefService.getKitchenOrders();
      res.status(200).json(
        ResponseFormatter.success(orders, 'Kitchen orders retrieved', { total: orders.length }, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public updateOrderStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const updated = await this.chefService.updateOrderStatus(id, status);
      res.status(200).json(
        ResponseFormatter.success(updated, `Order updated to '${status}'`, undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public toggleKitchenStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { isOpen } = req.body;
      const result = await this.chefService.toggleKitchenStatus(Boolean(isOpen));
      res.status(200).json(
        ResponseFormatter.success({ isKitchenOpen: result }, 'Kitchen status updated', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public getMenu = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const menu = await this.chefService.getChefMenu();
      res.status(200).json(
        ResponseFormatter.success(menu, 'Chef menu retrieved', { total: menu.length }, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public addDish = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dish = await this.chefService.addDish(req.user!.userId, req.body);
      res.status(201).json(
        ResponseFormatter.success(dish, 'New dish added to menu', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };
}
