import { formatDateKey } from './availabilityDates';
import type { AvailabilityResult } from './availabilityTypes';

export const availableResult = (): AvailabilityResult => ({ available: true });

export const blockedResult = (date: Date): AvailabilityResult => ({
  available: false,
  reason: `Kamar tidak tersedia (di-block oleh pengelola) pada tanggal ${formatDateKey(date)}`,
  source: 'TENANT_BLOCKED',
});

export const fullResult = (date: Date): AvailabilityResult => ({
  available: false,
  reason: `Kamar sudah penuh dipesan pada tanggal ${formatDateKey(date)}`,
  source: 'CUSTOMER_BOOKED',
});
