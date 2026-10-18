export interface ReviewEntity {
  id: string;
  restaurantId: string;
  orderId?: string;
  userId: string;
  author: string;
  avatar?: string;
  rating: number; // 1.0 - 5.0
  riderRating?: number;
  comment: string;
  createdAt: string;
}
