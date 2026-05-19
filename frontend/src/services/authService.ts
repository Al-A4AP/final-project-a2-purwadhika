import { api } from './api';
import type { ApiResponse, AuthResponse, User } from '@/types';

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    return res.data.data;
  },

  async register(data: { name: string; email: string; password: string; role: string }) {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data.data;
  },

  async forgotPassword(email: string) {
    const res = await api.post<ApiResponse<null>>('/auth/forgot-password', { email });
    return res.data;
  },

  async resetPassword(token: string, password: string) {
    const res = await api.post<ApiResponse<null>>('/auth/reset-password', { token, password });
    return res.data;
  },

  async getMe() {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },
};
