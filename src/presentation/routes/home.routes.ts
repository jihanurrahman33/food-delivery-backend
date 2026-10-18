import { Router } from 'express';
import { HomeController } from '../controllers/home.controller';
import { optionalAuth } from '../middleware/auth.middleware';

export const createHomeRouter = (controller: HomeController): Router => {
  const router = Router();

  router.get('/discovery', optionalAuth, controller.getHomeDiscovery);
  router.get('/banners', controller.getBanners);
  router.get('/categories', controller.getCategories);
  router.get('/popular-foods', controller.getPopularFoods);

  return router;
};
