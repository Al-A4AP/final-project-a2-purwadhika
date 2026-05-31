import type { OrderStatus } from "@/types";

export const CITIES = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Medan",
  "Semarang",
  "Makassar",
  "Palembang",
  "Yogyakarta",
  "Bali",
  "Lombok",
];

export const PROPERTY_CATEGORIES = [
  { id: "1", name: "Hotel" },
  { id: "2", name: "Apartemen" },
  { id: "3", name: "Rumah" },
  { id: "4", name: "Villa" },
  { id: "5", name: "Kost" },
];

export const ITEMS_PER_PAGE = 12;

export const WHATSAPP_NUMBER = "6281909333337";

export const PRICE_RANGES = [
  { label: "Semua Harga", min: 0, max: Infinity },
  { label: "Di bawah Rp 500rb", min: 0, max: 500000 },
  { label: "Rp 500rb - Rp 1jt", min: 500000, max: 1000000 },
  { label: "Rp 1jt - Rp 2jt", min: 1000000, max: 2000000 },
  { label: "Di atas Rp 2jt", min: 2000000, max: Infinity },
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  WAITING_PAYMENT: "Menunggu Pembayaran",
  WAITING_CONFIRMATION: "Menunggu Konfirmasi",
  PROCESSED: "Dikonfirmasi",
  COMPLETED: "Selesai Menginap",
  CANCELLED: "Dibatalkan",
};

export const ORDER_STATUS_FILTER_OPTIONS: Array<{
  value: "" | OrderStatus;
  label: string;
}> = [
  { value: "", label: "Semua Status" },
  ...Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
    value: value as OrderStatus,
    label,
  })),
];

export const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  WAITING_PAYMENT: "bg-yellow-100 text-yellow-800",
  WAITING_CONFIRMATION: "bg-blue-100 text-blue-800",
  PROCESSED: "bg-green-100 text-green-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export const ORDER_STATUS_SOFT_CLASSES: Record<OrderStatus, string> = {
  WAITING_PAYMENT: "text-yellow-600 bg-yellow-50",
  WAITING_CONFIRMATION: "text-blue-600 bg-blue-50",
  PROCESSED: "text-green-600 bg-green-50",
  COMPLETED: "text-emerald-600 bg-emerald-50",
  CANCELLED: "text-red-600 bg-red-50",
};

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const STORAGE_KEYS = {
  TOKEN: "auth_token",
  USER: "auth_user",
  THEME: "app_theme",
  FILTERS: "property_filters",
};

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+62|62|0)[0-9]{9,12}$/,
};
