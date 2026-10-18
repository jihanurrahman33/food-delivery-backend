"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHomeRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const createHomeRouter = (controller) => {
    const router = (0, express_1.Router)();
    router.get('/discovery', auth_middleware_1.optionalAuth, controller.getHomeDiscovery);
    router.get('/banners', controller.getBanners);
    router.get('/categories', controller.getCategories);
    router.get('/popular-foods', controller.getPopularFoods);
    return router;
};
exports.createHomeRouter = createHomeRouter;
