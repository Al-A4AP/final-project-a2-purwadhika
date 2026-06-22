import type { BookingQuery, PaymentMethod } from "./bookingTypes";

const BOOKING_DRAFT_PREFIX = "purwaloka:booking-draft";
const FORBIDDEN_DRAFT_FIELDS = new Set([
  "ktpnumber",
  "guestktpnumber",
  "nik",
  "nomorktp",
]);

export type BookingDraftIdentity = {
  guestName: string;
  guestKtpName: string;
  guestPhone: string;
  guestEmail: string;
  guestKtpAddress: string;
};

export type BookingDraft = BookingDraftIdentity & {
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

// Never store KTP/NIK numbers, auth tokens, or upload data in booking draft.
export const getBookingDraft = (key: string): BookingDraft | null => {
  try {
    const stored = sessionStorage.getItem(key);
    return stored ? sanitizeBookingDraft(JSON.parse(stored)) : null;
  } catch {
    return null;
  }
};

export const saveBookingDraft = (key: string, draft: BookingDraft) => {
  try {
    const safeDraft = sanitizeBookingDraft(draft);
    if (safeDraft) sessionStorage.setItem(key, JSON.stringify(safeDraft));
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

export const getBookingDraftIdentity = (draft: BookingDraft): BookingDraftIdentity => ({
  guestName: draft.guestName,
  guestKtpName: draft.guestKtpName,
  guestPhone: draft.guestPhone,
  guestEmail: draft.guestEmail,
  guestKtpAddress: draft.guestKtpAddress,
});

const sanitizeBookingDraft = (value: unknown): BookingDraft | null => {
  if (!isRecord(value)) return null;
  const safeValue = normalizeDraftIdentity(removeForbiddenDraftFields(value));
  return hasValidDraftFields(safeValue) ? copyBookingDraft(safeValue) : null;
};

const copyBookingDraft = (value: BookingDraft): BookingDraft => ({
  ...getBookingDraftIdentity(value),
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
  hasValidIdentityFields(value) &&
  typeof value.bookingForSelf === "boolean" &&
  typeof value.voucherCode === "string" &&
  isCurrentStep(value.currentStep) &&
  isPaymentMethod(value.paymentMethod);

const hasValidIdentityFields = (value: Record<string, unknown>) =>
  typeof value.guestName === "string" &&
  typeof value.guestKtpName === "string" &&
  typeof value.guestPhone === "string" &&
  typeof value.guestEmail === "string" &&
  typeof value.guestKtpAddress === "string";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const removeForbiddenDraftFields = (value: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(value).filter(([key]) => !isForbiddenDraftField(key)),
  );

const normalizeDraftIdentity = (value: Record<string, unknown>) => ({
  ...value,
  guestName: firstString(value.guestName, value.name, value.guest_name),
  guestKtpName: firstString(value.guestKtpName, value.legalName, value.guest_legal_name),
  guestPhone: firstString(value.guestPhone, value.phone, value.guest_phone),
  guestEmail: firstString(value.guestEmail, value.email, value.guest_email),
  guestKtpAddress: firstString(value.guestKtpAddress, value.ktpAddress, value.guest_ktp_address),
});

const firstString = (...values: unknown[]) =>
  values.find((value): value is string => typeof value === "string") || "";

const isForbiddenDraftField = (key: string) => {
  const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (FORBIDDEN_DRAFT_FIELDS.has(normalized)) return true;
  const identityNumber = normalized.includes("ktp") || normalized.includes("nik");
  const numberMarker = normalized.includes("number") || normalized.includes("nomor") || normalized.endsWith("no");
  return identityNumber && numberMarker;
};

const isText = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

const isGuestCount = (value: unknown, minimum: number): value is number =>
  Number.isInteger(value) && Number(value) >= minimum;

const isCurrentStep = (value: unknown): value is number =>
  Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 6;

const isPaymentMethod = (value: unknown): value is PaymentMethod =>
  value === "MANUAL" || value === "MIDTRANS";
