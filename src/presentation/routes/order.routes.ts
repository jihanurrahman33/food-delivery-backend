import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import {
  createOrderSchema,
  rateOrderSchema,
  sendChatSchema,
  validatePromoSchema,
} from '../validators/order.validator';

export const createOrderRouter = (controller: OrderController): Router => {
  const router = Router();

  router.use(authenticateJwt);

  router.post(
    '/',
    validateRequest({ body: createOrderSchema }),
    controller.placeOrder
  );

  router.get('/active', controller.getActiveOrders);
  router.get('/history', controller.getOrderHistory);
  router.get('/:id', controller.getOrderById);
  router.post('/:id/cancel', controller.cancelOrder);

  router.post(
    '/promo/validate',
    validateRequest({ body: validatePromoSchema }),
    controller.validatePromo
  );

  router.get('/:id/chat', controller.getChatMessages);
  router.post(
    '/:id/chat',
    validateRequest({ body: sendChatSchema }),
    controller.sendChatMessage
  );

  router.post(
    '/:id/rate',
    validateRequest({ body: rateOrderSchema }),
    controller.rateOrder
  );

  return router;
};
