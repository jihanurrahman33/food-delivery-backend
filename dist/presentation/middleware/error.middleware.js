"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const app_error_1 = require("../../core/errors/app-error");
const error_codes_1 = require("../../core/errors/error-codes");
const api_response_1 = require("../../core/types/api-response");
const logger_1 = require("../../core/utils/logger");
const errorHandler = (err, req, res, _next) => {
    const correlationId = req.correlationId || req.headers['x-correlation-id'];
    if (err instanceof app_error_1.AppError) {
        if (!err.isOperational) {
            logger_1.logger.error(`Non-operational AppError [${correlationId}]:`, err);
        }
        res.status(err.statusCode).json(api_response_1.ResponseFormatter.error(err.code, err.message, err.details, correlationId));
        return;
    }
    // Handle SyntaxError (malformed JSON body)
    if (err instanceof SyntaxError && 'body' in err) {
        res.status(400).json(api_response_1.ResponseFormatter.error(error_codes_1.ErrorCode.BAD_REQUEST, 'Malformed JSON body in request', undefined, correlationId));
        return;
    }
    // Unexpected unhandled exceptions
    logger_1.logger.error(`Unhandled Exception [${correlationId}]:`, err);
    const message = process.env.NODE_ENV === 'production'
        ? 'An unexpected internal error occurred'
        : err?.message || 'Internal server error';
    res.status(500).json(api_response_1.ResponseFormatter.error(error_codes_1.ErrorCode.INTERNAL_ERROR, message, undefined, correlationId));
};
exports.errorHandler = errorHandler;
