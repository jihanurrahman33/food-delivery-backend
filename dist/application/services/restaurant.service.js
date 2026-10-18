"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantService = void 0;
const uuid_1 = require("uuid");
const app_error_1 = require("../../core/errors/app-error");
class RestaurantService {
    restaurantRepo;
    foodItemRepo;
    categoryRepo;
    bannerRepo;
    reviewRepo;
    constructor(restaurantRepo, foodItemRepo, categoryRepo, bannerRepo, reviewRepo) {
        this.restaurantRepo = restaurantRepo;
        this.foodItemRepo = foodItemRepo;
        this.categoryRepo = categoryRepo;
        this.bannerRepo = bannerRepo;
        this.reviewRepo = reviewRepo;
    }
    async getBanners() {
        return this.bannerRepo.findAll();
    }
    async getCategories() {
        return this.categoryRepo.findAll();
    }
    async getFeaturedRestaurants(userId) {
        const list = await this.restaurantRepo.findAll({ isFeatured: true });
        if (userId) {
            const favorites = await this.restaurantRepo.getFavorites(userId);
            const favIds = new Set(favorites.map((f) => f.id));
            return list.map((r) => ({ ...r, isFavorite: favIds.has(r.id) }));
        }
        return list;
    }
    async getPopularFoods() {
        return this.foodItemRepo.findAll({ isPopular: true });
    }
    async getRestaurants(options) {
        let list = await this.restaurantRepo.findAll({
            categoryId: options?.categoryId,
            search: options?.search,
        });
        if (options?.userId) {
            const favorites = await this.restaurantRepo.getFavorites(options.userId);
            const favIds = new Set(favorites.map((f) => f.id));
            list = list.map((r) => ({ ...r, isFavorite: favIds.has(r.id) }));
        }
        return list;
    }
    async getRestaurantById(id, userId) {
        const restaurant = await this.restaurantRepo.findById(id);
        if (!restaurant) {
            throw app_error_1.AppError.notFound(`Restaurant with ID '${id}' not found`);
        }
        if (userId) {
            const favorites = await this.restaurantRepo.getFavorites(userId);
            const isFav = favorites.some((f) => f.id === id);
            return { ...restaurant, isFavorite: isFav };
        }
        return restaurant;
    }
    async getFoodsByRestaurant(restaurantId) {
        return this.foodItemRepo.findAll({ restaurantId });
    }
    async searchFoods(query) {
        return this.foodItemRepo.findAll({ search: query });
    }
    async getFoodById(id) {
        const item = await this.foodItemRepo.findById(id);
        if (!item) {
            throw app_error_1.AppError.notFound(`Food item with ID '${id}' not found`);
        }
        return item;
    }
    async toggleFavorite(userId, restaurantId) {
        const isFav = await this.restaurantRepo.toggleFavorite(userId, restaurantId);
        return { isFavorite: isFav };
    }
    async getFavorites(userId) {
        return this.restaurantRepo.getFavorites(userId);
    }
    async getReviews(restaurantId) {
        return this.reviewRepo.findByRestaurantId(restaurantId);
    }
    async addReview(userId, author, avatar, dto) {
        const restaurant = await this.restaurantRepo.findById(dto.restaurantId);
        if (!restaurant) {
            throw app_error_1.AppError.notFound('Restaurant not found');
        }
        const newReview = {
            id: `rev_${(0, uuid_1.v4)().replace(/-/g, '').substring(0, 10)}`,
            restaurantId: dto.restaurantId,
            orderId: dto.orderId,
            userId,
            author,
            avatar,
            rating: dto.rating,
            riderRating: dto.riderRating,
            comment: dto.comment.trim(),
            createdAt: new Date().toISOString(),
        };
        return this.reviewRepo.create(newReview);
    }
}
exports.RestaurantService = RestaurantService;
