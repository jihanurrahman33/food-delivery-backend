import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../../core/errors/app-error';

export const validateRequest = (schemas: {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
  params?: ZodSchema<any>;
}) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formatted = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        next(AppError.validation('Request validation failed', formatted));
      } else {
        next(error);
      }
    }
  };
};
