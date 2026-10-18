"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFoodItemRepository = void 0;
const json_file_store_1 = require("../json-file-store");
class JsonFoodItemRepository {
    store;
    constructor(dataDir) {
        this.store = new json_file_store_1.JsonFileStore('foods', dataDir);
    }
    async findAll(options) {
        let list = await this.store.readAll();
        if (options?.restaurantId) {
            list = list.filter((f) => f.restaurantId === options.restaurantId);
        }
        if (options?.categoryId && options.categoryId !== 'cat_all') {
            list = list.filter((f) => f.categoryId === options.categoryId);
        }
        if (options?.isPopular !== undefined) {
            list = list.filter((f) => f.isPopular === options.isPopular);
        }
        if (options?.search) {
            const q = options.search.trim().toLowerCase();
            list = list.filter((f) => f.name.toLowerCase().includes(q) ||
                f.description.toLowerCase().includes(q) ||
                f.restaurantName.toLowerCase().includes(q));
        }
        return list;
    }
    async findById(id) {
        return this.store.findById(id);
    }
    async create(item) {
        return this.store.insert(item);
    }
    async update(id, partial) {
        return this.store.update(id, { ...partial, updatedAt: new Date().toISOString() });
    }
    async delete(id) {
        return this.store.delete(id);
    }
}
exports.JsonFoodItemRepository = JsonFoodItemRepository;
