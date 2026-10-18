import { Response, NextFunction } from 'express';
import { RestaurantService } from '../../application/services/restaurant.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
export declare class HomeController {
    private readonly restaurantService;
    constructor(restaurantService: RestaurantService);
    getHomeDiscovery: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getBanners: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getCategories: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getPopularFoods: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
