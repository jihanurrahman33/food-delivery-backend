"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchRoleSchema = exports.updateProfileSchema = exports.resetPasswordSchema = exports.verifyOtpSchema = exports.sendOtpSchema = exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(50),
    email: zod_1.z.string().email('Invalid email address format'),
    phone: zod_1.z.string().min(7, 'Phone number must be at least 7 digits'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.enum(['customer', 'chef', 'rider']).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address format'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(10, 'Valid refresh token is required'),
});
exports.sendOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address format'),
});
exports.verifyOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address format'),
    code: zod_1.z.string().min(4, 'Code must be 4 characters'),
});
exports.resetPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address format'),
    newPassword: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    phone: zod_1.z.string().min(7).optional(),
    avatarUrl: zod_1.z.string().url().optional(),
    address: zod_1.z.string().optional(),
});
exports.switchRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(['customer', 'chef', 'rider', 'admin']),
});
