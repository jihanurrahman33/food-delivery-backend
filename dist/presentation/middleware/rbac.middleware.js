"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const app_error_1 = require("../../core/errors/app-error");
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw app_error_1.AppError.unauthorized('Authentication required');
        }
        // Admin role always has access
        if (req.user.role === 'admin') {
            return next();
        }
        if (!allowedRoles.includes(req.user.role)) {
            throw app_error_1.AppError.forbidden(`Forbidden: Role '${req.user.role}' lacks permission for this action. Required: [${allowedRoles.join(', ')}]`);
        }
        next();
    };
};
exports.requireRole = requireRole;
