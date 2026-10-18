import { RestaurantEntity } from '../../../../domain/entities/restaurant.entity';
import { IRestaurantRepository } from '../../../../domain/repositories';
import { JsonFileStore } from '../json-file-store';

interface FavoriteRecord {
  id: string; // `${userId}_${restaurantId}`
  userId: string;
  restaurantId: string;
}

export class JsonRestaurantRepository implements IRestaurantRepository {
  private readonly store: JsonFileStore<RestaurantEntity>;
  private readonly favoritesStore: JsonFileStore<FavoriteRecord>;

  constructor(dataDir: string) {
    this.store = new JsonFileStore<RestaurantEntity>('restaurants', dataDir);
    this.favoritesStore = new JsonFileStore<FavoriteRecord>('favorites', dataDir);
  }

  async findAll(options?: {
    categoryId?: string;
    search?: string;
    isOpen?: boolean;
    isFeatured?: boolean;
  }): Promise<RestaurantEntity[]> {
    let list = await this.store.readAll();

    if (options?.isOpen !== undefined) {
      list = list.filter((r) => r.isOpen === options.isOpen);
    }
    if (options?.isFeatured !== undefined) {
      list = list.filter((r) => r.isFeatured === options.isFeatured);
    }
    if (options?.search) {
      const q = options.search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }

  async findById(id: string): Promise<RestaurantEntity | null> {
    return this.store.findById(id);
  }

  async create(restaurant: RestaurantEntity): Promise<RestaurantEntity> {
    return this.store.insert(restaurant);
  }

  async update(id: string, partial: Partial<RestaurantEntity>): Promise<RestaurantEntity | null> {
    return this.store.update(id, { ...partial, updatedAt: new Date().toISOString() });
  }

  async toggleFavorite(userId: string, restaurantId: string): Promise<boolean> {
    const favId = `${userId}_${restaurantId}`;
    const existing = await this.favoritesStore.findById(favId);
    if (existing) {
      await this.favoritesStore.delete(favId);
      return false; // Removed
    } else {
      await this.favoritesStore.insert({ id: favId, userId, restaurantId });
      return true; // Added
    }
  }

  async getFavorites(userId: string): Promise<RestaurantEntity[]> {
    const userFavs = await this.favoritesStore.filter((f) => f.userId === userId);
    const favRestaurantIds = new Set(userFavs.map((f) => f.restaurantId));
    const all = await this.store.readAll();
    return all
      .filter((r) => favRestaurantIds.has(r.id))
      .map((r) => ({ ...r, isFavorite: true }));
  }
}
