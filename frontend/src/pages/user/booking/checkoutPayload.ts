import type { PropertyDetail, Room } from "@/types";
import type { CreateOrderPayload } from "@/services/orderService";
import { toUtcDateTime } from "./bookingDates";
import type { BookingGuests, BookingQuery, PaymentMethod } from "./bookingTypes";

export const createCheckoutPayload = (property: PropertyDetail, room: Room, query: BookingQuery, paymentMethod: PaymentMethod, guests: BookingGuests): CreateOrderPayload => ({
  propertyId: property.id,
  roomId: room.id,
  check_in_date: toUtcDateTime(query.checkIn!),
  check_out_date: toUtcDateTime(query.checkOut!),
  payment_method: paymentMethod,
  adults: guests.adults,
  children: guests.children,
  babies: guests.babies,
});
