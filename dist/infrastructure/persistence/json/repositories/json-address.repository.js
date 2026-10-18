"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonAddressRepository = void 0;
const json_file_store_1 = require("../json-file-store");
class JsonAddressRepository {
    addressStore;
    cardStore;
    constructor(dataDir) {
        this.addressStore = new json_file_store_1.JsonFileStore('addresses', dataDir);
        this.cardStore = new json_file_store_1.JsonFileStore('payment_cards', dataDir);
    }
    async findByUserId(userId) {
        return this.addressStore.filter((a) => a.userId === userId);
    }
    async findById(id) {
        return this.addressStore.findById(id);
    }
    async create(address) {
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
    async delete(id, userId) {
        const existing = await this.addressStore.findById(id);
        if (!existing || existing.userId !== userId)
            return false;
        return this.addressStore.delete(id);
    }
    async setDefault(id, userId) {
        const userAddresses = await this.findByUserId(userId);
        let target = null;
        for (const a of userAddresses) {
            if (a.id === id) {
                target = await this.addressStore.update(a.id, { isDefault: true });
            }
            else if (a.isDefault) {
                await this.addressStore.update(a.id, { isDefault: false });
            }
        }
        return target;
    }
    async findCardsByUserId(userId) {
        return this.cardStore.filter((c) => c.userId === userId);
    }
    async createCard(card) {
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
    async deleteCard(id, userId) {
        const existing = await this.cardStore.findById(id);
        if (!existing || existing.userId !== userId)
            return false;
        return this.cardStore.delete(id);
    }
}
exports.JsonAddressRepository = JsonAddressRepository;
