export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  username: string;
  password_hash: string | null;
  created_at: string;
  email: string;
  role: UserRole;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: UserRole;
}

export interface AuthResponse {
  message: string;
  user?: UserProfile;
  error?: string;
}
