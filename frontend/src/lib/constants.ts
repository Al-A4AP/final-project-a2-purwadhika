export const CITIES = [
  'Jakarta',
  'Bandung',
  'Surabaya',
  'Medan',
  'Semarang',
  'Makassar',
  'Palembang',
  'Yogyakarta',
  'Bali',
  'Lombok',
];

export const PROPERTY_CATEGORIES = [
  { id: '1', name: 'Hotel', icon: '🏨' },
  { id: '2', name: 'Apartemen', icon: '🏢' },
  { id: '3', name: 'Rumah', icon: '🏠' },
  { id: '4', name: 'Kost', icon: '🏘️' },
];

export const ITEMS_PER_PAGE = 12;

export const WHATSAPP_NUMBER = '6281234567890';

export const PRICE_RANGES = [
  { label: 'Semua Harga', min: 0, max: Infinity },
  { label: 'Di bawah Rp 500rb', min: 0, max: 500000 },
  { label: 'Rp 500rb - Rp 1jt', min: 500000, max: 1000000 },
  { label: 'Rp 1jt - Rp 2jt', min: 1000000, max: 2000000 },
  { label: 'Di atas Rp 2jt', min: 2000000, max: Infinity },
];

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  THEME: 'app_theme',
  FILTERS: 'property_filters',
};

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+62|62|0)[0-9]{9,12}$/,
};
