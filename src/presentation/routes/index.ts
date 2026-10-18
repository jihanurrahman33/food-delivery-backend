import { Router } from 'express';
import { DependencyContainer } from '../../container';
import { createAuthRouter } from './auth.routes';
import { createHomeRouter } from './home.routes';
import { createRestaurantRouter } from './restaurant.routes';
import { createOrderRouter } from './order.routes';
import { createPaymentRouter } from './payment.routes';
import { createProfileRouter } from './profile.routes';
import { createChefRouter } from './chef.routes';
import { createRiderRouter } from './rider.routes';
import { createHealthRouter } from './health.routes';

export const createApiRouter = (c: DependencyContainer): Router => {
  const router = Router();

  router.use('/health', createHealthRouter(c.healthController));
  router.use('/auth', createAuthRouter(c.authController));
  router.use('/home', createHomeRouter(c.homeController));
  router.use('/', createRestaurantRouter(c.restaurantController));
  router.use('/orders', createOrderRouter(c.orderController));
  router.use('/payments', createPaymentRouter(c.paymentController));
  router.use('/', createProfileRouter(c.profileController));
  router.use('/chef', createChefRouter(c.chefController));
  router.use('/rider', createRiderRouter(c.riderController));

  return router;
};
