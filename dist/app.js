"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = require("./config");
const correlation_middleware_1 = require("./presentation/middleware/correlation.middleware");
const error_middleware_1 = require("./presentation/middleware/error.middleware");
const rate_limit_middleware_1 = require("./presentation/middleware/rate-limit.middleware");
const routes_1 = require("./presentation/routes");
const swagger_1 = require("./presentation/docs/swagger");
const app_error_1 = require("./core/errors/app-error");
function createApp(container) {
    const app = (0, express_1.default)();
    // 1. Security & Core Middlewares
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: config_1.appConfig.NODE_ENV === 'production' && config_1.appConfig.CORS_ORIGIN !== '*'
            ? config_1.appConfig.CORS_ORIGIN.split(',').map((o) => o.trim())
            : (origin, callback) => callback(null, true),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-correlation-id', 'x-webhook-signature'],
    }));
    if (config_1.appConfig.NODE_ENV !== 'test') {
        app.use((0, morgan_1.default)(':date[iso] :method :url :status :response-time ms - :res[content-length]'));
    }
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    // 2. Correlation ID
    app.use(correlation_middleware_1.correlationMiddleware);
    // 3. Global Rate Limiter
    app.use(rate_limit_middleware_1.globalRateLimiter);
    // 4. API Documentation (Swagger)
    const swaggerOptions = {
        customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
        customJs: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js',
        ],
    };
    app.get('/api-docs.json', (req, res) => {
        res.json(swagger_1.swaggerSpec);
    });
    app.get(`${config_1.appConfig.API_PREFIX}/docs.json`, (req, res) => {
        res.json(swagger_1.swaggerSpec);
    });
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, swaggerOptions));
    app.use(`${config_1.appConfig.API_PREFIX}/docs`, swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, swaggerOptions));
    // 5. API V1 Routes
    app.use(config_1.appConfig.API_PREFIX, (0, routes_1.createApiRouter)(container));
    // Root welcome route
    app.get('/', (req, res) => {
        res.json({
            name: 'Food Delivery API',
            version: '1.0.0',
            status: 'active',
            documentation: '/api-docs',
            health: `${config_1.appConfig.API_PREFIX}/health`,
        });
    });
    // 6. 404 Route Catch-All
    app.use((req, res, next) => {
        next(app_error_1.AppError.notFound(`Route '${req.method} ${req.originalUrl}' not found`));
    });
    // 7. Centralized Error Handler
    app.use(error_middleware_1.errorHandler);
    return app;
}
