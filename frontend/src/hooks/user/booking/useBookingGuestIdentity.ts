import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import type { User } from "@/types";
import type { BookingDraftIdentity } from "./bookingDraftStorage";
import type { BookingGuestIdentity } from "./bookingTypes";

export const useBookingGuestIdentity = (
  bookingForSelf: boolean,
  setBookingForSelf: (value: boolean) => void,
  draftIdentity: BookingDraftIdentity,
  setDraftIdentity: (identity: BookingDraftIdentity) => void,
) => {
  const user = useAuthStore((state) => state.user);
  const [manualIdentity, setManualIdentity] = useState(() => buildManualIdentity(draftIdentity));
  const identity = useMemo(() => (
    bookingForSelf ? buildUserIdentity(user, draftIdentity) : manualIdentity
  ), [bookingForSelf, draftIdentity, manualIdentity, user]);
  usePersistManualIdentity(bookingForSelf, manualIdentity, setDraftIdentity);
  const setGuestIdentityField = buildIdentitySetter(setBookingForSelf, setManualIdentity);
  return { guestIdentity: identity, setGuestIdentityField };
};

const buildIdentitySetter = (
  setBookingForSelf: (value: boolean) => void,
  setManualIdentity: (identity: BookingGuestIdentity | IdentityUpdater) => void,
) => (field: keyof BookingGuestIdentity, value: boolean | string) => {
  if (field === "bookingForSelf") return setBookingForSelf(Boolean(value));
  setManualIdentity((current) => ({ ...current, [field]: value }));
};

const buildUserIdentity = (
  user: User | null,
  draft: BookingDraftIdentity,
): BookingGuestIdentity => ({
  bookingForSelf: true,
  email: user?.email || draft.guestEmail,
  ktpAddress: user?.ktp_address || draft.guestKtpAddress,
  ktpNumber: user?.ktp_number || "",
  legalName: user?.legal_name || user?.name || draft.guestKtpName,
  name: user?.name || draft.guestName,
  phone: user?.phone || draft.guestPhone,
});

const buildManualIdentity = (draft: BookingDraftIdentity): BookingGuestIdentity => ({
  bookingForSelf: false,
  email: draft.guestEmail,
  ktpAddress: draft.guestKtpAddress,
  ktpNumber: "",
  legalName: draft.guestKtpName,
  name: draft.guestName,
  phone: draft.guestPhone,
});

const usePersistManualIdentity = (
  bookingForSelf: boolean,
  identity: BookingGuestIdentity,
  setDraftIdentity: (identity: BookingDraftIdentity) => void,
) => {
  useEffect(() => {
    if (!bookingForSelf) setDraftIdentity(toDraftIdentity(identity));
  }, [bookingForSelf, identity, setDraftIdentity]);
};

const toDraftIdentity = (identity: BookingGuestIdentity): BookingDraftIdentity => ({
  guestName: identity.name,
  guestKtpName: identity.legalName,
  guestPhone: identity.phone,
  guestEmail: identity.email,
  guestKtpAddress: identity.ktpAddress,
});

type IdentityUpdater = (current: BookingGuestIdentity) => BookingGuestIdentity;
