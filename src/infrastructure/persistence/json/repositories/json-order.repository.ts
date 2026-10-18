import { OrderEntity, OrderStatus } from '../../../../domain/entities/order.entity';
import { IOrderRepository } from '../../../../domain/repositories';
import { JsonFileStore } from '../json-file-store';

export class JsonOrderRepository implements IOrderRepository {
  private readonly store: JsonFileStore<OrderEntity>;

  constructor(dataDir: string) {
    this.store = new JsonFileStore<OrderEntity>('orders', dataDir);
  }

  async findAll(options?: {
    userId?: string;
    restaurantId?: string;
    riderId?: string;
    status?: OrderStatus;
  }): Promise<OrderEntity[]> {
    let list = await this.store.readAll();

    if (options?.userId) {
      list = list.filter((o) => o.userId === options.userId);
    }
    if (options?.restaurantId) {
      list = list.filter((o) => o.restaurantId === options.restaurantId);
    }
    if (options?.riderId) {
      list = list.filter((o) => o.rider?.id === options.riderId);
    }
    if (options?.status) {
      list = list.filter((o) => o.status === options.status);
    }

    // Sort descending by creation date
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findById(id: string): Promise<OrderEntity | null> {
    return this.store.findById(id);
  }

  async create(order: OrderEntity): Promise<OrderEntity> {
    return this.store.insert(order);
  }

  async update(id: string, partial: Partial<OrderEntity>): Promise<OrderEntity | null> {
    return this.store.update(id, { ...partial, updatedAt: new Date().toISOString() });
  }
}
