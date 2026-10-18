"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const config_1 = require("./config");
const container_1 = require("./container");
const app_1 = require("./app");
const seed_1 = require("./infrastructure/persistence/json/seed");
const logger_1 = require("./core/utils/logger");
async function bootstrap() {
    try {
        // 1. Ensure initial seed data exists
        await (0, seed_1.seedInitialData)(config_1.appConfig.DATA_DIR);
        // 2. Initialize Express application
        const app = (0, app_1.createApp)(container_1.container);
        const server = http_1.default.createServer(app);
        const port = config_1.appConfig.PORT;
        server.listen(port, () => {
            logger_1.logger.info(`🚀 Food Delivery Backend running on port ${port}`);
            logger_1.logger.info(`📖 API Documentation available at http://localhost:${port}/api-docs`);
            logger_1.logger.info(`🩺 Health Check available at http://localhost:${port}${config_1.appConfig.API_PREFIX}/health`);
        });
        // Graceful Shutdown
        const shutdown = (signal) => {
            logger_1.logger.info(`Received ${signal}. Shutting down gracefully...`);
            server.close(() => {
                logger_1.logger.info('HTTP server closed. Exiting process.');
                process.exit(0);
            });
            // Force shutdown after 10s timeout
            setTimeout(() => {
                logger_1.logger.error('Forced shutdown due to timeout.');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('unhandledRejection', (reason) => {
            logger_1.logger.error('Unhandled Rejection detected:', reason);
        });
        process.on('uncaughtException', (error) => {
            logger_1.logger.error('Uncaught Exception detected:', error);
            process.exit(1);
        });
    }
    catch (err) {
        logger_1.logger.error('Fatal bootstrap failure:', err);
        process.exit(1);
    }
}
bootstrap();
