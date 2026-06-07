import type { PropertyDetail, Room } from "@/types";
import type { VoucherPreview } from "@/types";
import type { BookingDateFormState } from "./date-fields/bookingDateFieldTypes";

export type PaymentMethod = "MANUAL" | "MIDTRANS";
export type GuestType = "adults" | "children" | "babies";

export type BookingGuests = {
  adults: number;
  children: number;
  babies: number;
};

export type BookingGuestIdentity = {
  bookingForSelf: boolean;
  domicileAddress: string;
  email: string;
  ktpAddress: string;
  legalName: string;
  name: string;
  phone: string;
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
  guestIdentity: BookingGuestIdentity;
  voucherCode: string;
  voucherPreview: VoucherPreview | null;
  voucherLoading: boolean;
  applyVoucher: () => Promise<void>;
  clearVoucher: () => void;
  clearReferralCode: () => void;
  referralCode: string;
  setReferralCode: (code: string) => void;
  setVoucherCode: (code: string) => void;
  setGuestIdentityField: (field: keyof BookingGuestIdentity, value: boolean | string) => void;
  updateGuest: (type: GuestType, delta: number) => void;
  agreementAccepted: boolean;
  setAgreementAccepted: (accepted: boolean) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  processing: boolean;
  handleCheckout: (paymentProofFile?: File | null) => Promise<void>;
  totals: BookingTotals | null;
};
