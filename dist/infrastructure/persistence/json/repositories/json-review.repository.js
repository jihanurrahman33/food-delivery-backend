"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonReviewRepository = void 0;
const json_file_store_1 = require("../json-file-store");
class JsonReviewRepository {
    store;
    constructor(dataDir) {
        this.store = new json_file_store_1.JsonFileStore('reviews', dataDir);
    }
    async findByRestaurantId(restaurantId) {
        const list = await this.store.filter((r) => r.restaurantId === restaurantId);
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    async create(review) {
        return this.store.insert(review);
    }
}
exports.JsonReviewRepository = JsonReviewRepository;
