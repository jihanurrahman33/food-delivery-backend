"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const error_codes_1 = require("./error-codes");
class AppError extends Error {
    statusCode;
    code;
    details;
    isOperational;
    constructor(message, statusCode = 500, code = error_codes_1.ErrorCode.INTERNAL_ERROR, details, isOperational = true) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(message, details) {
        return new AppError(message, 400, error_codes_1.ErrorCode.BAD_REQUEST, details);
    }
    static unauthorized(message = 'Authentication required') {
        return new AppError(message, 401, error_codes_1.ErrorCode.UNAUTHORIZED);
    }
    static forbidden(message = 'Access denied') {
        return new AppError(message, 403, error_codes_1.ErrorCode.FORBIDDEN);
    }
    static notFound(message = 'Resource not found') {
        return new AppError(message, 404, error_codes_1.ErrorCode.NOT_FOUND);
    }
    static conflict(message, details) {
        return new AppError(message, 409, error_codes_1.ErrorCode.CONFLICT, details);
    }
    static validation(message, details) {
        return new AppError(message, 422, error_codes_1.ErrorCode.VALIDATION_ERROR, details);
    }
    static internal(message = 'An unexpected error occurred') {
        return new AppError(message, 500, error_codes_1.ErrorCode.INTERNAL_ERROR, undefined, false);
    }
}
exports.AppError = AppError;
