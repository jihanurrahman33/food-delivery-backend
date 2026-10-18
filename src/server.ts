import http from 'http';
import { appConfig } from './config';
import { container } from './container';
import { createApp } from './app';
import { seedInitialData } from './infrastructure/persistence/json/seed';
import { logger } from './core/utils/logger';

async function bootstrap() {
  try {
    // 1. Ensure initial seed data exists
    await seedInitialData(appConfig.DATA_DIR);

    // 2. Initialize Express application
    const app = createApp(container);
    const server = http.createServer(app);

    const port = appConfig.PORT;
    server.listen(port, () => {
      logger.info(`🚀 Food Delivery Backend running on port ${port}`);
      logger.info(`📖 API Documentation available at http://localhost:${port}/api-docs`);
      logger.info(`🩺 Health Check available at http://localhost:${port}${appConfig.API_PREFIX}/health`);
    });

    // Graceful Shutdown
    const shutdown = (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed. Exiting process.');
        process.exit(0);
      });

      // Force shutdown after 10s timeout
      setTimeout(() => {
        logger.error('Forced shutdown due to timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason: any) => {
      logger.error('Unhandled Rejection detected:', reason);
    });

    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception detected:', error);
      process.exit(1);
    });
  } catch (err) {
    logger.error('Fatal bootstrap failure:', err);
    process.exit(1);
  }
}

bootstrap();
