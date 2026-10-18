import { Response, NextFunction } from 'express';
import { ProfileService } from '../../application/services/profile.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getProfile: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    updateProfile: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getAddresses: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    addAddress: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteAddress: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    setDefaultAddress: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getCards: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    addCard: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    deleteCard: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getNotifications: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    markNotificationsRead: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
}
