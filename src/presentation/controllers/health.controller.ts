import { Request, Response } from 'express';
import { ResponseFormatter } from '../../core/types/api-response';

export class HealthController {
  public check = (req: Request, res: Response): void => {
    const health = {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
    };

    res.status(200).json(ResponseFormatter.success(health, 'System healthy'));
  };
}
