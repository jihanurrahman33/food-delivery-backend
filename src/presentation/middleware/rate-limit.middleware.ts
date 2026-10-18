import rateLimit from 'express-rate-limit';
import { appConfig } from '../../config';
import { AppError } from '../../core/errors/app-error';

export const globalRateLimiter = rateLimit({
  windowMs: appConfig.RATE_LIMIT_WINDOW_MS,
  max: appConfig.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many requests. Please try again later.', 429));
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 attempts per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many authentication attempts. Please try again in 15 minutes.', 429));
  },
});
