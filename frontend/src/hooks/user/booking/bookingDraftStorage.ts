import type { BookingQuery, PaymentMethod } from "./bookingTypes";

const BOOKING_DRAFT_PREFIX = "purwaloka:booking-draft";

export type BookingDraft = {
  propertyId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  babies: number;
  bookingForSelf: boolean;
  voucherCode: string;
  currentStep: number;
  paymentMethod: PaymentMethod;
};

// Do not store PII in booking draft.
export const getBookingDraft = (key: string): BookingDraft | null => {
  try {
    const stored = sessionStorage.getItem(key);
    return stored ? parseBookingDraft(JSON.parse(stored)) : null;
  } catch {
    return null;
  }
};

export const saveBookingDraft = (key: string, draft: BookingDraft) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(copyBookingDraft(draft)));
  } catch {
    // Draft persistence is best-effort and must not block booking.
  }
};

export const clearBookingDraft = (key: string) => {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // Storage may be unavailable in privacy-restricted browser contexts.
  }
};

export const buildBookingDraftKey = (
  propertyId: string,
  roomId: string,
  checkIn: string,
  checkOut: string,
) => [BOOKING_DRAFT_PREFIX, propertyId, roomId, checkIn, checkOut]
  .map(encodeURIComponent)
  .join(":");

export const getBookingDraftKey = (query: BookingQuery) => {
  if (!query.propertyId || !query.roomId || !query.checkIn || !query.checkOut) return null;
  return buildBookingDraftKey(query.propertyId, query.roomId, query.checkIn, query.checkOut);
};

const parseBookingDraft = (value: unknown): BookingDraft | null => {
  if (!isRecord(value) || !hasValidDraftFields(value)) return null;
  return copyBookingDraft(value);
};

const copyBookingDraft = (value: BookingDraft): BookingDraft => ({
  propertyId: value.propertyId,
  roomId: value.roomId,
  checkIn: value.checkIn,
  checkOut: value.checkOut,
  adults: value.adults,
  children: value.children,
  babies: value.babies,
  bookingForSelf: value.bookingForSelf,
  voucherCode: value.voucherCode,
  currentStep: value.currentStep,
  paymentMethod: value.paymentMethod,
});

const hasValidDraftFields = (value: Record<string, unknown>): value is BookingDraft =>
  isText(value.propertyId) &&
  isText(value.roomId) &&
  isText(value.checkIn) &&
  isText(value.checkOut) &&
  isGuestCount(value.adults, 1) &&
  isGuestCount(value.children, 0) &&
  isGuestCount(value.babies, 0) &&
  typeof value.bookingForSelf === "boolean" &&
  typeof value.voucherCode === "string" &&
  isCurrentStep(value.currentStep) &&
  isPaymentMethod(value.paymentMethod);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isText = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

const isGuestCount = (value: unknown, minimum: number): value is number =>
  Number.isInteger(value) && Number(value) >= minimum;

const isCurrentStep = (value: unknown): value is number =>
  Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 6;

const isPaymentMethod = (value: unknown): value is PaymentMethod =>
  value === "MANUAL" || value === "MIDTRANS";
