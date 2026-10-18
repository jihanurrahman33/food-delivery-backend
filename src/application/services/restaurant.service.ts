import { v4 as uuidv4 } from 'uuid';
import { BannerEntity } from '../../domain/entities/banner.entity';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { FoodItemEntity } from '../../domain/entities/food-item.entity';
import { RestaurantEntity } from '../../domain/entities/restaurant.entity';
import { ReviewEntity } from '../../domain/entities/review.entity';
import {
  IBannerRepository,
  ICategoryRepository,
  IFoodItemRepository,
  IRestaurantRepository,
  IReviewRepository,
} from '../../domain/repositories';
import { AppError } from '../../core/errors/app-error';

export class RestaurantService {
  private readonly restaurantRepo: IRestaurantRepository;
  private readonly foodItemRepo: IFoodItemRepository;
  private readonly categoryRepo: ICategoryRepository;
  private readonly bannerRepo: IBannerRepository;
  private readonly reviewRepo: IReviewRepository;

  constructor(
    restaurantRepo: IRestaurantRepository,
    foodItemRepo: IFoodItemRepository,
    categoryRepo: ICategoryRepository,
    bannerRepo: IBannerRepository,
    reviewRepo: IReviewRepository
  ) {
    this.restaurantRepo = restaurantRepo;
    this.foodItemRepo = foodItemRepo;
    this.categoryRepo = categoryRepo;
    this.bannerRepo = bannerRepo;
    this.reviewRepo = reviewRepo;
  }

  public async getBanners(): Promise<BannerEntity[]> {
    return this.bannerRepo.findAll();
  }

  public async getCategories(): Promise<CategoryEntity[]> {
    return this.categoryRepo.findAll();
  }

  public async getFeaturedRestaurants(userId?: string): Promise<RestaurantEntity[]> {
    const list = await this.restaurantRepo.findAll({ isFeatured: true });
    if (userId) {
      const favorites = await this.restaurantRepo.getFavorites(userId);
      const favIds = new Set(favorites.map((f) => f.id));
      return list.map((r) => ({ ...r, isFavorite: favIds.has(r.id) }));
    }
    return list;
  }

  public async getPopularFoods(): Promise<FoodItemEntity[]> {
    return this.foodItemRepo.findAll({ isPopular: true });
  }

  public async getRestaurants(options?: {
    categoryId?: string;
    search?: string;
    userId?: string;
  }): Promise<RestaurantEntity[]> {
    let list = await this.restaurantRepo.findAll({
      categoryId: options?.categoryId,
      search: options?.search,
    });

    if (options?.userId) {
      const favorites = await this.restaurantRepo.getFavorites(options.userId);
      const favIds = new Set(favorites.map((f) => f.id));
      list = list.map((r) => ({ ...r, isFavorite: favIds.has(r.id) }));
    }

    return list;
  }

  public async getRestaurantById(id: string, userId?: string): Promise<RestaurantEntity> {
    const restaurant = await this.restaurantRepo.findById(id);
    if (!restaurant) {
      throw AppError.notFound(`Restaurant with ID '${id}' not found`);
    }

    if (userId) {
      const favorites = await this.restaurantRepo.getFavorites(userId);
      const isFav = favorites.some((f) => f.id === id);
      return { ...restaurant, isFavorite: isFav };
    }

    return restaurant;
  }

  public async getFoodsByRestaurant(restaurantId: string): Promise<FoodItemEntity[]> {
    return this.foodItemRepo.findAll({ restaurantId });
  }

  public async searchFoods(query: string): Promise<FoodItemEntity[]> {
    return this.foodItemRepo.findAll({ search: query });
  }

  public async getFoodById(id: string): Promise<FoodItemEntity> {
    const item = await this.foodItemRepo.findById(id);
    if (!item) {
      throw AppError.notFound(`Food item with ID '${id}' not found`);
    }
    return item;
  }

  public async toggleFavorite(userId: string, restaurantId: string): Promise<{ isFavorite: boolean }> {
    const isFav = await this.restaurantRepo.toggleFavorite(userId, restaurantId);
    return { isFavorite: isFav };
  }

  public async getFavorites(userId: string): Promise<RestaurantEntity[]> {
    return this.restaurantRepo.getFavorites(userId);
  }

  public async getReviews(restaurantId: string): Promise<ReviewEntity[]> {
    return this.reviewRepo.findByRestaurantId(restaurantId);
  }

  public async addReview(
    userId: string,
    author: string,
    avatar: string | undefined,
    dto: { restaurantId: string; orderId?: string; rating: number; riderRating?: number; comment: string }
  ): Promise<ReviewEntity> {
    const restaurant = await this.restaurantRepo.findById(dto.restaurantId);
    if (!restaurant) {
      throw AppError.notFound('Restaurant not found');
    }

    const newReview: ReviewEntity = {
      id: `rev_${uuidv4().replace(/-/g, '').substring(0, 10)}`,
      restaurantId: dto.restaurantId,
      orderId: dto.orderId,
      userId,
      author,
      avatar,
      rating: dto.rating,
      riderRating: dto.riderRating,
      comment: dto.comment.trim(),
      createdAt: new Date().toISOString(),
    };

    return this.reviewRepo.create(newReview);
  }
}
