"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const app_error_1 = require("../../core/errors/app-error");
const validateRequest = (schemas) => {
    return async (req, res, next) => {
        try {
            if (schemas.params) {
                req.params = await schemas.params.parseAsync(req.params);
            }
            if (schemas.query) {
                req.query = await schemas.query.parseAsync(req.query);
            }
            if (schemas.body) {
                req.body = await schemas.body.parseAsync(req.body);
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const formatted = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                next(app_error_1.AppError.validation('Request validation failed', formatted));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validateRequest = validateRequest;
