import { BannerEntity } from '../../domain/entities/banner.entity';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { FoodItemEntity } from '../../domain/entities/food-item.entity';
import { RestaurantEntity } from '../../domain/entities/restaurant.entity';
import { ReviewEntity } from '../../domain/entities/review.entity';
import { IBannerRepository, ICategoryRepository, IFoodItemRepository, IRestaurantRepository, IReviewRepository } from '../../domain/repositories';
export declare class RestaurantService {
    private readonly restaurantRepo;
    private readonly foodItemRepo;
    private readonly categoryRepo;
    private readonly bannerRepo;
    private readonly reviewRepo;
    constructor(restaurantRepo: IRestaurantRepository, foodItemRepo: IFoodItemRepository, categoryRepo: ICategoryRepository, bannerRepo: IBannerRepository, reviewRepo: IReviewRepository);
    getBanners(): Promise<BannerEntity[]>;
    getCategories(): Promise<CategoryEntity[]>;
    getFeaturedRestaurants(userId?: string): Promise<RestaurantEntity[]>;
    getPopularFoods(): Promise<FoodItemEntity[]>;
    getRestaurants(options?: {
        categoryId?: string;
        search?: string;
        userId?: string;
    }): Promise<RestaurantEntity[]>;
    getRestaurantById(id: string, userId?: string): Promise<RestaurantEntity>;
    getFoodsByRestaurant(restaurantId: string): Promise<FoodItemEntity[]>;
    searchFoods(query: string): Promise<FoodItemEntity[]>;
    getFoodById(id: string): Promise<FoodItemEntity>;
    toggleFavorite(userId: string, restaurantId: string): Promise<{
        isFavorite: boolean;
    }>;
    getFavorites(userId: string): Promise<RestaurantEntity[]>;
    getReviews(restaurantId: string): Promise<ReviewEntity[]>;
    addReview(userId: string, author: string, avatar: string | undefined, dto: {
        restaurantId: string;
        orderId?: string;
        rating: number;
        riderRating?: number;
        comment: string;
    }): Promise<ReviewEntity>;
}
