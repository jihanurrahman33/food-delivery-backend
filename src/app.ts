import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { appConfig } from './config';
import { DependencyContainer } from './container';
import { correlationMiddleware } from './presentation/middleware/correlation.middleware';
import { errorHandler } from './presentation/middleware/error.middleware';
import { globalRateLimiter } from './presentation/middleware/rate-limit.middleware';
import { createApiRouter } from './presentation/routes';
import { swaggerSpec } from './presentation/docs/swagger';
import { AppError } from './core/errors/app-error';

export function createApp(container: DependencyContainer): Express {
  const app = express();

  // 1. Security & Core Middlewares
  app.use(helmet());

  app.use(
    cors({
      origin: appConfig.NODE_ENV === 'production' && appConfig.CORS_ORIGIN !== '*'
        ? appConfig.CORS_ORIGIN.split(',').map((o) => o.trim())
        : (origin, callback) => callback(null, true),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-correlation-id', 'x-webhook-signature'],
    })
  );

  if (appConfig.NODE_ENV !== 'test') {
    app.use(morgan(':date[iso] :method :url :status :response-time ms - :res[content-length]'));
  }

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 2. Correlation ID
  app.use(correlationMiddleware);

  // 3. Global Rate Limiter
  app.use(globalRateLimiter);

  // 4. API Documentation (Swagger)
  const swaggerOptions = {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js',
    ],
  };

  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.json(swaggerSpec);
  });
  app.get(`${appConfig.API_PREFIX}/docs.json`, (req: Request, res: Response) => {
    res.json(swaggerSpec);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));
  app.use(`${appConfig.API_PREFIX}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

  // 5. API V1 Routes
  app.use(appConfig.API_PREFIX, createApiRouter(container));

  // Root welcome route
  app.get(['/', '/api', '/api/index', '/api/index.js'], (req: Request, res: Response) => {
    res.json({
      name: 'Food Delivery API',
      version: '1.0.0',
      status: 'active',
      documentation: '/api-docs',
      health: `${appConfig.API_PREFIX}/health`,
    });
  });

  // 6. 404 Route Catch-All
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(AppError.notFound(`Route '${req.method} ${req.originalUrl}' not found`));
  });

  // 7. Centralized Error Handler
  app.use(errorHandler);

  return app;
}
