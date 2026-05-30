import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/lib/constants';

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
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
