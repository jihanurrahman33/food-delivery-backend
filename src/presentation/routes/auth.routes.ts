import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rate-limit.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
  sendOtpSchema,
  switchRoleSchema,
  updateProfileSchema,
  verifyOtpSchema,
} from '../validators/auth.validator';

export const createAuthRouter = (controller: AuthController): Router => {
  const router = Router();

  router.post(
    '/register',
    authRateLimiter,
    validateRequest({ body: registerSchema }),
    controller.register
  );

  router.post(
    '/login',
    authRateLimiter,
    validateRequest({ body: loginSchema }),
    controller.login
  );

  router.post(
    '/refresh-token',
    validateRequest({ body: refreshTokenSchema }),
    controller.refreshToken
  );

  router.get('/me', authenticateJwt, controller.getMe);

  router.put(
    '/me',
    authenticateJwt,
    validateRequest({ body: updateProfileSchema }),
    controller.updateMe
  );

  router.put(
    '/role',
    authenticateJwt,
    validateRequest({ body: switchRoleSchema }),
    controller.switchRole
  );

  router.post(
    '/send-otp',
    validateRequest({ body: sendOtpSchema }),
    controller.sendOtp
  );

  router.post(
    '/verify-otp',
    validateRequest({ body: verifyOtpSchema }),
    controller.verifyOtp
  );

  router.post(
    '/reset-password',
    validateRequest({ body: resetPasswordSchema }),
    controller.resetPassword
  );

  router.post('/logout', authenticateJwt, controller.logout);

  return router;
};
