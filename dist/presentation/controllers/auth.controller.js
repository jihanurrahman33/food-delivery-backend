"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const api_response_1 = require("../../core/types/api-response");
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register = async (req, res, next) => {
        try {
            const result = await this.authService.register(req.body);
            res.status(201).json(api_response_1.ResponseFormatter.success(result, 'Account registered successfully', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.status(200).json(api_response_1.ResponseFormatter.success(result, 'Login successful', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    refreshToken = async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            const tokens = await this.authService.refreshToken(refreshToken);
            res.status(200).json(api_response_1.ResponseFormatter.success(tokens, 'Token refreshed successfully', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    getMe = async (req, res, next) => {
        try {
            const user = await this.authService.getCurrentUser(req.user.userId);
            res.status(200).json(api_response_1.ResponseFormatter.success(user, 'Current user profile retrieved', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    updateMe = async (req, res, next) => {
        try {
            const updated = await this.authService.updateProfile(req.user.userId, req.body);
            res.status(200).json(api_response_1.ResponseFormatter.success(updated, 'Profile updated successfully', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    switchRole = async (req, res, next) => {
        try {
            const updated = await this.authService.switchRole(req.user.userId, req.body.role);
            res.status(200).json(api_response_1.ResponseFormatter.success(updated, `Switched to role '${req.body.role}'`, undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    sendOtp = async (req, res, next) => {
        try {
            const result = await this.authService.sendOtp(req.body.email);
            res.status(200).json(api_response_1.ResponseFormatter.success(result, result.message, undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    verifyOtp = async (req, res, next) => {
        try {
            const valid = await this.authService.verifyOtp(req.body.email, req.body.code);
            res.status(200).json(api_response_1.ResponseFormatter.success({ valid }, 'OTP verification successful', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    resetPassword = async (req, res, next) => {
        try {
            await this.authService.resetPassword(req.body.email, req.body.newPassword);
            res.status(200).json(api_response_1.ResponseFormatter.success(null, 'Password has been reset successfully', undefined, req.correlationId));
        }
        catch (err) {
            next(err);
        }
    };
    logout = async (req, res, next) => {
        res.status(200).json(api_response_1.ResponseFormatter.success(null, 'Logged out successfully', undefined, req.correlationId));
    };
}
exports.AuthController = AuthController;
