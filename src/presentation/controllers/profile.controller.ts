import { Response, NextFunction } from 'express';
import { ProfileService } from '../../application/services/profile.service';
import { ResponseFormatter } from '../../core/types/api-response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class ProfileController {
  private readonly profileService: ProfileService;

  constructor(profileService: ProfileService) {
    this.profileService = profileService;
  }

  public getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profile = await this.profileService.getProfile(req.user!.userId);
      res.status(200).json(
        ResponseFormatter.success(profile, 'Profile retrieved', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.profileService.updateProfile(req.user!.userId, req.body);
      res.status(200).json(
        ResponseFormatter.success(updated, 'Profile updated successfully', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public getAddresses = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const addresses = await this.profileService.getAddresses(req.user!.userId);
      res.status(200).json(
        ResponseFormatter.success(addresses, 'Addresses retrieved', { total: addresses.length }, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public addAddress = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const address = await this.profileService.addAddress(req.user!.userId, req.body);
      res.status(201).json(
        ResponseFormatter.success(address, 'Address saved successfully', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public deleteAddress = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.profileService.deleteAddress(req.user!.userId, id);
      res.status(200).json(
        ResponseFormatter.success(null, 'Address deleted', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public setDefaultAddress = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const updated = await this.profileService.setDefaultAddress(req.user!.userId, id);
      res.status(200).json(
        ResponseFormatter.success(updated, 'Default address updated', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public getCards = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const cards = await this.profileService.getCards(req.user!.userId);
      res.status(200).json(
        ResponseFormatter.success(cards, 'Payment cards retrieved', { total: cards.length }, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public addCard = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const card = await this.profileService.addCard(req.user!.userId, req.body);
      res.status(201).json(
        ResponseFormatter.success(card, 'Card saved successfully', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public deleteCard = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.profileService.deleteCard(req.user!.userId, id);
      res.status(200).json(
        ResponseFormatter.success(null, 'Card deleted', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public getNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const notifs = await this.profileService.getNotifications(req.user!.userId);
      res.status(200).json(
        ResponseFormatter.success(notifs, 'Notifications retrieved', { total: notifs.length }, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public markNotificationsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.profileService.markAllNotificationsRead(req.user!.userId);
      res.status(200).json(
        ResponseFormatter.success(null, 'All notifications marked as read', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };
}
