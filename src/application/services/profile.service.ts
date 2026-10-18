import { v4 as uuidv4 } from 'uuid';
import { AddressEntity, PaymentCardEntity } from '../../domain/entities/address.entity';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { SafeUser, toSafeUser } from '../../domain/entities/user.entity';
import { IAddressRepository, INotificationRepository, IUserRepository } from '../../domain/repositories';
import { AppError } from '../../core/errors/app-error';

export class ProfileService {
  private readonly addressRepo: IAddressRepository;
  private readonly notificationRepo: INotificationRepository;
  private readonly userRepo: IUserRepository;

  constructor(
    addressRepo: IAddressRepository,
    notificationRepo: INotificationRepository,
    userRepo: IUserRepository
  ) {
    this.addressRepo = addressRepo;
    this.notificationRepo = notificationRepo;
    this.userRepo = userRepo;
  }

  // User Profile
  public async getProfile(userId: string): Promise<SafeUser> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw AppError.notFound('User not found');
    }
    return toSafeUser(user);
  }

  public async updateProfile(
    userId: string,
    dto: { name?: string; phone?: string; avatarUrl?: string; address?: string }
  ): Promise<SafeUser> {
    const updated = await this.userRepo.update(userId, dto);
    if (!updated) {
      throw AppError.notFound('User not found');
    }
    return toSafeUser(updated);
  }

  // Address operations
  public async getAddresses(userId: string): Promise<AddressEntity[]> {
    return this.addressRepo.findByUserId(userId);
  }

  public async addAddress(
    userId: string,
    dto: { label: string; fullAddress: string; street: string; apartment?: string; deliveryNotes?: string; isDefault?: boolean }
  ): Promise<AddressEntity> {
    const existing = await this.addressRepo.findByUserId(userId);
    const newAddress: AddressEntity = {
      id: `addr_${uuidv4().replace(/-/g, '').substring(0, 10)}`,
      userId,
      label: dto.label.trim() || 'Home',
      fullAddress: dto.fullAddress.trim(),
      street: dto.street.trim(),
      apartment: dto.apartment?.trim(),
      deliveryNotes: dto.deliveryNotes?.trim(),
      isDefault: dto.isDefault ?? existing.length === 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.addressRepo.create(newAddress);
  }

  public async deleteAddress(userId: string, addressId: string): Promise<boolean> {
    const success = await this.addressRepo.delete(addressId, userId);
    if (!success) {
      throw AppError.notFound('Address not found or unauthorized');
    }
    return true;
  }

  public async setDefaultAddress(userId: string, addressId: string): Promise<AddressEntity> {
    const updated = await this.addressRepo.setDefault(addressId, userId);
    if (!updated) {
      throw AppError.notFound('Address not found or unauthorized');
    }
    return updated;
  }

  // Payment card operations
  public async getCards(userId: string): Promise<PaymentCardEntity[]> {
    return this.addressRepo.findCardsByUserId(userId);
  }

  public async addCard(
    userId: string,
    dto: { cardHolderName: string; cardNumber: string; expiryDate: string; brand?: string; isDefault?: boolean }
  ): Promise<PaymentCardEntity> {
    const existing = await this.addressRepo.findCardsByUserId(userId);
    const rawNumber = dto.cardNumber.replace(/\s+/g, '');
    const last4 = rawNumber.slice(-4) || '4242';
    const masked = `•••• •••• •••• ${last4}`;
    const brand = dto.brand || (rawNumber.startsWith('4') ? 'Visa' : 'Mastercard');

    const card: PaymentCardEntity = {
      id: `card_${uuidv4().replace(/-/g, '').substring(0, 10)}`,
      userId,
      cardHolderName: dto.cardHolderName.trim(),
      cardNumber: masked,
      expiryDate: dto.expiryDate.trim(),
      brand,
      isDefault: dto.isDefault ?? existing.length === 0,
      createdAt: new Date().toISOString(),
    };

    return this.addressRepo.createCard(card);
  }

  public async deleteCard(userId: string, cardId: string): Promise<boolean> {
    const success = await this.addressRepo.deleteCard(cardId, userId);
    if (!success) {
      throw AppError.notFound('Card not found or unauthorized');
    }
    return true;
  }

  // Notifications operations
  public async getNotifications(userId: string): Promise<NotificationEntity[]> {
    return this.notificationRepo.findByUserId(userId);
  }

  public async markAllNotificationsRead(userId: string): Promise<void> {
    await this.notificationRepo.markAllRead(userId);
  }
}
