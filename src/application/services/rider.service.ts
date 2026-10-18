import { OrderEntity, OrderStatus } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../../domain/repositories';
import { AppError } from '../../core/errors/app-error';

export interface RiderDashboardData {
  isOnline: boolean;
  todayEarnings: number;
  todayTrips: number;
  riderRating: number;
  availableDeliveries: OrderEntity[];
  activeDelivery: OrderEntity | null;
}

export class RiderService {
  private readonly orderRepo: IOrderRepository;
  private isOnlineState: boolean = true;
  private todayEarningsState: number = 128.50;
  private todayTripsState: number = 14;

  constructor(orderRepo: IOrderRepository) {
    this.orderRepo = orderRepo;
  }

  public async getDashboardData(riderId: string): Promise<RiderDashboardData> {
    const orders = await this.orderRepo.findAll();
    const available = orders.filter((o) => o.status === OrderStatus.CONFIRMED);
    const active = orders.find(
      (o) => o.rider?.id === riderId && (o.status === OrderStatus.PREPARING || o.status === OrderStatus.ON_THE_WAY)
    ) || null;

    return {
      isOnline: this.isOnlineState,
      todayEarnings: this.todayEarningsState,
      todayTrips: this.todayTripsState,
      riderRating: 4.92,
      availableDeliveries: available,
      activeDelivery: active,
    };
  }

  public async toggleOnlineStatus(isOnline: boolean): Promise<boolean> {
    this.isOnlineState = isOnline;
    return this.isOnlineState;
  }

  public async getAvailableDeliveries(): Promise<OrderEntity[]> {
    const orders = await this.orderRepo.findAll();
    return orders.filter(
      (o) => o.status === OrderStatus.CONFIRMED || o.status === OrderStatus.PREPARING
    );
  }

  public async acceptDelivery(orderId: string, riderId: string, riderName: string): Promise<OrderEntity> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      throw AppError.notFound(`Order with ID '${orderId}' not found`);
    }

    if (order.status === OrderStatus.CANCELLED || order.status === OrderStatus.DELIVERED) {
      throw AppError.badRequest('Cannot accept an order that is already completed or cancelled');
    }

    const updated = await this.orderRepo.update(orderId, {
      status: OrderStatus.ON_THE_WAY,
      rider: {
        id: riderId,
        name: riderName,
        phone: '+1 (555) 789-0123',
        avatarUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        rating: 4.9,
        vehicleType: 'Vespa Sprint 150',
        licensePlate: 'NYC-5491',
      },
    });

    return updated!;
  }

  public async updateTripStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<OrderEntity> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) {
      throw AppError.notFound(`Order with ID '${orderId}' not found`);
    }

    const updated = await this.orderRepo.update(orderId, { status });

    if (status === OrderStatus.DELIVERED) {
      this.todayEarningsState += 9.50;
      this.todayTripsState += 1;
    }

    return updated!;
  }
}
