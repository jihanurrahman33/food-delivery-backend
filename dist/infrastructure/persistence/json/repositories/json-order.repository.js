"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonOrderRepository = void 0;
const json_file_store_1 = require("../json-file-store");
class JsonOrderRepository {
    store;
    constructor(dataDir) {
        this.store = new json_file_store_1.JsonFileStore('orders', dataDir);
    }
    async findAll(options) {
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
    async findById(id) {
        return this.store.findById(id);
    }
    async create(order) {
        return this.store.insert(order);
    }
    async update(id, partial) {
        return this.store.update(id, { ...partial, updatedAt: new Date().toISOString() });
    }
}
exports.JsonOrderRepository = JsonOrderRepository;
