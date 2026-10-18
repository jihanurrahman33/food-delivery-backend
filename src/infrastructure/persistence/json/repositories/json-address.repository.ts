import { AddressEntity, PaymentCardEntity } from '../../../../domain/entities/address.entity';
import { IAddressRepository } from '../../../../domain/repositories';
import { JsonFileStore } from '../json-file-store';

export class JsonAddressRepository implements IAddressRepository {
  private readonly addressStore: JsonFileStore<AddressEntity>;
  private readonly cardStore: JsonFileStore<PaymentCardEntity>;

  constructor(dataDir: string) {
    this.addressStore = new JsonFileStore<AddressEntity>('addresses', dataDir);
    this.cardStore = new JsonFileStore<PaymentCardEntity>('payment_cards', dataDir);
  }

  async findByUserId(userId: string): Promise<AddressEntity[]> {
    return this.addressStore.filter((a) => a.userId === userId);
  }

  async findById(id: string): Promise<AddressEntity | null> {
    return this.addressStore.findById(id);
  }

  async create(address: AddressEntity): Promise<AddressEntity> {
    // If marked default, unset previous defaults
    if (address.isDefault) {
      const userAddresses = await this.findByUserId(address.userId);
      for (const a of userAddresses) {
        if (a.isDefault) {
          await this.addressStore.update(a.id, { isDefault: false });
        }
      }
    }
    return this.addressStore.insert(address);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const existing = await this.addressStore.findById(id);
    if (!existing || existing.userId !== userId) return false;
    return this.addressStore.delete(id);
  }

  async setDefault(id: string, userId: string): Promise<AddressEntity | null> {
    const userAddresses = await this.findByUserId(userId);
    let target: AddressEntity | null = null;

    for (const a of userAddresses) {
      if (a.id === id) {
        target = await this.addressStore.update(a.id, { isDefault: true });
      } else if (a.isDefault) {
        await this.addressStore.update(a.id, { isDefault: false });
      }
    }
    return target;
  }

  async findCardsByUserId(userId: string): Promise<PaymentCardEntity[]> {
    return this.cardStore.filter((c) => c.userId === userId);
  }

  async createCard(card: PaymentCardEntity): Promise<PaymentCardEntity> {
    if (card.isDefault) {
      const userCards = await this.findCardsByUserId(card.userId);
      for (const c of userCards) {
        if (c.isDefault) {
          await this.cardStore.update(c.id, { isDefault: false });
        }
      }
    }
    return this.cardStore.insert(card);
  }

  async deleteCard(id: string, userId: string): Promise<boolean> {
    const existing = await this.cardStore.findById(id);
    if (!existing || existing.userId !== userId) return false;
    return this.cardStore.delete(id);
  }
}
