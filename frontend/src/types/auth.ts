export type Role = 'USER' | 'TENANT';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  role: Role;
  verified_at: string | null;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
