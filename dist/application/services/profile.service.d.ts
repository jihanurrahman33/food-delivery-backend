import { AddressEntity, PaymentCardEntity } from '../../domain/entities/address.entity';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { SafeUser } from '../../domain/entities/user.entity';
import { IAddressRepository, INotificationRepository, IUserRepository } from '../../domain/repositories';
export declare class ProfileService {
    private readonly addressRepo;
    private readonly notificationRepo;
    private readonly userRepo;
    constructor(addressRepo: IAddressRepository, notificationRepo: INotificationRepository, userRepo: IUserRepository);
    getProfile(userId: string): Promise<SafeUser>;
    updateProfile(userId: string, dto: {
        name?: string;
        phone?: string;
        avatarUrl?: string;
        address?: string;
    }): Promise<SafeUser>;
    getAddresses(userId: string): Promise<AddressEntity[]>;
    addAddress(userId: string, dto: {
        label: string;
        fullAddress: string;
        street: string;
        apartment?: string;
        deliveryNotes?: string;
        isDefault?: boolean;
    }): Promise<AddressEntity>;
    deleteAddress(userId: string, addressId: string): Promise<boolean>;
    setDefaultAddress(userId: string, addressId: string): Promise<AddressEntity>;
    getCards(userId: string): Promise<PaymentCardEntity[]>;
    addCard(userId: string, dto: {
        cardHolderName: string;
        cardNumber: string;
        expiryDate: string;
        brand?: string;
        isDefault?: boolean;
    }): Promise<PaymentCardEntity>;
    deleteCard(userId: string, cardId: string): Promise<boolean>;
    getNotifications(userId: string): Promise<NotificationEntity[]>;
    markAllNotificationsRead(userId: string): Promise<void>;
}
