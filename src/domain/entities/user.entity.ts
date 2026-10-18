export type UserRole = 'customer' | 'chef' | 'rider' | 'admin';

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash?: string;
  avatarUrl?: string;
  role: UserRole;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export type SafeUser = Omit<UserEntity, 'passwordHash'>;

export function toSafeUser(user: UserEntity): SafeUser {
  const { passwordHash, ...safe } = user;
  return safe;
}
