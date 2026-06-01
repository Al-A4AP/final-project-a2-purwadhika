import type { PropertyDetail, Room } from "@/types";
import type { BookingDateFormState } from "./date-fields/bookingDateFieldTypes";

export type PaymentMethod = "MANUAL" | "MIDTRANS";
export type GuestType = "adults" | "children" | "babies";

export type BookingGuests = {
  adults: number;
  children: number;
  babies: number;
};

export type BookingQuery = {
  propertyId: string | null;
  roomId: string | null;
  checkIn: string | null;
  checkOut: string | null;
};

export type BookingTotals = {
  checkInDate: Date;
  checkOutDate: Date;
  nights: number;
  totalRoomPrice: number;
  totalPrice: number;
};

export type BookingPageState = {
  property: PropertyDetail | null;
  room: Room | null;
  loading: boolean;
  dateForm: BookingDateFormState;
  guests: BookingGuests;
  updateGuest: (type: GuestType, delta: number) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  processing: boolean;
  handleCheckout: () => Promise<void>;
  totals: BookingTotals | null;
};
