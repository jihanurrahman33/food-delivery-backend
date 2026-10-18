import { SafeUser, UserEntity, UserRole } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories';
export interface TokenPayload {
    userId: string;
    email: string;
    role: UserRole;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
}
export interface AuthResult {
    user: SafeUser;
    tokens: AuthTokens;
}
export declare class AuthService {
    private readonly userRepo;
    private readonly otpCache;
    constructor(userRepo: IUserRepository);
    generateTokens(user: UserEntity): AuthTokens;
    register(dto: {
        name: string;
        email: string;
        phone: string;
        password: string;
        role?: UserRole;
    }): Promise<AuthResult>;
    login(email: string, password: string): Promise<AuthResult>;
    refreshToken(refreshToken: string): Promise<AuthTokens>;
    sendOtp(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyOtp(email: string, code: string): Promise<boolean>;
    resetPassword(email: string, newPassword: string): Promise<void>;
    getCurrentUser(userId: string): Promise<SafeUser>;
    updateProfile(userId: string, dto: {
        name?: string;
        phone?: string;
        avatarUrl?: string;
        address?: string;
    }): Promise<SafeUser>;
    switchRole(userId: string, newRole: UserRole): Promise<SafeUser>;
}
