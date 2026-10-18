"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseFormatter = void 0;
class ResponseFormatter {
    static success(data, message, meta, correlationId) {
        return {
            success: true,
            message,
            data,
            meta,
            timestamp: new Date().toISOString(),
            correlationId,
        };
    }
    static error(code, message, details, correlationId) {
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
exports.ResponseFormatter = ResponseFormatter;
