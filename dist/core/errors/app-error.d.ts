import { ErrorCode } from './error-codes';
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: ErrorCode;
    readonly details?: any;
    readonly isOperational: boolean;
    constructor(message: string, statusCode?: number, code?: ErrorCode, details?: any, isOperational?: boolean);
    static badRequest(message: string, details?: any): AppError;
    static unauthorized(message?: string): AppError;
    static forbidden(message?: string): AppError;
    static notFound(message?: string): AppError;
    static conflict(message: string, details?: any): AppError;
    static validation(message: string, details?: any): AppError;
    static internal(message?: string): AppError;
}
