import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address format'),
  phone: z.string().min(7, 'Phone number must be at least 7 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['customer', 'chef', 'rider']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(10, 'Valid refresh token is required'),
});

export const sendOtpSchema = z.object({
  email: z.string().email('Invalid email address format'),
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address format'),
  code: z.string().min(4, 'Code must be 4 characters'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address format'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(7).optional(),
  avatarUrl: z.string().url().optional(),
  address: z.string().optional(),
});

export const switchRoleSchema = z.object({
  role: z.enum(['customer', 'chef', 'rider', 'admin']),
});
