import { create } from 'zustand';
import type { User } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';

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
      } catch {
        // Invalid storage data — intentionally ignored
      }
    }
  },
}));
