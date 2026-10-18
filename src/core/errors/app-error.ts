import { ErrorCode } from './error-codes';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly details?: any;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: ErrorCode = ErrorCode.INTERNAL_ERROR,
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: any): AppError {
    return new AppError(message, 400, ErrorCode.BAD_REQUEST, details);
  }

  static unauthorized(message: string = 'Authentication required'): AppError {
    return new AppError(message, 401, ErrorCode.UNAUTHORIZED);
  }

  static forbidden(message: string = 'Access denied'): AppError {
    return new AppError(message, 403, ErrorCode.FORBIDDEN);
  }

  static notFound(message: string = 'Resource not found'): AppError {
    return new AppError(message, 404, ErrorCode.NOT_FOUND);
  }

  static conflict(message: string, details?: any): AppError {
    return new AppError(message, 409, ErrorCode.CONFLICT, details);
  }

  static validation(message: string, details?: any): AppError {
    return new AppError(message, 422, ErrorCode.VALIDATION_ERROR, details);
  }

  static internal(message: string = 'An unexpected error occurred'): AppError {
    return new AppError(message, 500, ErrorCode.INTERNAL_ERROR, undefined, false);
  }
}
