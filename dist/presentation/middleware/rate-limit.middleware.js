"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimiter = exports.globalRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("../../config");
const app_error_1 = require("../../core/errors/app-error");
exports.globalRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.appConfig.RATE_LIMIT_WINDOW_MS,
    max: config_1.appConfig.RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new app_error_1.AppError('Too many requests. Please try again later.', 429));
    },
});
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 attempts per IP per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(new app_error_1.AppError('Too many authentication attempts. Please try again in 15 minutes.', 429));
    },
});
