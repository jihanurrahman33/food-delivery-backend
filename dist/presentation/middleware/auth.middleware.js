"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const app_error_1 = require("../../core/errors/app-error");
const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw app_error_1.AppError.unauthorized('Authentication token missing or invalid');
    }
    const token = authHeader.substring(7).trim();
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.appConfig.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw app_error_1.AppError.unauthorized('Authentication token has expired. Please refresh session.');
        }
        throw app_error_1.AppError.unauthorized('Invalid authentication token');
    }
};
exports.authenticateJwt = authenticateJwt;
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7).trim();
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.appConfig.JWT_ACCESS_SECRET);
            req.user = decoded;
        }
        catch (_) {
            // Ignore invalid token for optional auth routes
        }
    }
    next();
};
exports.optionalAuth = optionalAuth;
