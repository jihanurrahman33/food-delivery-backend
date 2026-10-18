export interface ReviewEntity {
    id: string;
    restaurantId: string;
    orderId?: string;
    userId: string;
    author: string;
    avatar?: string;
    rating: number;
    riderRating?: number;
    comment: string;
    createdAt: string;
}
