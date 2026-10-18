import { Response, NextFunction } from 'express';
import { ChefService } from '../../application/services/chef.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
export declare class ChefController {
    private readonly chefService;
    constructor(chefService: ChefService);
    getDashboard: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getOrders: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    updateOrderStatus: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    toggleKitchenStatus: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getMenu: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    addDish: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
