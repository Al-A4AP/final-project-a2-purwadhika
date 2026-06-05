export type Role = 'USER' | 'TENANT';
export type AuthProvider = 'EMAIL' | 'GOOGLE';

export interface User {
  id: string;
  email: string;
  pending_email?: string | null;
  name: string;
  phone?: string;
  avatar_url?: string;
  auth_provider?: AuthProvider;
  password_set_at?: string | null;
  role: Role;
  verified_at: string | null;
  email_change_requested_at?: string | null;
  created_at: string;
}

export interface AuthResponse {
  user: User;
}
