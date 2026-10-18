import { FoodItemEntity } from '../../../../domain/entities/food-item.entity';
import { IFoodItemRepository } from '../../../../domain/repositories';
import { JsonFileStore } from '../json-file-store';

export class JsonFoodItemRepository implements IFoodItemRepository {
  private readonly store: JsonFileStore<FoodItemEntity>;

  constructor(dataDir: string) {
    this.store = new JsonFileStore<FoodItemEntity>('foods', dataDir);
  }

  async findAll(options?: {
    restaurantId?: string;
    categoryId?: string;
    isPopular?: boolean;
    search?: string;
  }): Promise<FoodItemEntity[]> {
    let list = await this.store.readAll();

    if (options?.restaurantId) {
      list = list.filter((f) => f.restaurantId === options.restaurantId);
    }
    if (options?.categoryId && options.categoryId !== 'cat_all') {
      list = list.filter((f) => f.categoryId === options.categoryId);
    }
    if (options?.isPopular !== undefined) {
      list = list.filter((f) => f.isPopular === options.isPopular);
    }
    if (options?.search) {
      const q = options.search.trim().toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.restaurantName.toLowerCase().includes(q)
      );
    }
    return list;
  }

  async findById(id: string): Promise<FoodItemEntity | null> {
    return this.store.findById(id);
  }

  async create(item: FoodItemEntity): Promise<FoodItemEntity> {
    return this.store.insert(item);
  }

  async update(id: string, partial: Partial<FoodItemEntity>): Promise<FoodItemEntity | null> {
    return this.store.update(id, { ...partial, updatedAt: new Date().toISOString() });
  }

  async delete(id: string): Promise<boolean> {
    return this.store.delete(id);
  }
}
