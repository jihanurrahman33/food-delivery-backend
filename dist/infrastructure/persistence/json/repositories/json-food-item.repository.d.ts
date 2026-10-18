import { FoodItemEntity } from '../../../../domain/entities/food-item.entity';
import { IFoodItemRepository } from '../../../../domain/repositories';
export declare class JsonFoodItemRepository implements IFoodItemRepository {
    private readonly store;
    constructor(dataDir: string);
    findAll(options?: {
        restaurantId?: string;
        categoryId?: string;
        isPopular?: boolean;
        search?: string;
    }): Promise<FoodItemEntity[]>;
    findById(id: string): Promise<FoodItemEntity | null>;
    create(item: FoodItemEntity): Promise<FoodItemEntity>;
    update(id: string, partial: Partial<FoodItemEntity>): Promise<FoodItemEntity | null>;
    delete(id: string): Promise<boolean>;
}
