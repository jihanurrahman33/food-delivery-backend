import { OrderEntity, OrderStatus } from '../../../../domain/entities/order.entity';
import { IOrderRepository } from '../../../../domain/repositories';
export declare class JsonOrderRepository implements IOrderRepository {
    private readonly store;
    constructor(dataDir: string);
    findAll(options?: {
        userId?: string;
        restaurantId?: string;
        riderId?: string;
        status?: OrderStatus;
    }): Promise<OrderEntity[]>;
    findById(id: string): Promise<OrderEntity | null>;
    create(order: OrderEntity): Promise<OrderEntity>;
    update(id: string, partial: Partial<OrderEntity>): Promise<OrderEntity | null>;
}
