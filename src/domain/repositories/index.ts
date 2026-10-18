import { UserEntity } from '../entities/user.entity';
import { RestaurantEntity } from '../entities/restaurant.entity';
import { FoodItemEntity } from '../entities/food-item.entity';
import { CategoryEntity } from '../entities/category.entity';
import { BannerEntity } from '../entities/banner.entity';
import { OrderEntity, OrderStatus } from '../entities/order.entity';
import { PaymentTransaction } from '../entities/payment.entity';
import { AddressEntity, PaymentCardEntity } from '../entities/address.entity';
import { ReviewEntity } from '../entities/review.entity';
import { NotificationEntity } from '../entities/notification.entity';
import { ChatMessageEntity } from '../entities/chat-message.entity';

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<UserEntity>;
  update(id: string, user: Partial<UserEntity>): Promise<UserEntity | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<UserEntity[]>;
}

export interface IRestaurantRepository {
  findAll(options?: { categoryId?: string; search?: string; isOpen?: boolean; isFeatured?: boolean }): Promise<RestaurantEntity[]>;
  findById(id: string): Promise<RestaurantEntity | null>;
  create(restaurant: RestaurantEntity): Promise<RestaurantEntity>;
  update(id: string, restaurant: Partial<RestaurantEntity>): Promise<RestaurantEntity | null>;
  toggleFavorite(userId: string, restaurantId: string): Promise<boolean>;
  getFavorites(userId: string): Promise<RestaurantEntity[]>;
}

export interface IFoodItemRepository {
  findAll(options?: { restaurantId?: string; categoryId?: string; isPopular?: boolean; search?: string }): Promise<FoodItemEntity[]>;
  findById(id: string): Promise<FoodItemEntity | null>;
  create(item: FoodItemEntity): Promise<FoodItemEntity>;
  update(id: string, item: Partial<FoodItemEntity>): Promise<FoodItemEntity | null>;
  delete(id: string): Promise<boolean>;
}

export interface ICategoryRepository {
  findAll(): Promise<CategoryEntity[]>;
  findById(id: string): Promise<CategoryEntity | null>;
}

export interface IBannerRepository {
  findAll(): Promise<BannerEntity[]>;
}

export interface IOrderRepository {
  findAll(options?: { userId?: string; restaurantId?: string; riderId?: string; status?: OrderStatus }): Promise<OrderEntity[]>;
  findById(id: string): Promise<OrderEntity | null>;
  create(order: OrderEntity): Promise<OrderEntity>;
  update(id: string, order: Partial<OrderEntity>): Promise<OrderEntity | null>;
}

export interface IPaymentRepository {
  create(transaction: PaymentTransaction): Promise<PaymentTransaction>;
  findById(id: string): Promise<PaymentTransaction | null>;
  findByOrderId(orderId: string): Promise<PaymentTransaction[]>;
  findByReference(ref: string): Promise<PaymentTransaction | null>;
  update(id: string, transaction: Partial<PaymentTransaction>): Promise<PaymentTransaction | null>;
}

export interface IAddressRepository {
  findByUserId(userId: string): Promise<AddressEntity[]>;
  findById(id: string): Promise<AddressEntity | null>;
  create(address: AddressEntity): Promise<AddressEntity>;
  delete(id: string, userId: string): Promise<boolean>;
  setDefault(id: string, userId: string): Promise<AddressEntity | null>;
  findCardsByUserId(userId: string): Promise<PaymentCardEntity[]>;
  createCard(card: PaymentCardEntity): Promise<PaymentCardEntity>;
  deleteCard(id: string, userId: string): Promise<boolean>;
}

export interface IReviewRepository {
  findByRestaurantId(restaurantId: string): Promise<ReviewEntity[]>;
  create(review: ReviewEntity): Promise<ReviewEntity>;
}

export interface INotificationRepository {
  findByUserId(userId: string): Promise<NotificationEntity[]>;
  create(notification: NotificationEntity): Promise<NotificationEntity>;
  markAllRead(userId: string): Promise<void>;
}

export interface IChatMessageRepository {
  findByOrderId(orderId: string): Promise<ChatMessageEntity[]>;
  create(message: ChatMessageEntity): Promise<ChatMessageEntity>;
}
