import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env
dotenv.config();

const configSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().default('*'),
  JWT_ACCESS_SECRET: z.string().min(16).default('food_delivery_jwt_access_super_secret_key_2026_production_grade'),
  JWT_REFRESH_SECRET: z.string().min(16).default('food_delivery_jwt_refresh_super_secret_key_2026_production_grade'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(1000),
  DATA_DIR: z.string().default(
    process.env.DATA_DIR ||
      (process.env.VERCEL ? path.join('/tmp', 'data') : path.resolve(process.cwd(), 'data'))
  ),
  PAYMENT_PROVIDER: z.enum(['mock', 'stripe', 'paypal']).default('mock'),
  PAYMENT_WEBHOOK_SECRET: z.string().default('whsec_food_delivery_secure_webhook_key_2026'),
});

export type AppConfigType = z.infer<typeof configSchema>;

/**
 * Singleton Application Configuration
 */
class Config {
  private static instance: Config;
  public readonly values: AppConfigType;

  private constructor() {
    const parsed = configSchema.safeParse(process.env);
    if (!parsed.success) {
      console.error('Invalid environment configuration:', parsed.error.format());
      throw new Error('Environment configuration validation failed');
    }
    this.values = parsed.data;
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

export const appConfig = Config.getInstance().values;
