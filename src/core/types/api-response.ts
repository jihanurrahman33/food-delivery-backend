import { ErrorCode } from '../errors/error-codes';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    [key: string]: any;
  };
  error?: {
    code: ErrorCode;
    message: string;
    details?: any;
  };
  timestamp: string;
  correlationId?: string;
}

export class ResponseFormatter {
  static success<T>(data?: T, message?: string, meta?: any, correlationId?: string): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
      correlationId,
    };
  }

  static error(code: ErrorCode, message: string, details?: any, correlationId?: string): ApiResponse<null> {
    return {
      success: false,
      error: {
        code,
        message,
        details,
      },
      timestamp: new Date().toISOString(),
      correlationId,
    };
  }
}
