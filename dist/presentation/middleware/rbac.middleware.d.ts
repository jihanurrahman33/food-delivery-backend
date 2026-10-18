import { Response, NextFunction } from 'express';
import { UserRole } from '../../domain/entities/user.entity';
import { AuthenticatedRequest } from './auth.middleware';
export declare const requireRole: (...allowedRoles: UserRole[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
