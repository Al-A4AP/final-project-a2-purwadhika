import { create } from 'zustand';
import type { User } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { authService } from '@/services/authService';

interface AuthStore {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isTenant: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isTenant: false,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user, isTenant: user?.role === 'TENANT' });
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  setToken: (token) => {
    set({ token });
    if (token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false, isTenant: false });
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  hydrate: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ token, user, isAuthenticated: true, isTenant: user.role === 'TENANT' });
        
        // Verifikasi token ke backend di latar belakang untuk menghindari status kedaluwarsa
        authService.getMe()
          .then((updatedUser) => {
            set({ user: updatedUser, isTenant: updatedUser.role === 'TENANT' });
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
          })
          .catch(() => {
            // Token tidak valid atau kedaluwarsa, logout user
            set({ user: null, token: null, isAuthenticated: false, isTenant: false });
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
          });
      } catch {
        // Data penyimpanan tidak valid — abaikan
      }
    }
  },
}));
