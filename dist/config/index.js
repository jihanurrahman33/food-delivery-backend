"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
// Load .env
dotenv_1.default.config();
const configSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().default(5000),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    API_PREFIX: zod_1.z.string().default('/api/v1'),
    CORS_ORIGIN: zod_1.z.string().default('*'),
    JWT_ACCESS_SECRET: zod_1.z.string().min(16).default('food_delivery_jwt_access_super_secret_key_2026_production_grade'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(16).default('food_delivery_jwt_refresh_super_secret_key_2026_production_grade'),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default('1h'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('30d'),
    RATE_LIMIT_WINDOW_MS: zod_1.z.coerce.number().default(15 * 60 * 1000),
    RATE_LIMIT_MAX_REQUESTS: zod_1.z.coerce.number().default(1000),
    DATA_DIR: zod_1.z.string().default(process.env.DATA_DIR ||
        (process.env.VERCEL ? path_1.default.join('/tmp', 'data') : path_1.default.resolve(process.cwd(), 'data'))),
    PAYMENT_PROVIDER: zod_1.z.enum(['mock', 'stripe', 'paypal']).default('mock'),
    PAYMENT_WEBHOOK_SECRET: zod_1.z.string().default('whsec_food_delivery_secure_webhook_key_2026'),
});
/**
 * Singleton Application Configuration
 */
class Config {
    static instance;
    values;
    constructor() {
        const parsed = configSchema.safeParse(process.env);
        if (!parsed.success) {
            console.error('Invalid environment configuration:', parsed.error.format());
            throw new Error('Environment configuration validation failed');
        }
        this.values = parsed.data;
    }
    static getInstance() {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }
}
exports.appConfig = Config.getInstance().values;
