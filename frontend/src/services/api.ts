import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';
import { storeAuthNotice } from '@/lib/authNotice';
import { clearLegacyAuthUser } from '@/lib/browserStorageCleanup';

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
      clearLegacyAuthUser();
      if (!isAuthProbe(error.config?.url)) redirectToHome();
    }
    return Promise.reject(error);
  }
);
