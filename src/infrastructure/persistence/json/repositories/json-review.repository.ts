import { ReviewEntity } from '../../../../domain/entities/review.entity';
import { IReviewRepository } from '../../../../domain/repositories';
import { JsonFileStore } from '../json-file-store';

export class JsonReviewRepository implements IReviewRepository {
  private readonly store: JsonFileStore<ReviewEntity>;

  constructor(dataDir: string) {
    this.store = new JsonFileStore<ReviewEntity>('reviews', dataDir);
  }

  async findByRestaurantId(restaurantId: string): Promise<ReviewEntity[]> {
    const list = await this.store.filter((r) => r.restaurantId === restaurantId);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async create(review: ReviewEntity): Promise<ReviewEntity> {
    return this.store.insert(review);
  }
}
