"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeController = void 0;
const api_response_1 = require("../../core/types/api-response");
class HomeController {
    restaurantService;
    constructor(restaurantService) {
        this.restaurantService = restaurantService;
    }
    getHomeDiscovery = async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            const [banners, categories, featuredRestaurants, popularFoods] = await Promise.all([
                this.restaurantService.getBanners(),
                this.restaurantService.getCategories(),
                this.restaurantService.getFeaturedRestaurants(userId),
                this.restaurantService.getPopularFoods(),
            ]);
            res.status(200).json(api_response_1.ResponseFormatter.success({
                banners,
                categories,
                featuredRestaurants,
                popularFoods,
            }, 'Home discovery payload retrieved', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getBanners = async (req, res, next) => {
        try {
            const banners = await this.restaurantService.getBanners();
            res.status(200).json(api_response_1.ResponseFormatter.success(banners, 'Banners retrieved', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getCategories = async (req, res, next) => {
        try {
            const categories = await this.restaurantService.getCategories();
            res.status(200).json(api_response_1.ResponseFormatter.success(categories, 'Categories retrieved', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getPopularFoods = async (req, res, next) => {
        try {
            const popularFoods = await this.restaurantService.getPopularFoods();
            res.status(200).json(api_response_1.ResponseFormatter.success(popularFoods, 'Popular foods retrieved', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
}
exports.HomeController = HomeController;
