import { api } from './api';
import type { ApiResponse, User } from '@/types';

export const userService = {
  async updateProfile(data: { name?: string; phone?: string }) {
    const res = await api.patch<ApiResponse<User>>('/users/profile', data);
    return res.data.data;
  },
  async requestEmailChange(email: string) {
    const res = await api.patch<ApiResponse<User>>('/users/email-change', { email });
    return res.data.data;
  },
  async updateAvatar(file: File) {
    const fd = new FormData();
    fd.append('avatar', file);
    const res = await api.patch<ApiResponse<User>>('/users/avatar', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  async changePassword(data: { old_password?: string; new_password?: string }) {
    const res = await api.patch<ApiResponse<null>>('/users/change-password', data);
    return res.data;
  },
};
