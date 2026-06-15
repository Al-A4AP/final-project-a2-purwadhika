import { PaymentMethod } from '@prisma/client';

export interface CreateOrderData {
  userId: string;
  propertyId: string;
  roomId: string;
  check_in_date: string;
  check_out_date: string;
  payment_method: PaymentMethod;
  booking_for_self?: boolean;
  guest_name?: string;
  guest_legal_name?: string;
  guest_phone?: string;
  guest_email?: string;
  guest_ktp_address?: string;
  guest_ktp_number?: string;
  voucher_code?: string;
  adults: number;
  children: number;
  babies: number;
}

export interface GuestCounts {
  adults: number;
  children: number;
  babies: number;
}
