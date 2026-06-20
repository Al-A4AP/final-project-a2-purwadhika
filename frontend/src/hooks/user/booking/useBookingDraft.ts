import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  clearBookingDraft,
  getBookingDraft,
  getBookingDraftKey,
  saveBookingDraft,
  type BookingDraft,
} from "./bookingDraftStorage";
import type { BookingGuests, BookingQuery, PaymentMethod } from "./bookingTypes";

const SAVE_DELAY_MS = 150;

export const useBookingDraft = (query: BookingQuery) => {
  const key = getBookingDraftKey(query);
  const [draft, setDraft] = useState(() => loadInitialDraft(query, key));
  const [persistenceEnabled, setPersistenceEnabled] = useState(Boolean(key));
  useDraftPersistence(key, draft, persistenceEnabled);
  const clearDraft = useClearDraft(key, setPersistenceEnabled);
  return { draft, clearDraft, ...buildDraftSetters(setDraft) };
};

const useDraftPersistence = (key: string | null, draft: BookingDraft, enabled: boolean) => {
  useEffect(() => {
    if (!key || !enabled) return;
    const timeout = window.setTimeout(() => saveBookingDraft(key, draft), SAVE_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, [draft, enabled, key]);
};

const useClearDraft = (key: string | null, setEnabled: (enabled: boolean) => void) =>
  useCallback(() => {
    setEnabled(false);
    if (key) clearBookingDraft(key);
  }, [key, setEnabled]);

const buildDraftSetters = (setDraft: Dispatch<SetStateAction<BookingDraft>>) => ({
  setGuests: (guests: BookingGuests | GuestUpdater) =>
    setDraft((current) => mergeGuests(current, resolveGuests(guests, current))),
  setBookingForSelf: (bookingForSelf: boolean) =>
    setDraft((current) => ({ ...current, bookingForSelf })),
  setVoucherCode: (voucherCode: string) =>
    setDraft((current) => ({ ...current, voucherCode })),
  setCurrentStep: (currentStep: number | StepUpdater) =>
    setDraft((current) => ({ ...current, currentStep: resolveStep(currentStep, current) })),
  setPaymentMethod: (paymentMethod: PaymentMethod) =>
    setDraft((current) => ({ ...current, paymentMethod })),
});

const loadInitialDraft = (query: BookingQuery, key: string | null) => {
  const stored = key ? getBookingDraft(key) : null;
  return stored && matchesQuery(stored, query) ? stored : buildDefaultDraft(query);
};

const buildDefaultDraft = (query: BookingQuery): BookingDraft => ({
  propertyId: query.propertyId || "",
  roomId: query.roomId || "",
  checkIn: query.checkIn || "",
  checkOut: query.checkOut || "",
  adults: 1,
  children: 0,
  babies: 0,
  bookingForSelf: true,
  voucherCode: "",
  currentStep: 1,
  paymentMethod: "MIDTRANS",
});

const matchesQuery = (draft: BookingDraft, query: BookingQuery) =>
  draft.propertyId === query.propertyId &&
  draft.roomId === query.roomId &&
  draft.checkIn === query.checkIn &&
  draft.checkOut === query.checkOut;

const resolveGuests = (guests: BookingGuests | GuestUpdater, current: BookingDraft) =>
  typeof guests === "function" ? guests(toGuests(current)) : guests;

const resolveStep = (step: number | StepUpdater, current: BookingDraft) =>
  typeof step === "function" ? step(current.currentStep) : step;

const mergeGuests = (draft: BookingDraft, guests: BookingGuests): BookingDraft => ({
  ...draft,
  ...guests,
});

const toGuests = (draft: BookingDraft): BookingGuests => ({
  adults: draft.adults,
  children: draft.children,
  babies: draft.babies,
});

type GuestUpdater = (current: BookingGuests) => BookingGuests;
type StepUpdater = (current: number) => number;
