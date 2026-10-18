import { Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/auth.service';
import { ResponseFormatter } from '../../core/types/api-response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public register = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json(
        ResponseFormatter.success(result, 'Account registered successfully', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public login = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.status(200).json(
        ResponseFormatter.success(result, 'Login successful', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public refreshToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const tokens = await this.authService.refreshToken(refreshToken);
      res.status(200).json(
        ResponseFormatter.success(tokens, 'Token refreshed successfully', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authService.getCurrentUser(req.user!.userId);
      res.status(200).json(
        ResponseFormatter.success(user, 'Current user profile retrieved', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public updateMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.authService.updateProfile(req.user!.userId, req.body);
      res.status(200).json(
        ResponseFormatter.success(updated, 'Profile updated successfully', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public switchRole = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.authService.switchRole(req.user!.userId, req.body.role);
      res.status(200).json(
        ResponseFormatter.success(updated, `Switched to role '${req.body.role}'`, undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public sendOtp = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.sendOtp(req.body.email);
      res.status(200).json(
        ResponseFormatter.success(result, result.message, undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public verifyOtp = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const valid = await this.authService.verifyOtp(req.body.email, req.body.code);
      res.status(200).json(
        ResponseFormatter.success({ valid }, 'OTP verification successful', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public resetPassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.resetPassword(req.body.email, req.body.newPassword);
      res.status(200).json(
        ResponseFormatter.success(null, 'Password has been reset successfully', undefined, req.correlationId)
      );
    } catch (err) {
      next(err);
    }
  };

  public logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    res.status(200).json(
      ResponseFormatter.success(null, 'Logged out successfully', undefined, req.correlationId)
    );
  };
}
