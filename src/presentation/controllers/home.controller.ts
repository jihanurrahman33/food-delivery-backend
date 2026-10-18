import { Response, NextFunction } from 'express';
import { RestaurantService } from '../../application/services/restaurant.service';
import { ResponseFormatter } from '../../core/types/api-response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class HomeController {
  private readonly restaurantService: RestaurantService;

  constructor(restaurantService: RestaurantService) {
    this.restaurantService = restaurantService;
  }

  public getHomeDiscovery = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const [banners, categories, featuredRestaurants, popularFoods] = await Promise.all([
        this.restaurantService.getBanners(),
        this.restaurantService.getCategories(),
        this.restaurantService.getFeaturedRestaurants(userId),
        this.restaurantService.getPopularFoods(),
      ]);

      res.status(200).json(
        ResponseFormatter.success(
          {
            banners,
            categories,
            featuredRestaurants,
            popularFoods,
          },
          'Home discovery payload retrieved',
          undefined,
          req.correlationId
        )
      );
    } catch (err) {
      next(err);
    }
  };

  public getBanners = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const banners = await this.restaurantService.getBanners();
      res.status(200).json(
        ResponseFormatter.success(banners, 'Banners retrieved', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public getCategories = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.restaurantService.getCategories();
      res.status(200).json(
        ResponseFormatter.success(categories, 'Categories retrieved', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public getPopularFoods = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const popularFoods = await this.restaurantService.getPopularFoods();
      res.status(200).json(
        ResponseFormatter.success(popularFoods, 'Popular foods retrieved', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };
}
