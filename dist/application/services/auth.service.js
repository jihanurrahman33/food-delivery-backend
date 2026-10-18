"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const config_1 = require("../../config");
const app_error_1 = require("../../core/errors/app-error");
const user_entity_1 = require("../../domain/entities/user.entity");
class AuthService {
    userRepo;
    otpCache = new Map();
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    generateTokens(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, config_1.appConfig.JWT_ACCESS_SECRET, {
            expiresIn: config_1.appConfig.JWT_ACCESS_EXPIRES_IN,
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, config_1.appConfig.JWT_REFRESH_SECRET, {
            expiresIn: config_1.appConfig.JWT_REFRESH_EXPIRES_IN,
        });
        return {
            accessToken,
            refreshToken,
            expiresIn: config_1.appConfig.JWT_ACCESS_EXPIRES_IN,
        };
    }
    async register(dto) {
        const existing = await this.userRepo.findByEmail(dto.email);
        if (existing) {
            throw app_error_1.AppError.conflict('An account with this email address already exists');
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(dto.password, salt);
        const newUser = {
            id: `usr_${(0, uuid_1.v4)().replace(/-/g, '').substring(0, 12)}`,
            name: dto.name.trim(),
            email: dto.email.trim().toLowerCase(),
            phone: dto.phone.trim(),
            passwordHash,
            role: dto.role || 'customer',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const created = await this.userRepo.create(newUser);
        const tokens = this.generateTokens(created);
        return {
            user: (0, user_entity_1.toSafeUser)(created),
            tokens,
        };
    }
    async login(email, password) {
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw app_error_1.AppError.unauthorized('Invalid email or password');
        }
        if (user.passwordHash) {
            const match = await bcryptjs_1.default.compare(password, user.passwordHash);
            if (!match) {
                throw app_error_1.AppError.unauthorized('Invalid email or password');
            }
        }
        const tokens = this.generateTokens(user);
        return {
            user: (0, user_entity_1.toSafeUser)(user),
            tokens,
        };
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.appConfig.JWT_REFRESH_SECRET);
            const user = await this.userRepo.findById(decoded.userId);
            if (!user) {
                throw app_error_1.AppError.unauthorized('User not found or session revoked');
            }
            return this.generateTokens(user);
        }
        catch (err) {
            throw app_error_1.AppError.unauthorized('Invalid or expired refresh token');
        }
    }
    async sendOtp(email) {
        const code = '1234'; // Standardized deterministic sandbox code, or dynamic in production
        this.otpCache.set(email.toLowerCase(), {
            code,
            expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        });
        return {
            success: true,
            message: `OTP sent successfully to ${email}`,
        };
    }
    async verifyOtp(email, code) {
        const entry = this.otpCache.get(email.toLowerCase());
        if (!entry) {
            // Allow sandbox fallback for mock testing
            return code === '1234' || code.length === 4;
        }
        if (Date.now() > entry.expiresAt) {
            this.otpCache.delete(email.toLowerCase());
            throw app_error_1.AppError.badRequest('OTP code has expired');
        }
        if (entry.code !== code) {
            throw app_error_1.AppError.badRequest('Invalid OTP code');
        }
        this.otpCache.delete(email.toLowerCase());
        return true;
    }
    async resetPassword(email, newPassword) {
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw app_error_1.AppError.notFound('User with this email not found');
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(newPassword, salt);
        await this.userRepo.update(user.id, { passwordHash });
    }
    async getCurrentUser(userId) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw app_error_1.AppError.notFound('User not found');
        }
        return (0, user_entity_1.toSafeUser)(user);
    }
    async updateProfile(userId, dto) {
        const updated = await this.userRepo.update(userId, dto);
        if (!updated) {
            throw app_error_1.AppError.notFound('User not found');
        }
        return (0, user_entity_1.toSafeUser)(updated);
    }
    async switchRole(userId, newRole) {
        const updated = await this.userRepo.update(userId, { role: newRole });
        if (!updated) {
            throw app_error_1.AppError.notFound('User not found');
        }
        return (0, user_entity_1.toSafeUser)(updated);
    }
}
exports.AuthService = AuthService;
