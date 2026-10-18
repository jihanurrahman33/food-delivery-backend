import { Response, NextFunction } from 'express';
import { AppError } from '../../core/errors/app-error';
import { UserRole } from '../../domain/entities/user.entity';
import { AuthenticatedRequest } from './auth.middleware';

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw AppError.unauthorized('Authentication required');
    }

    // Admin role always has access
    if (req.user.role === 'admin') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw AppError.forbidden(
        `Forbidden: Role '${req.user.role}' lacks permission for this action. Required: [${allowedRoles.join(', ')}]`
      );
    }

    next();
  };
};
