import { z } from 'zod';
declare const configSchema: z.ZodObject<{
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>>;
    API_PREFIX: z.ZodDefault<z.ZodString>;
    CORS_ORIGIN: z.ZodDefault<z.ZodString>;
    JWT_ACCESS_SECRET: z.ZodDefault<z.ZodString>;
    JWT_REFRESH_SECRET: z.ZodDefault<z.ZodString>;
    JWT_ACCESS_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    JWT_REFRESH_EXPIRES_IN: z.ZodDefault<z.ZodString>;
    RATE_LIMIT_WINDOW_MS: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    RATE_LIMIT_MAX_REQUESTS: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    DATA_DIR: z.ZodDefault<z.ZodString>;
    PAYMENT_PROVIDER: z.ZodDefault<z.ZodEnum<{
        mock: "mock";
        paypal: "paypal";
        stripe: "stripe";
    }>>;
    PAYMENT_WEBHOOK_SECRET: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type AppConfigType = z.infer<typeof configSchema>;
export declare const appConfig: {
    PORT: number;
    NODE_ENV: "development" | "production" | "test";
    API_PREFIX: string;
    CORS_ORIGIN: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN: string;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
    DATA_DIR: string;
    PAYMENT_PROVIDER: "mock" | "paypal" | "stripe";
    PAYMENT_WEBHOOK_SECRET: string;
};
export {};
