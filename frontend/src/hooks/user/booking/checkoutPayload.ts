import type { PropertyDetail, Room } from "@/types";
import type { CreateOrderPayload } from "@/services/orderService";
import { toUtcDateTime } from "./bookingDates";
import type { BookingGuestIdentity, BookingGuests, BookingQuery, PaymentMethod } from "./bookingTypes";

export const createCheckoutPayload = (property: PropertyDetail, room: Room, query: BookingQuery, paymentMethod: PaymentMethod, guests: BookingGuests, identity: BookingGuestIdentity, voucherCode?: string, referralCode?: string): CreateOrderPayload => ({
  propertyId: property.id,
  roomId: room.id,
  check_in_date: toUtcDateTime(query.checkIn!),
  check_out_date: toUtcDateTime(query.checkOut!),
  payment_method: paymentMethod,
  ...buildGuestPayload(identity),
  ...(referralCode?.trim() ? { referral_code: referralCode.trim().toUpperCase() } : {}),
  ...(voucherCode?.trim() ? { voucher_code: voucherCode.trim().toUpperCase() } : {}),
  adults: guests.adults,
  children: guests.children,
  babies: guests.babies,
});

const buildGuestPayload = (identity: BookingGuestIdentity) => ({
  booking_for_self: identity.bookingForSelf,
  guest_domicile_address: identity.domicileAddress || undefined,
  guest_email: identity.email || undefined,
  guest_ktp_address: identity.ktpAddress,
  guest_legal_name: identity.legalName,
  guest_name: identity.name || undefined,
  guest_phone: identity.phone,
});
