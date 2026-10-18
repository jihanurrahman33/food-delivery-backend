import { Router } from 'express';
import { RiderController } from '../controllers/rider.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';

export const createRiderRouter = (controller: RiderController): Router => {
  const router = Router();

  router.use(authenticateJwt);
  router.use(requireRole('rider'));

  router.get('/dashboard', controller.getDashboard);
  router.get('/available-orders', controller.getAvailableDeliveries);
  router.post('/orders/:id/accept', controller.acceptDelivery);
  router.put('/orders/:id/status', controller.updateTripStatus);
  router.put('/status', controller.toggleOnlineStatus);

  return router;
};
