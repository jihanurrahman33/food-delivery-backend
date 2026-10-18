import { Response, NextFunction } from 'express';
import { RiderService } from '../../application/services/rider.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
export declare class RiderController {
    private readonly riderService;
    constructor(riderService: RiderService);
    getDashboard: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getAvailableDeliveries: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    acceptDelivery: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    updateTripStatus: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    toggleOnlineStatus: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
