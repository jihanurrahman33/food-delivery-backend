"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const uuid_1 = require("uuid");
const user_entity_1 = require("../../domain/entities/user.entity");
const app_error_1 = require("../../core/errors/app-error");
class ProfileService {
    addressRepo;
    notificationRepo;
    userRepo;
    constructor(addressRepo, notificationRepo, userRepo) {
        this.addressRepo = addressRepo;
        this.notificationRepo = notificationRepo;
        this.userRepo = userRepo;
    }
    // User Profile
    async getProfile(userId) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw app_error_1.AppError.notFound('User not found');
        }
        return (0, user_entity_1.toSafeUser)(user);
    }
    async updateProfile(userId, dto) {
        const updated = await this.userRepo.update(userId, dto);
        if (!updated) {
            throw app_error_1.AppError.notFound('User not found');
        }
        return (0, user_entity_1.toSafeUser)(updated);
    }
    // Address operations
    async getAddresses(userId) {
        return this.addressRepo.findByUserId(userId);
    }
    async addAddress(userId, dto) {
        const existing = await this.addressRepo.findByUserId(userId);
        const newAddress = {
            id: `addr_${(0, uuid_1.v4)().replace(/-/g, '').substring(0, 10)}`,
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
    async deleteAddress(userId, addressId) {
        const success = await this.addressRepo.delete(addressId, userId);
        if (!success) {
            throw app_error_1.AppError.notFound('Address not found or unauthorized');
        }
        return true;
    }
    async setDefaultAddress(userId, addressId) {
        const updated = await this.addressRepo.setDefault(addressId, userId);
        if (!updated) {
            throw app_error_1.AppError.notFound('Address not found or unauthorized');
        }
        return updated;
    }
    // Payment card operations
    async getCards(userId) {
        return this.addressRepo.findCardsByUserId(userId);
    }
    async addCard(userId, dto) {
        const existing = await this.addressRepo.findCardsByUserId(userId);
        const rawNumber = dto.cardNumber.replace(/\s+/g, '');
        const last4 = rawNumber.slice(-4) || '4242';
        const masked = `•••• •••• •••• ${last4}`;
        const brand = dto.brand || (rawNumber.startsWith('4') ? 'Visa' : 'Mastercard');
        const card = {
            id: `card_${(0, uuid_1.v4)().replace(/-/g, '').substring(0, 10)}`,
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
    async deleteCard(userId, cardId) {
        const success = await this.addressRepo.deleteCard(cardId, userId);
        if (!success) {
            throw app_error_1.AppError.notFound('Card not found or unauthorized');
        }
        return true;
    }
    // Notifications operations
    async getNotifications(userId) {
        return this.notificationRepo.findByUserId(userId);
    }
    async markAllNotificationsRead(userId) {
        await this.notificationRepo.markAllRead(userId);
    }
}
exports.ProfileService = ProfileService;
