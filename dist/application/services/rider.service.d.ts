import { OrderEntity, OrderStatus } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../../domain/repositories';
export interface RiderDashboardData {
    isOnline: boolean;
    todayEarnings: number;
    todayTrips: number;
    riderRating: number;
    availableDeliveries: OrderEntity[];
    activeDelivery: OrderEntity | null;
}
export declare class RiderService {
    private readonly orderRepo;
    private isOnlineState;
    private todayEarningsState;
    private todayTripsState;
    constructor(orderRepo: IOrderRepository);
    getDashboardData(riderId: string): Promise<RiderDashboardData>;
    toggleOnlineStatus(isOnline: boolean): Promise<boolean>;
    getAvailableDeliveries(): Promise<OrderEntity[]>;
    acceptDelivery(orderId: string, riderId: string, riderName: string): Promise<OrderEntity>;
    updateTripStatus(orderId: string, status: OrderStatus): Promise<OrderEntity>;
}
