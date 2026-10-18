import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../../application/services/auth.service';
export interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
    correlationId?: string;
}
export declare const authenticateJwt: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
