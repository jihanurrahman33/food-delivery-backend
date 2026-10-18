"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRestaurantRepository = void 0;
const json_file_store_1 = require("../json-file-store");
class JsonRestaurantRepository {
    store;
    favoritesStore;
    constructor(dataDir) {
        this.store = new json_file_store_1.JsonFileStore('restaurants', dataDir);
        this.favoritesStore = new json_file_store_1.JsonFileStore('favorites', dataDir);
    }
    async findAll(options) {
        let list = await this.store.readAll();
        if (options?.isOpen !== undefined) {
            list = list.filter((r) => r.isOpen === options.isOpen);
        }
        if (options?.isFeatured !== undefined) {
            list = list.filter((r) => r.isFeatured === options.isFeatured);
        }
        if (options?.search) {
            const q = options.search.trim().toLowerCase();
            list = list.filter((r) => r.name.toLowerCase().includes(q) ||
                r.address.toLowerCase().includes(q) ||
                r.tags.some((t) => t.toLowerCase().includes(q)));
        }
        return list;
    }
    async findById(id) {
        return this.store.findById(id);
    }
    async create(restaurant) {
        return this.store.insert(restaurant);
    }
    async update(id, partial) {
        return this.store.update(id, { ...partial, updatedAt: new Date().toISOString() });
    }
    async toggleFavorite(userId, restaurantId) {
        const favId = `${userId}_${restaurantId}`;
        const existing = await this.favoritesStore.findById(favId);
        if (existing) {
            await this.favoritesStore.delete(favId);
            return false; // Removed
        }
        else {
            await this.favoritesStore.insert({ id: favId, userId, restaurantId });
            return true; // Added
        }
    }
    async getFavorites(userId) {
        const userFavs = await this.favoritesStore.filter((f) => f.userId === userId);
        const favRestaurantIds = new Set(userFavs.map((f) => f.restaurantId));
        const all = await this.store.readAll();
        return all
            .filter((r) => favRestaurantIds.has(r.id))
            .map((r) => ({ ...r, isFavorite: true }));
    }
}
exports.JsonRestaurantRepository = JsonRestaurantRepository;
