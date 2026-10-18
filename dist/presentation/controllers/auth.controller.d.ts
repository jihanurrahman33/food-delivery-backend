import { Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/auth.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    login: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    refreshToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getMe: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    updateMe: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    switchRole: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    sendOtp: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    verifyOtp: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    resetPassword: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    logout: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
