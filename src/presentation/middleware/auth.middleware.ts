import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appConfig } from '../../config';
import { AppError } from '../../core/errors/app-error';
import { TokenPayload } from '../../application/services/auth.service';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
  correlationId?: string;
}

export const authenticateJwt = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw AppError.unauthorized('Authentication token missing or invalid');
  }

  const token = authHeader.substring(7).trim();
  try {
    const decoded = jwt.verify(token, appConfig.JWT_ACCESS_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw AppError.unauthorized('Authentication token has expired. Please refresh session.');
    }
    throw AppError.unauthorized('Invalid authentication token');
  }
};

export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    try {
      const decoded = jwt.verify(token, appConfig.JWT_ACCESS_SECRET) as TokenPayload;
      req.user = decoded;
    } catch (_) {
      // Ignore invalid token for optional auth routes
    }
  }
  next();
};
