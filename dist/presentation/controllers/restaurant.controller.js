"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantController = void 0;
const api_response_1 = require("../../core/types/api-response");
class RestaurantController {
    restaurantService;
    constructor(restaurantService) {
        this.restaurantService = restaurantService;
    }
    getRestaurants = async (req, res, next) => {
        try {
            const { categoryId, search } = req.query;
            const userId = req.user?.userId;
            const restaurants = await this.restaurantService.getRestaurants({ categoryId, search, userId });
            res.status(200).json(api_response_1.ResponseFormatter.success(restaurants, 'Restaurants retrieved', { total: restaurants.length }, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getRestaurantById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const userId = req.user?.userId;
            const restaurant = await this.restaurantService.getRestaurantById(id, userId);
            res.status(200).json(api_response_1.ResponseFormatter.success(restaurant, 'Restaurant details retrieved', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getFoodsByRestaurant = async (req, res, next) => {
        try {
            const id = req.params.id;
            const foods = await this.restaurantService.getFoodsByRestaurant(id);
            res.status(200).json(api_response_1.ResponseFormatter.success(foods, 'Restaurant foods retrieved', { total: foods.length }, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    searchFoods = async (req, res, next) => {
        try {
            const { query } = req.query;
            const foods = await this.restaurantService.searchFoods(query || '');
            res.status(200).json(api_response_1.ResponseFormatter.success(foods, 'Search results retrieved', { total: foods.length }, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getFoodById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const food = await this.restaurantService.getFoodById(id);
            res.status(200).json(api_response_1.ResponseFormatter.success(food, 'Food details retrieved', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    toggleFavorite = async (req, res, next) => {
        try {
            const { restaurantId } = req.body;
            const result = await this.restaurantService.toggleFavorite(req.user.userId, restaurantId);
            res.status(200).json(api_response_1.ResponseFormatter.success(result, result.isFavorite ? 'Added to favorites' : 'Removed from favorites', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getFavorites = async (req, res, next) => {
        try {
            const favorites = await this.restaurantService.getFavorites(req.user.userId);
            res.status(200).json(api_response_1.ResponseFormatter.success(favorites, 'User favorites retrieved', { total: favorites.length }, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getReviews = async (req, res, next) => {
        try {
            const id = req.params.id;
            const reviews = await this.restaurantService.getReviews(id);
            res.status(200).json(api_response_1.ResponseFormatter.success(reviews, 'Restaurant reviews retrieved', { total: reviews.length }, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    addReview = async (req, res, next) => {
        try {
            const review = await this.restaurantService.addReview(req.user.userId, req.user.email, undefined, req.body);
            res.status(201).json(api_response_1.ResponseFormatter.success(review, 'Review submitted successfully', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
}
exports.RestaurantController = RestaurantController;
