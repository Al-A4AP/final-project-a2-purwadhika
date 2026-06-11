import { getDateKey, getDateStatus } from '@/hooks/pricing-calendar/priceForDate';
import type { Room } from '@/types';

export const getBookingBlockedReason = (isAuthenticated: boolean, verifiedAt?: string | null) => {
  if (!isAuthenticated) return "Login dan verifikasi email diperlukan sebelum membuat pesanan.";
  if (!verifiedAt) return "Silakan verifikasi email Anda sebelum membuat pesanan.";
  return undefined;
};

export const getBlockedReasonLabel = (reason?: string, fallback: string = 'Pesan') => {
  if (!reason) return fallback;
  const lower = reason.toLowerCase();
  if (lower.includes('login')) return 'Login Diperlukan';
  if (lower.includes('verifikasi')) return 'Verifikasi Email';
  if (lower.includes('tanggal')) return 'Pilih Tanggal';
  if (lower.includes('kamar')) return 'Pilih Kamar';
  if (lower.includes('tersedia') || lower.includes('dipesan')) return 'Tanggal Tidak Tersedia';
  return reason;
};

export const isSelectedRangeUnavailable = (room: Room | null, checkIn: string, checkOut: string) => {
  if (!room || !checkIn || !checkOut) return false;
  
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) return false;

  const current = new Date(start);
  while (current < end) {
    const status = getDateStatus(room, getDateKey(current));
    if (status === 'CUSTOMER_BOOKED' || status === 'TENANT_BLOCKED') return true;
    current.setDate(current.getDate() + 1);
  }
  return false;
};
