import { Router } from 'express';
import { RestaurantController } from '../controllers/restaurant.controller';
import { authenticateJwt, optionalAuth } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createReviewSchema } from '../validators/payment.validator';

export const createRestaurantRouter = (controller: RestaurantController): Router => {
  const router = Router();

  router.get('/restaurants', optionalAuth, controller.getRestaurants);
  router.get('/restaurants/:id', optionalAuth, controller.getRestaurantById);
  router.get('/restaurants/:id/foods', controller.getFoodsByRestaurant);
  router.get('/restaurants/:id/reviews', controller.getReviews);
  router.post(
    '/restaurants/:id/reviews',
    authenticateJwt,
    validateRequest({ body: createReviewSchema }),
    controller.addReview
  );

  router.get('/foods/search', controller.searchFoods);
  router.get('/foods/:id', controller.getFoodById);

  router.post('/favorites/toggle', authenticateJwt, controller.toggleFavorite);
  router.get('/favorites', authenticateJwt, controller.getFavorites);

  return router;
};
