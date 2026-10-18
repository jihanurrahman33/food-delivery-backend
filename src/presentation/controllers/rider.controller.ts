import { Response, NextFunction } from 'express';
import { RiderService } from '../../application/services/rider.service';
import { ResponseFormatter } from '../../core/types/api-response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class RiderController {
  private readonly riderService: RiderService;

  constructor(riderService: RiderService) {
    this.riderService = riderService;
  }

  public getDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.riderService.getDashboardData(req.user!.userId);
      res.status(200).json(
        ResponseFormatter.success(data, 'Rider dashboard retrieved', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public getAvailableDeliveries = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deliveries = await this.riderService.getAvailableDeliveries();
      res.status(200).json(
        ResponseFormatter.success(deliveries, 'Available deliveries retrieved', { total: deliveries.length }, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public acceptDelivery = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const order = await this.riderService.acceptDelivery(
        id,
        req.user!.userId,
        req.user?.email || 'Robert Fox'
      );
      res.status(200).json(
        ResponseFormatter.success(order, 'Delivery accepted', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public updateTripStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const order = await this.riderService.updateTripStatus(id, status);
      res.status(200).json(
        ResponseFormatter.success(order, `Trip status updated to '${status}'`, undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public toggleOnlineStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { isOnline } = req.body;
      const result = await this.riderService.toggleOnlineStatus(Boolean(isOnline));
      res.status(200).json(
        ResponseFormatter.success({ isOnline: result }, 'Rider online status updated', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };
}
