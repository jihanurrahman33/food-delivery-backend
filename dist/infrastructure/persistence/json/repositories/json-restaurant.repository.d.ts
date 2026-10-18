import { RestaurantEntity } from '../../../../domain/entities/restaurant.entity';
import { IRestaurantRepository } from '../../../../domain/repositories';
export declare class JsonRestaurantRepository implements IRestaurantRepository {
    private readonly store;
    private readonly favoritesStore;
    constructor(dataDir: string);
    findAll(options?: {
        categoryId?: string;
        search?: string;
        isOpen?: boolean;
        isFeatured?: boolean;
    }): Promise<RestaurantEntity[]>;
    findById(id: string): Promise<RestaurantEntity | null>;
    create(restaurant: RestaurantEntity): Promise<RestaurantEntity>;
    update(id: string, partial: Partial<RestaurantEntity>): Promise<RestaurantEntity | null>;
    toggleFavorite(userId: string, restaurantId: string): Promise<boolean>;
    getFavorites(userId: string): Promise<RestaurantEntity[]>;
}
