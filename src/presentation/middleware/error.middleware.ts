import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../core/errors/app-error';
import { ErrorCode } from '../../core/errors/error-codes';
import { ResponseFormatter } from '../../core/types/api-response';
import { logger } from '../../core/utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const correlationId = (req as any).correlationId || (req.headers['x-correlation-id'] as string);

  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error(`Non-operational AppError [${correlationId}]:`, err);
    }
    res.status(err.statusCode).json(
      ResponseFormatter.error(err.code, err.message, err.details, correlationId)
    );
    return;
  }

  // Handle SyntaxError (malformed JSON body)
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json(
      ResponseFormatter.error(ErrorCode.BAD_REQUEST, 'Malformed JSON body in request', undefined, correlationId)
    );
    return;
  }

  // Unexpected unhandled exceptions
  logger.error(`Unhandled Exception [${correlationId}]:`, err);

  const message =
    process.env.NODE_ENV === 'production'
      ? 'An unexpected internal error occurred'
      : err?.message || 'Internal server error';

  res.status(500).json(
    ResponseFormatter.error(ErrorCode.INTERNAL_ERROR, message, undefined, correlationId)
  );
};
