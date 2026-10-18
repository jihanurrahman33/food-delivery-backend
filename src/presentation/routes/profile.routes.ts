import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { updateProfileSchema } from '../validators/auth.validator';
import { createAddressSchema, createCardSchema } from '../validators/payment.validator';

export const createProfileRouter = (controller: ProfileController): Router => {
  const router = Router();

  // Profile info
  router.get('/profile', authenticateJwt, controller.getProfile);
  router.put(
    '/profile',
    authenticateJwt,
    validateRequest({ body: updateProfileSchema }),
    controller.updateProfile
  );

  // Address routes
  router.get('/addresses', authenticateJwt, controller.getAddresses);
  router.post(
    '/addresses',
    authenticateJwt,
    validateRequest({ body: createAddressSchema }),
    controller.addAddress
  );
  router.delete('/addresses/:id', authenticateJwt, controller.deleteAddress);
  router.put('/addresses/:id/default', authenticateJwt, controller.setDefaultAddress);

  // Payment Cards routes
  router.get('/cards', authenticateJwt, controller.getCards);
  router.post(
    '/cards',
    authenticateJwt,
    validateRequest({ body: createCardSchema }),
    controller.addCard
  );
  router.delete('/cards/:id', authenticateJwt, controller.deleteCard);

  // Notifications routes
  router.get('/notifications', authenticateJwt, controller.getNotifications);
  router.put('/notifications/mark-read', authenticateJwt, controller.markNotificationsRead);

  return router;
};
