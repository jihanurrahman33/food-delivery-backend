import { ReviewEntity } from '../../../../domain/entities/review.entity';
import { IReviewRepository } from '../../../../domain/repositories';
export declare class JsonReviewRepository implements IReviewRepository {
    private readonly store;
    constructor(dataDir: string);
    findByRestaurantId(restaurantId: string): Promise<ReviewEntity[]>;
    create(review: ReviewEntity): Promise<ReviewEntity>;
}
