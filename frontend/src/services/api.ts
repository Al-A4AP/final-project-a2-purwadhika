import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/lib/constants';

const isAuthProbe = (url?: string) => url?.includes('/auth/me');

const isAuthPage = () => window.location.pathname.startsWith('/auth');

const redirectToLogin = () => {
  if (!isAuthPage()) window.location.assign('/auth/login');
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.USER);
      if (!isAuthProbe(error.config?.url)) redirectToLogin();
    }
    return Promise.reject(error);
  }
);
