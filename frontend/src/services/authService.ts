import { api } from './api';
import type { ApiResponse, AuthResponse, Role, User } from '@/types';

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    return res.data.data;
  },

  async googleLogin(data: { accessToken: string; role?: Role; mode?: "login" | "register" }) {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/google-login', data);
    return res.data.data;
  },

  async register(data: { name: string; email: string; role: string }) {
    const res = await api.post<ApiResponse<{ email: string }>>('/auth/register', data);
    return res.data.data;
  },

  async verifyEmail(token: string, password: string) {
    const res = await api.post<ApiResponse<null>>('/auth/verify-email', { token, password });
    return res.data;
  },

  async verifyEmailChange(token: string) {
    const res = await api.post<ApiResponse<{ email: string }>>('/auth/verify-email-change', { token });
    return res.data.data;
  },

  async resendVerification(email: string) {
    const res = await api.post<ApiResponse<null>>('/auth/resend-verification', { email });
    return res.data;
  },

  async forgotPassword(email: string) {
    const res = await api.post<ApiResponse<null>>('/auth/forgot-password', { email });
    return res.data;
  },

  async resetPassword(token: string, password: string) {
    const res = await api.post<ApiResponse<null>>('/auth/reset-password', { token, password });
    return res.data;
  },

  async logout() {
    await api.post('/auth/logout');
  },

  async getMe() {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },
};
