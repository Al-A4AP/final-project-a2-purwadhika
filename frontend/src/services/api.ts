import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/lib/constants';
import { storeAuthNotice } from '@/lib/authNotice';

const isAuthProbe = (url?: string) => url?.includes('/auth/me');

const isAuthPage = () => window.location.pathname.startsWith('/auth');

const redirectToHome = () => {
  if (!isAuthPage()) {
    storeAuthNotice('session_expired');
    window.location.assign('/');
  }
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
      if (!isAuthProbe(error.config?.url)) redirectToHome();
    }
    return Promise.reject(error);
  }
);
