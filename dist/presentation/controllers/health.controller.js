"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const api_response_1 = require("../../core/types/api-response");
class HealthController {
    check = (req, res) => {
        const health = {
            status: 'healthy',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            nodeVersion: process.version,
            memoryUsage: process.memoryUsage(),
            environment: process.env.NODE_ENV || 'development',
        };
        res.status(200).json(api_response_1.ResponseFormatter.success(health, 'System healthy'));
    };
}
exports.HealthController = HealthController;
