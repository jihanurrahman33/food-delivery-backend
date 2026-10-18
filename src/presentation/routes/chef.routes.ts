import { Router } from 'express';
import { ChefController } from '../controllers/chef.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { addDishSchema } from '../validators/payment.validator';

export const createChefRouter = (controller: ChefController): Router => {
  const router = Router();

  router.use(authenticateJwt);
  router.use(requireRole('chef'));

  router.get('/dashboard', controller.getDashboard);
  router.get('/orders', controller.getOrders);
  router.put('/orders/:id/status', controller.updateOrderStatus);
  router.put('/kitchen-status', controller.toggleKitchenStatus);
  router.get('/menu', controller.getMenu);
  router.post(
    '/menu',
    validateRequest({ body: addDishSchema }),
    controller.addDish
  );

  return router;
};
