import { Response, NextFunction } from 'express';
import { RestaurantService } from '../../application/services/restaurant.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
export declare class RestaurantController {
    private readonly restaurantService;
    constructor(restaurantService: RestaurantService);
    getRestaurants: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getRestaurantById: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getFoodsByRestaurant: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    searchFoods: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getFoodById: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    toggleFavorite: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getFavorites: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getReviews: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    addReview: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
