import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createPaymentIntentSchema, verifyPaymentSchema } from '../validators/payment.validator';

export const createPaymentRouter = (controller: PaymentController): Router => {
  const router = Router();

  router.post(
    '/create-intent',
    authenticateJwt,
    validateRequest({ body: createPaymentIntentSchema }),
    controller.createIntent
  );

  router.post(
    '/initiate',
    authenticateJwt,
    validateRequest({ body: createPaymentIntentSchema }),
    controller.createIntent
  );

  router.post(
    '/verify',
    authenticateJwt,
    validateRequest({ body: verifyPaymentSchema }),
    controller.verifyPayment
  );

  router.get('/transactions', authenticateJwt, controller.getTransactions);

  // Webhook endpoints
  router.post('/webhook', controller.handleWebhook);
  router.post('/webhook/:provider', controller.handleWebhook);

  return router;
};
