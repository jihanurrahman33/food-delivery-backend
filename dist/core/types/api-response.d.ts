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
export declare class ResponseFormatter {
    static success<T>(data?: T, message?: string, meta?: any, correlationId?: string): ApiResponse<T>;
    static error(code: ErrorCode, message: string, details?: any, correlationId?: string): ApiResponse<null>;
}
