import { Response, NextFunction } from 'express';
import { RestaurantService } from '../../application/services/restaurant.service';
import { ResponseFormatter } from '../../core/types/api-response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class RestaurantController {
  private readonly restaurantService: RestaurantService;

  constructor(restaurantService: RestaurantService) {
    this.restaurantService = restaurantService;
  }

  public getRestaurants = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { categoryId, search } = req.query as { categoryId?: string; search?: string };
      const userId = req.user?.userId;
      const restaurants = await this.restaurantService.getRestaurants({ categoryId, search, userId });
      res.status(200).json(
        ResponseFormatter.success(restaurants, 'Restaurants retrieved', { total: restaurants.length }, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public getRestaurantById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const userId = req.user?.userId;
      const restaurant = await this.restaurantService.getRestaurantById(id, userId);
      res.status(200).json(
        ResponseFormatter.success(restaurant, 'Restaurant details retrieved', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public getFoodsByRestaurant = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const foods = await this.restaurantService.getFoodsByRestaurant(id);
      res.status(200).json(
        ResponseFormatter.success(foods, 'Restaurant foods retrieved', { total: foods.length }, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public searchFoods = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { query } = req.query as { query?: string };
      const foods = await this.restaurantService.searchFoods(query || '');
      res.status(200).json(
        ResponseFormatter.success(foods, 'Search results retrieved', { total: foods.length }, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public getFoodById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const food = await this.restaurantService.getFoodById(id);
      res.status(200).json(
        ResponseFormatter.success(food, 'Food details retrieved', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public toggleFavorite = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { restaurantId } = req.body;
      const result = await this.restaurantService.toggleFavorite(req.user!.userId, restaurantId);
      res.status(200).json(
        ResponseFormatter.success(result, result.isFavorite ? 'Added to favorites' : 'Removed from favorites', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public getFavorites = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const favorites = await this.restaurantService.getFavorites(req.user!.userId);
      res.status(200).json(
        ResponseFormatter.success(favorites, 'User favorites retrieved', { total: favorites.length }, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public getReviews = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const reviews = await this.restaurantService.getReviews(id);
      res.status(200).json(
        ResponseFormatter.success(reviews, 'Restaurant reviews retrieved', { total: reviews.length }, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public addReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const review = await this.restaurantService.addReview(
        req.user!.userId,
        req.user!.email,
        undefined,
        req.body
      );
      res.status(201).json(
        ResponseFormatter.success(review, 'Review submitted successfully', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };
}
