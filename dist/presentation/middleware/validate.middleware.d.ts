import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
export declare const validateRequest: (schemas: {
    body?: ZodSchema<any>;
    query?: ZodSchema<any>;
    params?: ZodSchema<any>;
}) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
