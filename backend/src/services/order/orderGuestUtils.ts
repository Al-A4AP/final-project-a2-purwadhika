import { AppError } from '../../middlewares/errorHandler';
import type { CreateOrderData, GuestCounts } from './orderTypes';

export const pickGuestCounts = ({ adults, children, babies }: CreateOrderData) => ({
  adults,
  children,
  babies,
});

export const validateCapacity = (guests: GuestCounts, capacity: number) => {
  validateAdultCount(guests.adults, capacity);
  validateChildrenCount(guests);
  validateBabyCount(guests);
};

export const buildGuestCreateData = (context: GuestCreateSource) => ({
  booking_for_self: context.booking_for_self ?? true,
  guest_email: context.guest_email || null,
  guest_ktp_address: context.guest_ktp_address || null,
  guest_ktp_number: context.guest_ktp_number || null,
  guest_legal_name: context.guest_legal_name || null,
  guest_name: context.guest_name || null,
  guest_phone: context.guest_phone || null,
});

const validateAdultCount = (adults: number, capacity: number) => {
  if (adults < 1) throw new AppError("Pemesanan harus menyertakan minimal 1 orang dewasa", 400);
  if (adults > capacity) throw new AppError(`Jumlah orang dewasa melebihi kapasitas kamar (${capacity} orang)`, 400);
};

const validateChildrenCount = (guests: GuestCounts) => {
  if (guests.children > guests.adults) {
    throw new AppError(`Jumlah anak-anak tidak boleh melebihi jumlah orang dewasa (${guests.adults} orang)`, 400);
  }
};

const validateBabyCount = (guests: GuestCounts) => {
  if (guests.babies > guests.adults) {
    throw new AppError(`Jumlah bayi tidak boleh melebihi jumlah orang dewasa (${guests.adults} orang)`, 400);
  }
};

type GuestCreateSource = Pick<
  CreateOrderData,
  | 'booking_for_self'
  | 'guest_email'
  | 'guest_ktp_address'
  | 'guest_ktp_number'
  | 'guest_legal_name'
  | 'guest_name'
  | 'guest_phone'
>;
